import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/current-workspace";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const workspace = await currentWorkspace();
        if (!workspace) return NextResponse.json({ messages: [] }, { status: 401 });

        const conversationId = req.nextUrl.searchParams.get("conversationId");
        if (!conversationId) return NextResponse.json({ messages: [] }, { status: 400 });

        const messages = await db.message.findMany({
            where: { conversationId, workspaceId: workspace.id },
            orderBy: { createdAt: "asc" },
        });

        // Mark messages as read
        await db.message.updateMany({
            where: { conversationId, workspaceId: workspace.id, senderType: "client", readAt: null },
            data: { readAt: new Date() },
        });

        return NextResponse.json({ messages });
    } catch {
        return NextResponse.json({ messages: [] });
    }
}
