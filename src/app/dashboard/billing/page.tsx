import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import { DollarSign, CheckCircle2, Clock, AlertCircle, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

const statusConfig: Record<string, { style: string; icon: typeof CheckCircle2 }> = {
    active: { style: "text-emerald-400 bg-emerald-400/10", icon: CheckCircle2 },
    past_due: { style: "text-red-400 bg-red-400/10", icon: AlertCircle },
    canceled: { style: "text-muted-foreground/50 bg-card", icon: Clock },
};

export default async function BillingPage() {
    const workspace = await currentWorkspace();
    if (!workspace) return redirect("/sign-in");

    const subscriptions = await db.subscription.findMany({
        where: { workspaceId: workspace.id },
        include: { client: true },
        orderBy: { createdAt: "desc" },
    });

    const active = subscriptions.filter(s => s.status === "active");
    const pastDue = subscriptions.filter(s => s.status === "past_due");
    const totalActive = active.reduce((s, sub) => s + sub.amount, 0) / 100;
    const totalPastDue = pastDue.reduce((s, sub) => s + sub.amount, 0) / 100;
    const paidCount = active.length;

    const summaryCards = [
        { label: "Total Outstanding", value: `$${totalPastDue.toLocaleString()}`, sub: `${pastDue.length} invoices`, color: "text-amber-400" },
        { label: "Active Revenue", value: `$${totalActive.toLocaleString()}`, sub: `${paidCount} subscriptions`, color: "text-emerald-400" },
        { label: "Overdue", value: `$${totalPastDue.toLocaleString()}`, sub: `${pastDue.length} invoice${pastDue.length !== 1 ? "s" : ""}`, color: "text-red-400" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Billing & Subscriptions</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage your client subscriptions and revenue.</p>
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {summaryCards.map((c, i) => (
                    <div key={i} className="bg-card backdrop-blur-md border border-border rounded-2xl p-5 hover:-translate-y-[2px] hover:shadow-xl hover:shadow-primary/[0.06] hover:border-border transition-all duration-300 ease-out">
                        <p className="text-xs text-muted-foreground mb-1">{c.label}</p>
                        <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">{c.sub}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-card backdrop-blur-md border border-border rounded-2xl overflow-hidden">
                {subscriptions.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-7 h-7 text-muted-foreground/30" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">No subscriptions yet</p>
                        <p className="text-xs text-muted-foreground/50 mt-1">Subscriptions will appear here when clients subscribe to your services.</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">Client</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4 hidden md:table-cell">Subscription ID</th>
                                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-4">Amount</th>
                                <th className="text-center text-xs font-medium text-muted-foreground px-6 py-4">Status</th>
                                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-4 hidden sm:table-cell">Period End</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.map((sub) => {
                                const cfg = statusConfig[sub.status] || statusConfig["canceled"];
                                const StatusIcon = cfg.icon;
                                return (
                                    <tr key={sub.id} className="border-b border-border/60 hover:bg-accent/80 transition-all duration-300 ease-out cursor-pointer group">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-foreground/80 group-hover:text-white transition-colors">{sub.client?.name || "Unknown"}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell font-mono">{sub.stripeSubscriptionId.slice(0, 20)}...</td>
                                        <td className="px-6 py-4 text-sm font-bold text-foreground/80 text-right">${(sub.amount / 100).toLocaleString()}/mo</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md ${cfg.style}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {sub.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground/80 text-right hidden sm:table-cell">{new Date(sub.currentPeriodEnd).toLocaleDateString()}</td>
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
