"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-workspace";
import { revalidatePath } from "next/cache";

export async function submitClientRequest(formData: FormData) {
    const user = await currentUser();

    if (!user || user.role !== "CLIENT") {
        return { error: "Unauthorized" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const clientId = formData.get("clientId") as string;

    if (!title || !clientId) {
        return { error: "Missing required fields" };
    }

    // Security check: ensure the clientId actually belongs to this user
    const clientRecord = await db.client.findFirst({
        where: {
            id: clientId,
            email: user.email,
        }
    });

    if (!clientRecord) {
        return { error: "Invalid client credentials" };
    }

    try {
        await db.request.create({
            data: {
                title,
                description,
                status: "Backlog", // All new client requests go to backlog
                clientId,
                workspaceId: clientRecord.workspaceId, // [SECURITY FIX]: Never trust client-provided IDs. Derive strictly from the validated DB record.
            }
        });

        // Revalidate the portal and the agency dashboard so it updates live
        revalidatePath("/portal");
        revalidatePath("/dashboard/requests");

        return { success: true };
    } catch (error) {
        console.error("Error submitting request:", error);
        return { error: "Failed to submit request" };
    }
}
