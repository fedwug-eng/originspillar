import { currentUser, currentWorkspace } from "@/lib/current-workspace";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DollarSign, CheckCircle2, Calendar, CreditCard, TrendingUp } from "lucide-react";

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

    const activeCount = subscriptions.filter(s => s.status === "active").length;
    const totalMRR = subscriptions
        .filter(s => s.status === "active")
        .reduce((sum, s) => sum + s.amount, 0);

    const metrics = [
        { label: "Monthly Revenue", value: `$${(totalMRR / 100).toFixed(2)}`, icon: DollarSign, color: "text-op-emerald", bg: "bg-op-emerald/10" },
        { label: "Active Subscriptions", value: activeCount.toString(), icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10" },
        { label: "Total Subscriptions", value: subscriptions.length.toString(), icon: Calendar, color: "text-op-amber", bg: "bg-op-amber/10" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Billing & Subscriptions</h1>
                <p className="text-muted-foreground mt-1">Manage your client subscriptions and revenue.</p>
            </div>

            {/* Billing Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {metrics.map((m, i) => (
                    <div key={i} className="group bg-card border border-border rounded-2xl p-5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/[0.04] transition-all duration-500">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center`}>
                                <m.icon className={`w-5 h-5 ${m.color}`} />
                            </div>
                            {i === 0 && (
                                <div className="flex items-center gap-1 bg-op-emerald/10 px-2 py-0.5 rounded-full">
                                    <TrendingUp className="w-3 h-3 text-op-emerald" />
                                    <span className="text-[10px] font-semibold text-op-emerald">MRR</span>
                                </div>
                            )}
                        </div>
                        <p className="text-2xl font-bold text-foreground">{m.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                    </div>
                ))}
            </div>

            {/* Subscriptions List */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-border">
                    <h3 className="text-base font-bold text-foreground">All Subscriptions</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Active and past subscriptions from your clients.</p>
                </div>
                <div className="p-4">
                    {subscriptions.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="h-7 w-7 text-accent-foreground/40" />
                            </div>
                            <p className="text-base font-semibold text-muted-foreground">No subscriptions yet</p>
                            <p className="text-sm text-muted-foreground/60 mt-1">Subscriptions appear when clients purchase your services.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {subscriptions.map((sub) => (
                                <div key={sub.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-accent/50 transition-all duration-200 group">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className={`h-2.5 w-2.5 rounded-full ${sub.status === "active" ? "bg-op-emerald" : "bg-muted-foreground/30"}`} />
                                            {sub.status === "active" && (
                                                <div className="absolute inset-0 rounded-full bg-op-emerald animate-ping opacity-30" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground text-sm">{sub.client?.name || "Unknown Client"}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                <span className={`font-medium ${sub.status === "active" ? "text-op-emerald" : "text-muted-foreground"}`}>
                                                    {sub.status === "active" ? "Active" : sub.status}
                                                </span>
                                                {" · "}
                                                <span className="font-semibold text-foreground">${(sub.amount / 100).toFixed(2)}</span>
                                                /mo
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg">
                                        Renews {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
