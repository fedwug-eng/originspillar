import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/current-workspace";

export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Search, MoreHorizontal, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddClientDialog } from "@/components/clients/add-client-dialog";
import { redirect } from "next/navigation";

const avatarGradients = [
    "from-violet-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-blue-500 to-cyan-600",
    "from-purple-500 to-fuchsia-600",
    "from-lime-500 to-green-600",
    "from-sky-500 to-blue-600",
];

export default async function ClientsPage() {
    const workspace = await currentWorkspace();

    if (!workspace) {
        return redirect("/sign-in");
    }

    const clients = await db.client.findMany({
        where: { workspaceId: workspace.id },
        include: {
            _count: { select: { requests: true } },
            subscriptions: {
                where: { status: "active" },
                select: { amount: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-dash-text">Clients</h2>
                    <p className="text-dash-muted mt-1">{clients.length} total client{clients.length !== 1 ? "s" : ""}</p>
                </div>
                <AddClientDialog />
            </div>

            <div className="flex items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dash-muted" />
                    <Input
                        type="search"
                        placeholder="Search clients..."
                        className="pl-9 w-full bg-white/[0.04] border-white/[0.06] text-dash-text placeholder:text-dash-muted focus-visible:ring-primary/30"
                    />
                </div>
            </div>

            <div className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-6 border-b border-white/[0.06] px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-dash-muted bg-white/[0.02]">
                    <div className="col-span-2 pl-1">Client</div>
                    <div className="col-span-1 hidden md:block">Projects</div>
                    <div className="col-span-1 hidden md:block">Total Spent</div>
                    <div className="col-span-1 hidden md:block">Status</div>
                    <div className="col-span-1 text-right pr-1">Actions</div>
                </div>

                {clients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                            <Users className="h-7 w-7 text-dash-muted/40" />
                        </div>
                        <p className="text-base font-semibold text-dash-muted">No clients yet</p>
                        <p className="text-sm text-dash-muted/60 mt-1">Click &ldquo;Add Client&rdquo; to onboard your first customer.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/[0.04]">
                        {clients.map((client, idx) => {
                            const totalSpent = client.subscriptions.reduce((s, sub) => s + sub.amount, 0) / 100;
                            const gradient = avatarGradients[idx % avatarGradients.length];

                            return (
                                <div key={client.id} className="grid grid-cols-6 items-center px-5 py-4 hover:bg-white/[0.03] transition-all duration-200 group cursor-pointer">
                                    <div className="col-span-4 md:col-span-2 flex items-center gap-3 pl-1">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-primary/10`}>
                                            {client.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-dash-text text-sm">{client.name}</div>
                                            <div className="text-xs text-dash-muted mt-0.5">{client.email}</div>
                                        </div>
                                    </div>
                                    <div className="col-span-1 hidden md:block">
                                        <span className="text-sm font-medium text-dash-text">{client._count.requests}</span>
                                        <span className="text-xs text-dash-muted ml-1">project{client._count.requests !== 1 ? "s" : ""}</span>
                                    </div>
                                    <div className="col-span-1 hidden md:block">
                                        <span className="text-sm font-semibold text-dash-text">${totalSpent.toLocaleString()}</span>
                                    </div>
                                    <div className="col-span-1 hidden md:block">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${client.status === "Active" ? "bg-emerald-400/15 text-emerald-400" :
                                                client.status === "Lead" ? "bg-primary/15 text-primary" :
                                                    "bg-amber-400/15 text-amber-400"
                                            }`}>
                                            {client.status}
                                        </span>
                                    </div>
                                    <div className="col-span-2 md:col-span-1 text-right pr-1">
                                        <Button variant="ghost" size="icon" className="text-dash-muted hover:text-white hover:bg-white/[0.06] rounded-full h-8 w-8">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
