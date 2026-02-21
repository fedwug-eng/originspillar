import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import { KanbanBoard } from "@/components/requests/kanban-board";
import { CreateRequestDialog } from "@/components/requests/create-request-dialog";

export default async function RequestsPage() {
    const user = await currentUser();

    if (!user || user.role === "CLIENT") {
        return redirect("/sign-in");
    }

    const workspace = user.workspace;

    // Parallel fetch for speed
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
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col animate-in fade-in-50">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Requests</h2>
                    <p className="text-zinc-400">
                        Manage and track active client tasks across your pipeline.
                    </p>
                </div>
                <div className="[&>button]:bg-violet-600 [&>button]:text-white [&>button:hover]:bg-violet-500 [&>button]:shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)]">
                    <CreateRequestDialog clients={clients} services={services} />
                </div>
            </div>

            <div className="flex-1 overflow-hidden min-h-0 bg-zinc-900/30 border border-white/5 rounded-2xl p-4 backdrop-blur-sm shadow-2xl relative">
                {/* Subtle Glow inside Kanban container */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />
                <KanbanBoard initialRequests={requests} currentUserId={user.id} />
            </div>
        </div>
    );
}
