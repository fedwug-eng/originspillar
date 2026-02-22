import { DollarSign, Users, FolderKanban, ArrowUpRight, Activity, Clock, ChevronRight, Box, CreditCard, TrendingUp } from "lucide-react";
import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const workspace = await currentWorkspace();

    if (!workspace) {
        return redirect("/sign-in");
    }

    const [activeClients, totalClients, openRequests, completedRequests, recentActivity, subscriptions, totalServices] = await Promise.all([
        db.client.count({ where: { workspaceId: workspace.id, status: "Active" } }),
        db.client.count({ where: { workspaceId: workspace.id } }),
        db.request.count({ where: { workspaceId: workspace.id, status: { not: "Completed" } } }),
        db.request.count({ where: { workspaceId: workspace.id, status: "Completed" } }),
        db.request.findMany({
            where: { workspaceId: workspace.id },
            orderBy: { updatedAt: "desc" },
            take: 5,
            include: { client: true }
        }),
        db.subscription.findMany({
            where: { workspaceId: workspace.id, status: "active" },
            select: { amount: true, currentPeriodStart: true }
        }),
        db.service.count({ where: { workspaceId: workspace.id, status: "Active" } }),
    ]);

    const estimatedMRR = subscriptions.reduce((sum, sub) => sum + (sub.amount / 100), 0);
    const totalRequests = openRequests + completedRequests;

    // Revenue by month (from subscriptions — real data)
    const monthlyRevenue: number[] = new Array(12).fill(0);
    subscriptions.forEach((sub) => {
        const month = new Date(sub.currentPeriodStart).getMonth();
        monthlyRevenue[month] += sub.amount / 100;
    });
    const maxRevenue = Math.max(...monthlyRevenue, 1);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();

    const metrics = [
        { label: "Monthly Revenue", value: `$${estimatedMRR.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, sub: `${subscriptions.length} active subscription${subscriptions.length !== 1 ? "s" : ""}`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
        { label: "Active Clients", value: activeClients.toString(), sub: `${totalClients} total`, icon: Users, color: "text-primary", bg: "bg-primary/10" },
        { label: "Open Requests", value: openRequests.toString(), sub: `${totalRequests} total`, icon: FolderKanban, color: "text-amber-400", bg: "bg-amber-400/10" },
        { label: "Completed", value: completedRequests.toString(), sub: `${totalServices} active service${totalServices !== 1 ? "s" : ""}`, icon: ArrowUpRight, color: "text-primary", bg: "bg-primary/10" },
    ];

    const statusColors: Record<string, string> = {
        "Backlog": "bg-white/[0.06] text-dash-muted",
        "In Progress": "bg-primary/15 text-primary",
        "In Review": "bg-amber-400/15 text-amber-400",
        "Completed": "bg-emerald-400/15 text-emerald-400",
    };

    const quickActions = [
        { label: "View Requests", href: "/dashboard/requests", icon: FolderKanban, desc: `${openRequests} open`, color: "text-primary", bg: "bg-primary/10" },
        { label: "Manage Clients", href: "/dashboard/clients", icon: Users, desc: `${totalClients} total`, color: "text-emerald-400", bg: "bg-emerald-400/10" },
        { label: "Services", href: "/dashboard/services", icon: Box, desc: `${totalServices} active`, color: "text-amber-400", bg: "bg-amber-400/10" },
        { label: "Billing", href: "/dashboard/billing", icon: CreditCard, desc: `${subscriptions.length} subscriptions`, color: "text-rose-400", bg: "bg-rose-400/10" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-dash-text">Overview</h1>
                <p className="text-dash-muted mt-1">Your agency&apos;s performance at a glance.</p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, i) => (
                    <div key={i} className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-5 hover:border-white/[0.12] hover:bg-white/[0.06] transition-all duration-500 group">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center`}>
                                <m.icon className={`w-5 h-5 ${m.color}`} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-dash-text">{m.value}</p>
                        <p className="text-xs text-dash-muted mt-1">{m.label}</p>
                        <p className="text-[10px] text-dash-muted/60 mt-0.5">{m.sub}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions + Activity */}
            <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-2 bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-6 hover:border-white/[0.12] transition-all duration-300">
                    <h3 className="text-base font-bold text-dash-text mb-5">Quick Actions</h3>
                    <div className="space-y-2">
                        {quickActions.map((item) => (
                            <Link key={item.href} href={item.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all duration-200 group">
                                <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                                    <item.icon className={`w-4 h-4 ${item.color}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-dash-text">{item.label}</p>
                                    <p className="text-[11px] text-dash-muted">{item.desc}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-dash-muted/40 group-hover:text-primary transition-colors" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-3 bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-6 hover:border-white/[0.12] transition-all duration-300">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-bold text-dash-text">Recent Activity</h3>
                        <Link href="/dashboard/requests" className="text-xs font-medium text-primary hover:underline">View all</Link>
                    </div>
                    {recentActivity.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                                <Activity className="h-7 w-7 text-dash-muted/40" />
                            </div>
                            <p className="text-sm font-medium text-dash-muted">No activity yet</p>
                            <p className="text-xs text-dash-muted/60 mt-1">Create a request to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all duration-200">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
                                        <Clock className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-dash-text leading-tight truncate">{activity.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-dash-muted">{activity.client.name}</span>
                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[activity.status] || "bg-white/[0.06] text-dash-muted"}`}>
                                                {activity.status}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-dash-muted/60 shrink-0 mt-1">
                                        {new Date(activity.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-6 hover:border-white/[0.12] transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-base font-bold text-dash-text">Revenue Overview</h3>
                        <p className="text-sm text-dash-muted">Monthly breakdown</p>
                    </div>
                    {estimatedMRR > 0 && (
                        <div className="flex items-center gap-1.5 bg-emerald-400/10 px-3 py-1.5 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-semibold text-emerald-400">${estimatedMRR.toLocaleString()}/mo</span>
                        </div>
                    )}
                </div>
                <div className="flex items-end gap-2 h-[180px]">
                    {monthlyRevenue.map((rev, i) => {
                        const pct = maxRevenue > 0 ? (rev / maxRevenue) * 100 : 5;
                        const height = Math.max(pct, 5);
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div
                                    className={`w-full rounded-md transition-all duration-700 ${i === currentMonth
                                            ? "bg-gradient-to-t from-primary to-indigo-400 shadow-lg shadow-primary/20"
                                            : i > currentMonth
                                                ? "bg-white/[0.03]"
                                                : rev > 0
                                                    ? "bg-primary/30"
                                                    : "bg-white/[0.04]"
                                        }`}
                                    style={{ height: `${height}%` }}
                                />
                                <span className={`text-[10px] ${i === currentMonth ? "text-primary font-semibold" : "text-dash-muted/60"}`}>
                                    {months[i]}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
