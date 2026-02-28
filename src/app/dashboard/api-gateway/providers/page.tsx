import { currentUser } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ProvidersClient } from "./ProvidersClient";

export default async function ProvidersPage() {
    const user = await currentUser();

    if (!user) {
        return redirect("/sign-in");
    }

    const providers = await db.providerCredential.findMany({
        where: { workspaceId: user.workspace.id },
        orderBy: { createdAt: "desc" },
    });

    const parsedProviders = providers.map((p) => ({
        id: p.id,
        provider: p.provider,
        keyHint: p.keyPreview,
        isActive: p.isActive,
        models: p.models ? JSON.parse(p.models) : [],
        lastUsedAt: p.lastUsedAt,
        createdAt: p.createdAt,
    }));

    return (
        <ProvidersClient initialProviders={parsedProviders} />
    );
}
