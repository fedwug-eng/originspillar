import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/current-workspace";

export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Search, MoreHorizontal, Users } from "lucide-react";
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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Clients</h2>
                    <p className="text-muted-foreground mt-1">
                        View and manage your agency clients.
                    </p>
                </div>
                <AddClientDialog />
            </div>

            <div className="flex items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search clients..."
                        className="pl-9 w-full"
                    />
                </div>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/15 transition-all duration-300">
                {/* Table Header */}
                <div className="grid grid-cols-6 border-b border-border px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground bg-secondary/50">
                    <div className="col-span-2 pl-1">Client</div>
                    <div className="col-span-2 hidden md:block">Contact</div>
                    <div className="col-span-1 hidden md:block">Plan</div>
                    <div className="col-span-1 text-right pr-1">Actions</div>
                </div>

                {clients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-4">
                            <Users className="h-7 w-7 text-accent-foreground/40" />
                        </div>
                        <p className="text-base font-semibold text-muted-foreground">No clients yet</p>
                        <p className="text-sm text-muted-foreground/60 mt-1">Click &ldquo;Add Client&rdquo; to onboard your first customer.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {clients.map((client) => (
                            <div key={client.id} className="grid grid-cols-6 items-center px-5 py-4 hover:bg-accent/50 transition-all duration-200 group">
                                <div className="col-span-4 md:col-span-2 flex items-center gap-3 pl-1">
                                    <Avatar className="h-10 w-10 border border-border group-hover:border-primary/30 transition-all">
                                        <AvatarImage src={`https://avatar.vercel.sh/${client.name}`} alt={client.name} />
                                        <AvatarFallback className="bg-accent text-accent-foreground text-xs font-bold">{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold text-foreground text-sm">{client.name}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5 md:hidden">
                                            {client.contactName}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2 hidden md:block">
                                    <div className="text-sm font-medium text-foreground">{client.contactName || "\u2014"}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{client.email}</div>
                                </div>
                                <div className="col-span-1 hidden md:block">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${client.plan ? 'bg-op-emerald/10 text-op-emerald' : 'bg-secondary text-muted-foreground'}`}>
                                        {client.plan || "None"}
                                    </span>
                                </div>
                                <div className="col-span-2 md:col-span-1 text-right pr-1">
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-full h-8 w-8">
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
