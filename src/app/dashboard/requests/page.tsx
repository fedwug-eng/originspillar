import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-workspace";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

import { KanbanBoard } from "@/components/requests/kanban-board";
import { CreateRequestDialog } from "@/components/requests/create-request-dialog";

export default async function RequestsPage() {
    const user = await currentUser();

    if (!user || user.role === "CLIENT") {
        return redirect("/sign-in");
    }

    const workspace = user.workspace;

    const [requests, clients, services] = await Promise.all([
        db.request.findMany({
            where: { workspaceId: workspace.id },
            include: {
                client: true,
                service: true,
                comments: {
                    include: { author: true },
                    orderBy: { createdAt: "asc" }
                }
            },
            orderBy: { createdAt: "desc" },
        }),
        db.client.findMany({
            where: { workspaceId: workspace.id },
            select: { id: true, name: true },
        }),
        db.service.findMany({
            where: { workspaceId: workspace.id, status: "Active" },
            select: { id: true, name: true },
        }),
    ]);

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Requests</h2>
                    <p className="text-muted-foreground mt-1">
                        Manage and track client tasks across your pipeline.
                    </p>
                </div>
                <CreateRequestDialog clients={clients} services={services} />
            </div>

            <div className="flex-1 overflow-hidden min-h-0 bg-card border border-border rounded-2xl p-4 hover:border-primary/15 transition-all duration-300">
                <KanbanBoard initialRequests={requests} currentUserId={user.id} />
            </div>
        </div>
    );
}
