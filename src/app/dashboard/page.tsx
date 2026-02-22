import {
    DollarSign, FolderKanban, Users, CheckCircle2, TrendingUp,
    ChevronRight, Package, Star, Clock
} from "lucide-react";
import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-xl hover:shadow-primary/[0.06] hover:border-white/[0.1] ${className}`}>
        {children}
    </div>
);

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

    // Revenue by month (real data)
    const revenueData: number[] = new Array(12).fill(0);
    subscriptions.forEach((sub) => {
        const month = new Date(sub.currentPeriodStart).getMonth();
        revenueData[month] += sub.amount / 100;
    });
    // If no subscription data, use placeholder shape
    const hasRealData = revenueData.some(v => v > 0);
    const displayData = hasRealData ? revenueData : [28, 32, 35, 31, 38, 42, 39, 46, 52, 48, 55, 62];
    const maxVal = Math.max(...displayData);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const metrics = [
        { label: "Monthly Revenue", value: `$${estimatedMRR.toLocaleString()}`, change: `${subscriptions.length} active`, icon: DollarSign },
        { label: "Active Clients", value: activeClients.toString(), change: `+${totalClients} total`, icon: Users },
        { label: "Open Requests", value: openRequests.toString(), change: `${totalRequests} total`, icon: FolderKanban },
        { label: "Completed", value: completedRequests.toString(), change: `${totalServices} services`, icon: CheckCircle2 },
    ];

    const quickActions = [
        { label: "View Requests", sub: `${openRequests} open`, icon: FolderKanban, to: "/dashboard/requests", color: "text-primary" },
        { label: "Manage Clients", sub: `${totalClients} total`, icon: Users, to: "/dashboard/clients", color: "text-emerald-400" },
        { label: "Services", sub: `${totalServices} active`, icon: Package, to: "/dashboard/services", color: "text-amber-400" },
        { label: "Billing", sub: `${subscriptions.length} subscriptions`, icon: DollarSign, to: "/dashboard/billing", color: "text-rose-400" },
    ];

    const statusIcons: Record<string, typeof CheckCircle2> = {
        "Completed": CheckCircle2,
        "In Progress": Clock,
        "In Review": Star,
        "Backlog": FolderKanban,
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white/90">Dashboard</h1>
                <p className="text-sm text-white/50 mt-1">Your agency&apos;s performance at a glance.</p>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, i) => (
                    <GlassCard key={i} className="p-5 hover:bg-white/[0.06] transition-colors group">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center border border-primary/10">
                                <m.icon className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md">{m.change}</span>
                        </div>
                        <p className="text-2xl font-bold text-white/90">{m.value}</p>
                        <p className="text-xs text-white/50 mt-1">{m.label}</p>
                    </GlassCard>
                ))}
            </div>

            {/* Quick Actions + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Quick Actions */}
                <GlassCard className="p-6">
                    <h2 className="text-base font-semibold text-white/80 mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                        {quickActions.map((a, i) => (
                            <Link
                                key={i}
                                href={a.to}
                                className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white/[0.05] transition-all duration-300 ease-out cursor-pointer group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/8">
                                        <a.icon className={`w-5 h-5 ${a.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{a.label}</p>
                                        <p className="text-xs text-white/40">{a.sub}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                            </Link>
                        ))}
                    </div>
                </GlassCard>

                {/* Activity feed */}
                <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-white/80">Recent Activity</h2>
                        <Link href="/dashboard/requests" className="text-xs text-primary/70 hover:text-primary transition-colors">View all</Link>
                    </div>
                    <div className="space-y-4">
                        {recentActivity.length === 0 ? (
                            <p className="text-sm text-white/40">No activity yet. Create a request to get started.</p>
                        ) : (
                            recentActivity.map((a) => {
                                const Icon = statusIcons[a.status] || FolderKanban;
                                return (
                                    <div key={a.id} className="flex items-start gap-3 group cursor-pointer hover:bg-white/[0.03] -mx-2 px-2 py-1.5 rounded-xl transition-all duration-300 ease-out">
                                        <div className="w-8 h-8 rounded-lg bg-primary/12 flex items-center justify-center shrink-0 border border-primary/8">
                                            <Icon className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white/80 leading-tight">{a.title}</p>
                                            <p className="text-xs text-white/45 truncate">{a.client.name}</p>
                                        </div>
                                        <span className="text-[10px] text-white/35 shrink-0 mt-1">
                                            {new Date(a.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Revenue chart */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-base font-semibold text-white/80">Revenue Overview</h2>
                        <p className="text-xs text-white/45">Last 12 months</p>
                    </div>
                    {estimatedMRR > 0 && (
                        <div className="flex items-center gap-1.5 bg-emerald-400/10 px-2.5 py-1 rounded-lg border border-emerald-400/10">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-xs font-semibold text-emerald-400">${estimatedMRR.toLocaleString()}/mo</span>
                        </div>
                    )}
                </div>
                <div className="flex items-end gap-2 h-[180px]">
                    {displayData.map((h, i) => {
                        const pct = (h / maxVal) * 100;
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div
                                    className={`w-full rounded-md transition-all cursor-pointer group-hover:opacity-80 ${i >= 10
                                            ? "bg-gradient-to-t from-primary to-primary/60 shadow-sm shadow-primary/30"
                                            : i >= 8
                                                ? "bg-primary/35"
                                                : "bg-white/[0.08]"
                                        }`}
                                    style={{ height: `${pct}%` }}
                                />
                                <span className="text-[10px] text-white/40">{months[i]}</span>
                            </div>
                        );
                    })}
                </div>
            </GlassCard>
        </div>
    );
}
