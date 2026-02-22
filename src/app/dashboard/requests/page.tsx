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
                    <h2 className="text-2xl font-bold tracking-tight text-dash-text">Requests</h2>
                    <p className="text-dash-muted mt-1">
                        {requests.length} total request{requests.length !== 1 ? "s" : ""} in your pipeline.
                    </p>
                </div>
                <CreateRequestDialog clients={clients} services={services} />
            </div>

            <div className="flex-1 overflow-hidden min-h-0 bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-4 hover:border-white/[0.12] transition-all duration-300">
                <KanbanBoard initialRequests={requests} currentUserId={user.id} />
            </div>
        </div>
    );
}
