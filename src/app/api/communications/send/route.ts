import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-workspace";
import { logActivity } from "@/lib/activity";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { conversationId, body } = await req.json();
        if (!conversationId || !body?.trim()) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const conversation = await db.conversation.findFirst({
            where: { id: conversationId, workspaceId: user.workspace.id },
            include: { client: { select: { name: true } } },
        });
        if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

        const message = await db.message.create({
            data: {
                conversationId,
                senderId: user.id,
                senderType: "agency",
                body: body.trim(),
                workspaceId: user.workspace.id,
            },
        });

        // Update conversation preview
        await db.conversation.update({
            where: { id: conversationId },
            data: { lastMessageAt: new Date(), lastMessagePreview: body.trim().slice(0, 100) },
        });

        // Log activity
        await logActivity({
            actorId: user.id,
            action: "message.sent",
            resourceType: "message",
            resourceId: message.id,
            workspaceId: user.workspace.id,
            metadata: { clientName: conversation.client.name },
        });

        return NextResponse.json({ message });
    } catch {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

