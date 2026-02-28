import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import { Users, Plus } from "lucide-react";
import { AddClientDialog } from "@/components/clients/add-client-dialog";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
    Active: "text-emerald-400 bg-emerald-400/10",
    New: "text-amber-400 bg-amber-400/10",
    Lead: "text-primary bg-primary/10",
};

const avatarColors = [
    "from-primary/60 to-primary/30",
    "from-emerald-500/50 to-emerald-600/20",
    "from-amber-500/50 to-amber-600/20",
    "from-rose-500/50 to-rose-600/20",
    "from-violet-500/50 to-violet-600/20",
    "from-cyan-500/50 to-cyan-600/20",
    "from-orange-500/50 to-orange-600/20",
    "from-pink-500/50 to-pink-600/20",
];

export default async function ClientsPage() {
    const workspace = await currentWorkspace();
    if (!workspace) return redirect("/sign-in");

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Clients</h1>
                    <p className="text-sm text-muted-foreground mt-1">{clients.length} total clients</p>
                </div>
                <AddClientDialog />
            </div>

            <div className="bg-card backdrop-blur-md border border-border rounded-2xl overflow-hidden">
                {clients.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-4">
                            <Users className="w-7 h-7 text-muted-foreground/30" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">No clients yet</p>
                        <p className="text-xs text-muted-foreground/50 mt-1">Click &ldquo;Add Client&rdquo; to onboard your first customer.</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">Client</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4 hidden md:table-cell">Email</th>
                                <th className="text-center text-xs font-medium text-muted-foreground px-6 py-4 hidden sm:table-cell">Projects</th>
                                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-4">Total Spent</th>
                                <th className="text-center text-xs font-medium text-muted-foreground px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((c, i) => {
                                const totalSpent = c.subscriptions.reduce((s, sub) => s + sub.amount, 0) / 100;
                                const avatar = c.name.substring(0, 2).toUpperCase();
                                return (
                                    <tr key={c.id} className="border-b border-border/60 hover:bg-accent/80 transition-all duration-300 ease-out cursor-pointer group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center border border-border`}>
                                                    <span className="text-xs font-bold text-foreground/80">{avatar}</span>
                                                </div>
                                                <span className="text-sm font-medium text-foreground/80 group-hover:text-white transition-colors">{c.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">{c.email}</td>
                                        <td className="px-6 py-4 text-sm text-white/60 text-center hidden sm:table-cell">{c._count.requests}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-foreground/70 text-right">${totalSpent.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${statusStyles[c.status] || statusStyles["Active"]}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
