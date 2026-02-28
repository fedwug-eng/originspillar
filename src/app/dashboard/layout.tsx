import { PropsWithChildren } from "react";
import { currentUser } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import DashboardShell from "@/components/dashboard/shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: PropsWithChildren) {
    const user = await currentUser();

    if (!user) {
        return redirect("/sign-in");
    }

    if (user.role === "CLIENT") {
        return redirect("/portal");
    }

    // Get unread message count for Communications badge
    let unreadCount = 0;
    try {
        unreadCount = await db.message.count({
            where: {
                workspaceId: user.workspace.id,
                senderType: "client",
                readAt: null,
            },
        });
    } catch {
        // Table may not have data yet
    }

    return (
        <DashboardShell unreadCount={unreadCount}>
            {children}
        </DashboardShell>
    );
}
