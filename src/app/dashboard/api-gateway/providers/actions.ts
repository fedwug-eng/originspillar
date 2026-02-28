"use server";

import { currentUser } from "@/lib/current-workspace";
import { db } from "@/lib/db";
import { encrypt } from "@/lib/encryption";
import { revalidatePath } from "next/cache";

const BUILTIN_PROVIDERS = ['openai', 'anthropic', 'deepseek'];

export async function addProviderCredential(data: {
    provider: string;
    apiKey: string;
    keyName?: string;
    providerType?: string;
    endpointUrl?: string;
    models?: string[];
    apiFormat?: string;
}) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const { provider, apiKey, keyName, providerType, endpointUrl, models, apiFormat } = data;

    if (!apiKey || !provider) {
        throw new Error("Provider and API Key are required");
    }

    const isBuiltin = providerType === 'builtin' || BUILTIN_PROVIDERS.includes(provider);
    const actualProviderType = isBuiltin ? 'builtin' : 'custom';

    const encryptedKey = encrypt(apiKey);
    const keyPreview = '...' + apiKey.slice(-4);
    const name = keyName || (isBuiltin
        ? `${provider.charAt(0).toUpperCase() + provider.slice(1)} Key`
        : `Custom: ${provider}`);

    const modelsJson = models ? JSON.stringify(models) : null;

    if (isBuiltin) {
        const existing = await db.providerCredential.findFirst({
            where: {
                workspaceId: user.workspace.id,
                provider: provider,
                providerType: 'builtin',
            },
        });

        if (existing) {
            await db.providerCredential.update({
                where: { id: existing.id },
                data: {
                    encryptedKey,
                    keyPreview,
                    keyName: name,
                    models: modelsJson,
                    isActive: true,
                },
            });
            revalidatePath("/dashboard/api-gateway/providers");
            return { success: true };
        }
    }

    await db.providerCredential.create({
        data: {
            workspaceId: user.workspace.id,
            provider,
            providerType: actualProviderType,
            encryptedKey,
            keyPreview,
            keyName: name,
            endpointUrl: isBuiltin ? null : endpointUrl,
            models: modelsJson,
            apiFormat: apiFormat || 'openai',
            isActive: true,
        },
    });

    revalidatePath("/dashboard/api-gateway/providers");
    return { success: true };
}

export async function deleteProviderCredential(id: string) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const providerKey = await db.providerCredential.findUnique({
        where: { id },
    });

    if (!providerKey || providerKey.workspaceId !== user.workspace.id) {
        throw new Error("Provider key not found");
    }

    await db.providerCredential.delete({
        where: { id },
    });

    revalidatePath("/dashboard/api-gateway/providers");
    return { success: true };
}

export async function toggleProviderCredential(id: string, isActive: boolean) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const providerKey = await db.providerCredential.findUnique({
        where: { id },
    });

    if (!providerKey || providerKey.workspaceId !== user.workspace.id) {
        throw new Error("Provider key not found");
    }

    await db.providerCredential.update({
        where: { id },
        data: { isActive },
    });

    revalidatePath("/dashboard/api-gateway/providers");
    return { success: true };
}
