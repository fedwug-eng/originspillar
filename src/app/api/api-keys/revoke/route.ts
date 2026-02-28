import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-workspace";
import { logActivity } from "@/lib/activity";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { keyId } = await req.json();
        if (!keyId) {
            return NextResponse.json({ error: "keyId is required" }, { status: 400 });
        }

        // Verify the key belongs to this workspace
        const existing = await db.apiKey.findFirst({
            where: { id: keyId, workspaceId: user.workspace.id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Key not found" }, { status: 404 });
        }

        const updated = await db.apiKey.update({
            where: { id: keyId },
            data: { status: "revoked" },
            select: {
                id: true,
                name: true,
                keyPrefix: true,
                keyType: true,
                status: true,
                lastUsedAt: true,
                createdAt: true,
            },
        });

        await logActivity({
            actorId: user.id,
            action: "apikey.revoked",
            resourceType: "apikey",
            resourceId: keyId,
            workspaceId: user.workspace.id,
            metadata: { name: existing.name },
        });

        return NextResponse.json({ key: updated });
    } catch (error) {
        console.error("POST /api/api-keys/revoke error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
