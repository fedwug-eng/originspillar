import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/current-workspace";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const workspace = await currentWorkspace();
        if (!workspace) return NextResponse.json({ clients: [], conversations: [] }, { status: 401 });

        const [clients, conversations] = await Promise.all([
            db.client.findMany({
                where: { workspaceId: workspace.id },
                select: { id: true, name: true, email: true },
                orderBy: { name: "asc" },
            }),
            db.conversation.findMany({
                where: { workspaceId: workspace.id },
                include: { request: { select: { title: true } } },
                orderBy: { lastMessageAt: "desc" },
            }),
        ]);

        return NextResponse.json({ clients, conversations });
    } catch {
        return NextResponse.json({ clients: [], conversations: [] });
    }
}
