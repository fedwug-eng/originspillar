"use server";

import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/current-workspace";
import { revalidatePath } from "next/cache";

export async function createRequest(data: {
    title: string;
    description?: string;
    tag?: string;
    clientId: string;
    serviceId?: string;
}) {
    const workspace = await currentWorkspace();

    if (!workspace) {
        throw new Error("Unauthorized");
    }

    const request = await db.request.create({
        data: {
            ...data,
            workspaceId: workspace.id,
            status: "Backlog",
        },
    });

    revalidatePath("/dashboard/requests");
    return request;
}

export async function updateRequestStatus(id: string, status: string) {
    const workspace = await currentWorkspace();

    if (!workspace) {
        throw new Error("Unauthorized");
    }

    const request = await db.request.update({
        where: {
            id,
            workspaceId: workspace.id,
        },
        data: {
            status,
        },
    });

    revalidatePath("/dashboard/requests");
    return request;
}
