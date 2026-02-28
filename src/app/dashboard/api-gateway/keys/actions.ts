"use server";

import { currentUser } from "@/lib/current-workspace";
import { db } from "@/lib/db";
import { generateApiKey, getKeyPrefix, hashApiKey } from "@/lib/encryption";
import { revalidatePath } from "next/cache";

export async function createGatewayKey(data: {
    keyName: string;
    rateLimitRpm?: number;
    rateLimitRpd?: number;
    maxTokens?: number;
}) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const { keyName, rateLimitRpm = 60, rateLimitRpd = 1000, maxTokens = 4096 } = data;

    if (!keyName) {
        throw new Error("Key name is required");
    }

    // Generate a secure random key with 'af_' prefix
    const rawApiKey = generateApiKey('af');
    const keyPrefix = getKeyPrefix(rawApiKey);
    const keyHash = hashApiKey(rawApiKey);

    const gatewayKey = await db.gatewayKey.create({
        data: {
            workspaceId: user.workspace.id,
            keyName,
            keyPrefix,
            keyHash,
            rateLimitRpm,
            rateLimitRpd,
            maxTokensPerRequest: maxTokens,
            status: 'active',
        },
    });

    revalidatePath("/dashboard/api-gateway/keys");

    // We strictly return the raw string once. It is never stored.
    return {
        id: gatewayKey.id,
        keyName: gatewayKey.keyName,
        apiKey: rawApiKey
    };
}

export async function revokeGatewayKey(id: string) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const gatewayKey = await db.gatewayKey.findUnique({
        where: { id },
    });

    if (!gatewayKey || gatewayKey.workspaceId !== user.workspace.id) {
        throw new Error("API Key not found");
    }

    await db.gatewayKey.update({
        where: { id },
        data: { status: 'revoked' },
    });

    revalidatePath("/dashboard/api-gateway/keys");
    return { success: true };
}
