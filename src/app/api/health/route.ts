import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // Test DB connection
        const userCount = await db.user.count();
        const workspaceCount = await db.workspace.count();
        return NextResponse.json({
            status: "ok",
            database: "connected",
            users: userCount,
            workspaces: workspaceCount,
            env: {
                hasDbUrl: !!process.env.DATABASE_URL,
                hasDirectUrl: !!process.env.DIRECT_URL,
                hasClerkPk: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
                hasClerkSk: !!process.env.CLERK_SECRET_KEY,
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: error.message,
            stack: error.stack?.substring(0, 500),
        }, { status: 500 });
    }
}
