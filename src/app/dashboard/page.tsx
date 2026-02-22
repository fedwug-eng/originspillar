import {
    DollarSign, FolderKanban, Users, CheckCircle2, TrendingUp,
    ChevronRight, Package, Star, Clock, Key, MessageSquare
} from "lucide-react";
import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-card border border-border rounded-2xl transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-xl hover:shadow-primary/[0.06] hover:border-primary/20 ${className}`}>
        {children}
    </div>
);

function timeAgo(date: Date): string {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
}

export default async function DashboardPage() {
    const workspace = await currentWorkspace();

    if (!workspace) {
        return redirect("/sign-in");
    }

    const [activeClients, totalClients, openRequests, completedRequests, activityFeed, recentRequests, subscriptions, totalServices] = await Promise.all([
        db.client.count({ where: { workspaceId: workspace.id, status: "Active" } }),
        db.client.count({ where: { workspaceId: workspace.id } }),
        db.request.count({ where: { workspaceId: workspace.id, status: { not: "Completed" } } }),
        db.request.count({ where: { workspaceId: workspace.id, status: "Completed" } }),
        db.activityLog.findMany({
            where: { workspaceId: workspace.id },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { actor: { select: { firstName: true, lastName: true, email: true } } },
        }),
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

    const estimatedMRR = subscriptions.reduce((sum: number, sub: { amount: number }) => sum + (sub.amount / 100), 0);
    const totalRequests = openRequests + completedRequests;

    const revenueData: number[] = new Array(12).fill(0);
    subscriptions.forEach((sub: { amount: number; currentPeriodStart: Date }) => {
        const month = new Date(sub.currentPeriodStart).getMonth();
        revenueData[month] += sub.amount / 100;
    });
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
        { label: "Manage Clients", sub: `${totalClients} total`, icon: Users, to: "/dashboard/clients", color: "text-emerald-500" },
        { label: "Services", sub: `${totalServices} active`, icon: Package, to: "/dashboard/services", color: "text-amber-500" },
        { label: "Billing", sub: `${subscriptions.length} subscriptions`, icon: DollarSign, to: "/dashboard/billing", color: "text-rose-500" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">Your agency&apos;s performance at a glance.</p>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, i) => (
                    <GlassCard key={i} className="p-5 hover:bg-accent/50 transition-colors group">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/15">
                                <m.icon className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">{m.change}</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{m.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                    </GlassCard>
                ))}
            </div>

            {/* Quick Actions + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <GlassCard className="p-6">
                    <h2 className="text-base font-semibold text-foreground/80 mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                        {quickActions.map((a, i) => (
                            <Link
                                key={i}
                                href={a.to}
                                className="flex items-center justify-between p-3.5 rounded-xl hover:bg-accent transition-all duration-200 cursor-pointer group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10">
                                        <a.icon className={`w-5 h-5 ${a.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{a.label}</p>
                                        <p className="text-xs text-muted-foreground">{a.sub}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                            </Link>
                        ))}
                    </div>
                </GlassCard>

                {/* Activity feed */}
                <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-foreground/80">Recent Activity</h2>
                        <Link href="/dashboard/requests" className="text-xs text-primary/70 hover:text-primary transition-colors">View all</Link>
                    </div>
                    <div className="space-y-4">
                        {activityFeed.length > 0 ? (
                            activityFeed.map((entry) => {
                                const actionLabelsMap: Record<string, string> = {
                                    "request.created": "created a new request",
                                    "client.onboarded": "added a new client",
                                    "message.sent": "sent a message",
                                    "apikey.created": "added an API key",
                                    "apikey.revoked": "revoked an API key",
                                };
                                const typeIconMap: Record<string, typeof FolderKanban> = {
                                    request: FolderKanban, client: Users, invoice: DollarSign,
                                    message: MessageSquare, apikey: Key, service: Package,
                                };
                                const Icon = typeIconMap[entry.resourceType] || Star;
                                const label = actionLabelsMap[entry.action] || entry.action;
                                const actorName = entry.actor.firstName
                                    ? `${entry.actor.firstName} ${entry.actor.lastName || ""}`.trim()
                                    : entry.actor.email.split("@")[0];
                                const meta = entry.metadata as Record<string, unknown> | null;
                                const detail = meta?.name || meta?.title || "";

                                return (
                                    <div key={entry.id} className="flex items-start gap-3 group cursor-pointer hover:bg-accent -mx-2 px-2 py-1.5 rounded-xl transition-all duration-200">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/10">
                                            <Icon className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground/80 leading-tight">
                                                <span className="text-foreground">{actorName}</span> {label}
                                            </p>
                                            {detail && <p className="text-xs text-muted-foreground truncate">{String(detail)}</p>}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground/60 shrink-0 mt-1">
                                            {timeAgo(new Date(entry.createdAt))}
                                        </span>
                                    </div>
                                );
                            })
                        ) : recentRequests.length > 0 ? (
                            recentRequests.map((a) => {
                                const rStatusIcons: Record<string, typeof CheckCircle2> = {
                                    "Completed": CheckCircle2, "In Progress": Clock,
                                    "In Review": Star, "Backlog": FolderKanban,
                                };
                                const Icon = rStatusIcons[a.status] || FolderKanban;
                                return (
                                    <div key={a.id} className="flex items-start gap-3 group cursor-pointer hover:bg-accent -mx-2 px-2 py-1.5 rounded-xl transition-all duration-200">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/10">
                                            <Icon className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground/80 leading-tight">{a.title}</p>
                                            <p className="text-xs text-muted-foreground truncate">{a.client.name}</p>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground/60 shrink-0 mt-1">
                                            {timeAgo(new Date(a.updatedAt))}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-muted-foreground">No activity yet. Create a request to get started.</p>
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Revenue chart */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-base font-semibold text-foreground/80">Revenue Overview</h2>
                        <p className="text-xs text-muted-foreground">Last 12 months</p>
                    </div>
                    {estimatedMRR > 0 && (
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/10">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">${estimatedMRR.toLocaleString()}/mo</span>
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
                                            : "bg-muted"
                                        }`}
                                    style={{ height: `${pct}%` }}
                                />
                                <span className="text-[10px] text-muted-foreground">{months[i]}</span>
                            </div>
                        );
                    })}
                </div>
            </GlassCard>
        </div>
    );
}
