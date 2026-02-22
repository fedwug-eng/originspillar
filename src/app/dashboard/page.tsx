import { DollarSign, Users, FolderKanban, ArrowUpRight, Activity, TrendingUp, Clock, ChevronRight } from "lucide-react";
import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/current-workspace";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const workspace = await currentWorkspace();

    if (!workspace) {
        return redirect("/sign-in");
    }

    const [activeClients, openRequests, completedRequests, recentActivity, subscriptions] = await Promise.all([
        db.client.count({
            where: { workspaceId: workspace.id, status: "Active" }
        }),
        db.request.count({
            where: { workspaceId: workspace.id, status: { not: "Completed" } }
        }),
        db.request.count({
            where: { workspaceId: workspace.id, status: "Completed" }
        }),
        db.request.findMany({
            where: { workspaceId: workspace.id },
            orderBy: { updatedAt: "desc" },
            take: 5,
            include: { client: true }
        }),
        db.subscription.findMany({
            where: { workspaceId: workspace.id, status: "active" },
            select: { amount: true }
        })
    ]);

    const estimatedMRR = subscriptions.reduce((sum, sub) => sum + (sub.amount / 100), 0);

    const metrics = [
        { label: "Monthly Revenue", value: `$${estimatedMRR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: "Active Stripe Subscriptions", icon: DollarSign, color: "text-op-emerald", bg: "bg-op-emerald/10", change: "+18.2%" },
        { label: "Active Clients", value: activeClients.toString(), sub: "Across all plans", icon: Users, color: "text-primary", bg: "bg-primary/10", change: `+${activeClients}` },
        { label: "Open Requests", value: openRequests.toString(), sub: "Backlog, In Progress, Review", icon: FolderKanban, color: "text-op-amber", bg: "bg-op-amber/10", change: String(openRequests) },
        { label: "Completed", value: completedRequests.toString(), sub: "Delivered successfully", icon: ArrowUpRight, color: "text-primary", bg: "bg-primary/10", change: `+${completedRequests}` },
    ];

    /* Bar chart placeholder data */
    const chartData = [40, 55, 35, 70, 45, 80, 50, 90, 60, 75, 85, 95];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const statusColors: Record<string, string> = {
        "Backlog": "bg-muted text-muted-foreground",
        "In Progress": "bg-primary/10 text-primary",
        "In Review": "bg-op-amber/10 text-op-amber",
        "Completed": "bg-op-emerald/10 text-op-emerald",
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Your agency&apos;s performance at a glance.
                </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, i) => (
                    <div key={i} className="group bg-card border border-border rounded-2xl p-5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/[0.04] transition-all duration-500">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center`}>
                                <m.icon className={`w-5 h-5 ${m.color}`} />
                            </div>
                            <span className="text-[11px] font-semibold text-op-emerald bg-op-emerald/10 px-2 py-0.5 rounded-full">{m.change}</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{m.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts + Activity */}
            <div className="grid gap-6 lg:grid-cols-5">
                {/* Revenue Chart */}
                <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-6 hover:border-primary/15 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-foreground">Revenue Overview</h3>
                            <p className="text-sm text-muted-foreground">Last 12 months</p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-op-emerald/10 px-3 py-1.5 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-op-emerald" />
                            <span className="text-sm font-semibold text-op-emerald">+22%</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-2 h-[200px]">
                        {chartData.map((h, i) => {
                            const pct = h;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div
                                        className={`w-full rounded-md transition-all duration-700 ${i >= 10
                                                ? "bg-gradient-accent shadow-lg shadow-primary/10"
                                                : i >= 8
                                                    ? "bg-primary/40"
                                                    : "bg-primary/15"
                                            }`}
                                        style={{ height: `${pct}%` }}
                                    />
                                    <span className="text-[10px] text-muted-foreground">{months[i]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 hover:border-primary/15 transition-all duration-300">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-bold text-foreground">Recent Activity</h3>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>

                    {recentActivity.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                                <Activity className="h-7 w-7 text-accent-foreground/40" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">No activity yet</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">Create a request to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent/50 transition-all duration-200">
                                    <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center mt-0.5 shrink-0">
                                        <Clock className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground leading-tight truncate">{activity.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-muted-foreground">{activity.client.name}</span>
                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[activity.status] || "bg-muted text-muted-foreground"}`}>
                                                {activity.status}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground/60 shrink-0 mt-1">
                                        {new Date(activity.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
