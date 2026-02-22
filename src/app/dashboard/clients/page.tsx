import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/current-workspace";

export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Search, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddClientDialog } from "@/components/clients/add-client-dialog";
import { redirect } from "next/navigation";

export default async function ClientsPage() {
    const workspace = await currentWorkspace();

    if (!workspace) {
        return redirect("/sign-in");
    }

    const clients = await db.client.findMany({
        where: {
            workspaceId: workspace.id,
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <div className="space-y-8 animate-in fade-in-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Clients</h2>
                    <p className="text-zinc-400">
                        View and manage your agency clients.
                    </p>
                </div>
                <div className="[&>button]:bg-violet-600 [&>button]:text-white [&>button:hover]:bg-violet-500 [&>button]:shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)]">
                    <AddClientDialog />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        type="search"
                        placeholder="Search clients..."
                        className="pl-9 w-full bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
                    />
                </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm overflow-hidden shadow-xl">
                {/* Table Header */}
                <div className="grid grid-cols-6 border-b border-white/5 p-4 font-medium text-xs uppercase tracking-wider text-zinc-500 bg-zinc-950/50">
                    <div className="col-span-2 pl-2">Client</div>
                    <div className="col-span-2 hidden md:block">Contact</div>
                    <div className="col-span-1 hidden md:block">Plan</div>
                    <div className="col-span-1 text-right pr-2">Actions</div>
                </div>

                {clients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Search className="h-6 w-6 text-zinc-500" />
                        </div>
                        <p className="text-zinc-400 font-medium">No clients found.</p>
                        <p className="text-sm text-zinc-600 mt-1">Click &quot;Add Client&quot; to onboard your first customer.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {clients.map((client) => (
                            <div key={client.id} className="grid grid-cols-6 items-center p-4 hover:bg-white/[0.02] transition-colors group">
                                <div className="col-span-4 md:col-span-2 flex items-center gap-4 pl-2">
                                    <Avatar className="h-10 w-10 border border-white/10 ring-2 ring-transparent group-hover:ring-violet-500/30 transition-all">
                                        <AvatarImage src={`https://avatar.vercel.sh/${client.name}`} alt={client.name} />
                                        <AvatarFallback className="bg-zinc-800 text-zinc-300">{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold text-zinc-200">{client.name}</div>
                                        <div className="text-xs text-zinc-500 mt-0.5 md:hidden">
                                            {client.contactName}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2 hidden md:block">
                                    <div className="text-sm font-medium text-zinc-300">{client.contactName || "\u2014"}</div>
                                    <div className="text-xs text-zinc-500 mt-0.5">{client.email}</div>
                                </div>
                                <div className="col-span-1 hidden md:block">
                                    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${client.plan ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-zinc-500 border-white/10'}`}>
                                        {client.plan || "None"}
                                    </div>
                                </div>
                                <div className="col-span-2 md:col-span-1 text-right pr-2">
                                    <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white hover:bg-white/10 rounded-full h-8 w-8">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
