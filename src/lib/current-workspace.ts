import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Workspace, User } from "@prisma/client";

export const currentUser = async (): Promise<(User & { workspace: Workspace }) | null> => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: { workspace: true },
    });

    if (!user || !user.workspace) {
        return null;
    }

    return user;
};

export const currentWorkspace = async (): Promise<Workspace | null> => {
    const user = await currentUser();
    return user?.workspace || null;
};
