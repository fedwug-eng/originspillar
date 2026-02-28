"use server";

import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/current-workspace";
import { revalidatePath } from "next/cache";

export async function createService(data: {
    name: string;
    description?: string;
    price: number;
    type: string;
}) {
    const workspace = await currentWorkspace();

    if (!workspace) {
        throw new Error("Unauthorized");
    }

    const service = await db.service.create({
        data: {
            ...data,
            workspaceId: workspace.id,
            status: "Active",
        },
    });

    revalidatePath("/dashboard/services");
    return service;
}
