import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-workspace";
import { logActivity } from "@/lib/activity";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// GET: List all API keys for the workspace
export async function GET() {
    try {
        const user = await currentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const keys = await db.apiKey.findMany({
            where: { workspaceId: user.workspace.id },
            orderBy: { createdAt: "desc" },
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

        return NextResponse.json({ keys });
    } catch (error) {
        console.error("GET /api/api-keys error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

// POST: Add a new API key
export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { name, key } = await req.json();
        if (!name?.trim() || !key?.trim()) {
            return NextResponse.json({ error: "Name and key are required" }, { status: 400 });
        }

        // Hash the key for secure storage
        const keyHash = crypto.createHash("sha256").update(key.trim()).digest("hex");
        // Store the first 8 chars + last 3 as the visible prefix
        const keyPrefix = key.trim().length > 11
            ? key.trim().slice(0, 8) + "..." + key.trim().slice(-3)
            : key.trim().slice(0, 8);

        const apiKey = await db.apiKey.create({
            data: {
                name: name.trim(),
                keyHash,
                keyPrefix,
                keyType: "external",
                status: "active",
                workspaceId: user.workspace.id,
            },
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
            action: "apikey.created",
            resourceType: "apikey",
            resourceId: apiKey.id,
            workspaceId: user.workspace.id,
            metadata: { name: apiKey.name },
        });

        return NextResponse.json({ key: apiKey });
    } catch (error) {
        console.error("POST /api/api-keys error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
