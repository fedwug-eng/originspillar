"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-workspace";
import { revalidatePath } from "next/cache";

export async function postComment(formData: FormData) {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const text = formData.get("text") as string;
    const requestId = formData.get("requestId") as string;
    const workspaceId = formData.get("workspaceId") as string;

    if (!text || !requestId || !workspaceId) {
        return { error: "Missing required fields" };
    }

    // Security Check: To post a comment on a request, the user must either be:
    // 1. An ADMIN/MANAGER/MEMBER of the workspace the request belongs to.
    // 2. The specific CLIENT the request belongs to.
    if (user.role === "CLIENT") {
        const clientAccess = await db.request.findFirst({
            where: {
                id: requestId,
                workspaceId: workspaceId,
                client: {
                    email: user.email,
                }
            }
        });
        if (!clientAccess) return { error: "Unauthorized access to request" };
    } else {
        // Agency user. Check workspace matches.
        if (user.workspaceId !== workspaceId) return { error: "Cross-workspace access denied" };
    }

    try {
        await db.comment.create({
            data: {
                text,
                requestId,
                workspaceId,
                authorId: user.id
            }
        });

        // Revalidate everywhere the detailed view is mounted
        revalidatePath("/dashboard/requests");
        revalidatePath("/portal");

        return { success: true };
    } catch (error) {
        console.error("Error posting comment:", error);
        return { error: "Failed to post comment" };
    }
}
