import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-workspace";

export const dynamic = "force-dynamic";

// GET: Fetch recent activity/notifications for the workspace
export async function GET() {
    try {
        const user = await currentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const [notifications, unreadCount] = await Promise.all([
            db.activityLog.findMany({
                where: { workspaceId: user.workspace.id },
                orderBy: { createdAt: "desc" },
                take: 20,
                include: {
                    actor: {
                        select: { firstName: true, lastName: true, email: true },
                    },
                },
            }),
            db.activityLog.count({
                where: {
                    workspaceId: user.workspace.id,
                    readAt: null,
                },
            }),
        ]);

        return NextResponse.json({ notifications, unreadCount });
    } catch (error) {
        console.error("GET /api/notifications error:", error);
        return NextResponse.json({ notifications: [], unreadCount: 0 });
    }
}

// POST: Mark notifications as read
export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { markAll, notificationIds } = await req.json();

        if (markAll) {
            await db.activityLog.updateMany({
                where: {
                    workspaceId: user.workspace.id,
                    readAt: null,
                },
                data: { readAt: new Date() },
            });
        } else if (notificationIds?.length) {
            await db.activityLog.updateMany({
                where: {
                    id: { in: notificationIds },
                    workspaceId: user.workspace.id,
                },
                data: { readAt: new Date() },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("POST /api/notifications error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
