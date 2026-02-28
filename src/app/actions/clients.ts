"use server";

import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/current-workspace";
import { revalidatePath } from "next/cache";

export async function createClient(data: {
    name: string;
    contactName?: string;
    email: string;
    plan?: string;
}) {
    const workspace = await currentWorkspace();

    if (!workspace) {
        throw new Error("Unauthorized");
    }

    const client = await db.client.create({
        data: {
            ...data,
            workspaceId: workspace.id,
            status: "Active",
        },
    });

    revalidatePath("/dashboard/clients");
    return client;
}
