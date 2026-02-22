import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import { DollarSign, AlertTriangle, CheckCircle2, Clock, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
    const workspace = await currentWorkspace();

    if (!workspace) {
        return redirect("/sign-in");
    }

    const subscriptions = await db.subscription.findMany({
        where: { workspaceId: workspace.id },
        include: { client: true },
        orderBy: { createdAt: "desc" },
    });

    const active = subscriptions.filter(s => s.status === "active");
    const pastDue = subscriptions.filter(s => s.status === "past_due");
    const canceled = subscriptions.filter(s => s.status === "canceled");
    const totalActive = active.reduce((s, sub) => s + sub.amount, 0) / 100;
    const totalPastDue = pastDue.reduce((s, sub) => s + sub.amount, 0) / 100;

    const summaryCards = [
        { label: "Active Revenue", value: `$${totalActive.toLocaleString()}`, sub: `${active.length} active`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
        { label: "Past Due", value: `$${totalPastDue.toLocaleString()}`, sub: `${pastDue.length} invoice${pastDue.length !== 1 ? "s" : ""}`, icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-400/10" },
        { label: "Canceled", value: canceled.length.toString(), sub: "subscriptions", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
    ];

    const statusStyles: Record<string, { badge: string; icon: typeof CheckCircle2 }> = {
        "active": { badge: "bg-emerald-400/15 text-emerald-400", icon: CheckCircle2 },
        "past_due": { badge: "bg-rose-400/15 text-rose-400", icon: AlertTriangle },
        "canceled": { badge: "bg-white/[0.06] text-dash-muted", icon: Clock },
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-dash-text">Billing & Subscriptions</h2>
                    <p className="text-dash-muted mt-1">{subscriptions.length} total subscription{subscriptions.length !== 1 ? "s" : ""}</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                {summaryCards.map((card, i) => (
                    <div key={i} className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-300">
                        <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                            <card.icon className={`w-5 h-5 ${card.color}`} />
                        </div>
                        <p className="text-2xl font-bold text-dash-text">{card.value}</p>
                        <p className="text-xs text-dash-muted mt-0.5">{card.label}</p>
                        <p className="text-[10px] text-dash-muted/60 mt-0.5">{card.sub}</p>
                    </div>
                ))}
            </div>

            {/* Subscriptions Table */}
            <div className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl overflow-hidden">
                <div className="grid grid-cols-5 border-b border-white/[0.06] px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-dash-muted bg-white/[0.02]">
                    <div className="col-span-2">Client</div>
                    <div className="hidden md:block">Amount</div>
                    <div className="hidden md:block">Period</div>
                    <div className="text-right pr-1">Status</div>
                </div>

                {subscriptions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                            <FileText className="h-7 w-7 text-dash-muted/40" />
                        </div>
                        <p className="text-base font-semibold text-dash-muted">No subscriptions yet</p>
                        <p className="text-sm text-dash-muted/60 mt-1">Subscriptions will appear here when clients subscribe to your services.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/[0.04]">
                        {subscriptions.map((sub) => {
                            const style = statusStyles[sub.status] || statusStyles["canceled"];
                            const StatusIcon = style.icon;
                            return (
                                <div key={sub.id} className="grid grid-cols-5 items-center px-5 py-4 hover:bg-white/[0.03] transition-all duration-200">
                                    <div className="col-span-3 md:col-span-2">
                                        <p className="text-sm font-semibold text-dash-text">{sub.client?.name || "Unknown Client"}</p>
                                        <p className="text-xs text-dash-muted mt-0.5 font-mono">{sub.stripeSubscriptionId.slice(0, 20)}...</p>
                                    </div>
                                    <div className="hidden md:block">
                                        <span className="text-sm font-bold text-dash-text">${(sub.amount / 100).toLocaleString()}</span>
                                        <span className="text-xs text-dash-muted">/mo</span>
                                    </div>
                                    <div className="hidden md:block text-xs text-dash-muted">
                                        {new Date(sub.currentPeriodStart).toLocaleDateString()} — {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                                    </div>
                                    <div className="col-span-2 md:col-span-1 text-right">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${style.badge}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {sub.status.replace("_", " ")}
                                        </span>
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
