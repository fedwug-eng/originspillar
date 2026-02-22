import { auth, currentUser as clerkCurrentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Workspace, User } from "@prisma/client";

export const currentUser = async (): Promise<(User & { workspace: Workspace }) | null> => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    let user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: { workspace: true },
    });

    // Auto-provision: If Clerk authenticated but no DB record exists,
    // create the user and workspace on-the-fly (webhook fallback)
    if (!user) {
        try {
            const clerkUser = await clerkCurrentUser();
            if (!clerkUser) return null;

            const email = clerkUser.emailAddresses[0]?.emailAddress;
            if (!email) return null;

            // Check if this user matches an existing Client record
            const existingClient = await db.client.findFirst({
                where: { email: email.toLowerCase() },
            });

            if (existingClient) {
                // Map to existing workspace as CLIENT
                user = await db.user.create({
                    data: {
                        clerkUserId: userId,
                        email: email,
                        firstName: clerkUser.firstName,
                        lastName: clerkUser.lastName,
                        role: "CLIENT",
                        workspaceId: existingClient.workspaceId,
                    },
                    include: { workspace: true },
                });
            } else {
                // Create new workspace + ADMIN user
                const workspace = await db.workspace.create({
                    data: {
                        name: `${clerkUser.firstName || "Agency"}'s Workspace`,
                        slug: `ws-${userId.substring(0, 8).toLowerCase()}`,
                    },
                });

                user = await db.user.create({
                    data: {
                        clerkUserId: userId,
                        email: email,
                        firstName: clerkUser.firstName,
                        lastName: clerkUser.lastName,
                        role: "ADMIN",
                        workspaceId: workspace.id,
                    },
                    include: { workspace: true },
                });
            }

            console.log(`Auto-provisioned user ${userId} with workspace`);
        } catch (error) {
            console.error("Auto-provision failed:", error);
            return null;
        }
    }

    if (!user || !user.workspace) {
        return null;
    }

    return user;
};

export const currentWorkspace = async (): Promise<Workspace | null> => {
    const user = await currentUser();
    return user?.workspace || null;
};
