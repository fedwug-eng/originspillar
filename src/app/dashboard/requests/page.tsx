import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import { FolderKanban, Clock, Plus } from "lucide-react";
import Link from "next/link";

import { CreateRequestDialog } from "@/components/requests/create-request-dialog";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
    "In Progress": "text-amber-400 bg-amber-400/10 border-amber-400/10",
    "In Review": "text-primary bg-primary/10 border-primary/10",
    "Completed": "text-emerald-400 bg-emerald-400/10 border-emerald-400/10",
    "Backlog": "text-white/30 bg-white/[0.04] border-white/[0.06]",
};

export default async function RequestsPage() {
    const user = await currentUser();
    if (!user || user.role === "CLIENT") return redirect("/sign-in");

    const workspace = user.workspace;

    const [requests, clients, services] = await Promise.all([
        db.request.findMany({
            where: { workspaceId: workspace.id },
            include: { client: true },
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white/90">Requests</h1>
                    <p className="text-sm text-white/50 mt-1">{requests.length} total requests</p>
                </div>
                <CreateRequestDialog clients={clients} services={services} />
            </div>

            {requests.length === 0 ? (
                <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                        <FolderKanban className="w-7 h-7 text-white/20" />
                    </div>
                    <p className="text-sm font-medium text-white/50">No requests yet</p>
                    <p className="text-xs text-white/30 mt-1">Create a new project to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {requests.map((p) => (
                        <div
                            key={p.id}
                            className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.06] hover:-translate-y-[2px] hover:shadow-xl hover:shadow-primary/[0.06] hover:border-white/[0.1] transition-all duration-300 ease-out cursor-pointer group block"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center border border-primary/10">
                                        <FolderKanban className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white/85 group-hover:text-white transition-colors">{p.title}</h3>
                                        <p className="text-xs text-white/45">{p.client.name}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${statusStyles[p.status] || statusStyles["Backlog"]}`}>
                                    {p.status}
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs text-white/45">Progress</span>
                                    <span className="text-xs font-semibold text-white/60">{p.progress}%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                                        style={{ width: `${p.progress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-white/45">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{p.dueDate ? `Due ${new Date(p.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "No due date"}</span>
                                </div>
                                <span className="font-medium text-white/60">
                                    {p.budget ? `$${Number(p.budget).toLocaleString()}` : ""}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
