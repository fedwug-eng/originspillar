import { DollarSign, Users, FolderKanban, ArrowUpRight, Activity, Clock, ChevronRight } from "lucide-react";
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
        db.client.count({
            where: { workspaceId: workspace.id, status: "Active" }
        }),
        db.client.count({
            where: { workspaceId: workspace.id }
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
        }),
        db.service.count({
            where: { workspaceId: workspace.id }
        }),
    ]);

    const estimatedMRR = subscriptions.reduce((sum, sub) => sum + (sub.amount / 100), 0);
    const totalRequests = openRequests + completedRequests;

    const metrics = [
        { label: "Monthly Revenue", value: `$${estimatedMRR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: `${subscriptions.length} active subscription${subscriptions.length !== 1 ? "s" : ""}`, icon: DollarSign, color: "text-op-emerald", bg: "bg-op-emerald/10" },
        { label: "Active Clients", value: activeClients.toString(), sub: `${totalClients} total client${totalClients !== 1 ? "s" : ""}`, icon: Users, color: "text-primary", bg: "bg-primary/10" },
        { label: "Open Requests", value: openRequests.toString(), sub: `${totalRequests} total request${totalRequests !== 1 ? "s" : ""}`, icon: FolderKanban, color: "text-op-amber", bg: "bg-op-amber/10" },
        { label: "Completed", value: completedRequests.toString(), sub: `${totalServices} active service${totalServices !== 1 ? "s" : ""}`, icon: ArrowUpRight, color: "text-primary", bg: "bg-primary/10" },
    ];

    const statusColors: Record<string, string> = {
        "Backlog": "bg-secondary text-muted-foreground",
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
                        </div>
                        <p className="text-2xl font-bold text-foreground">{m.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">{m.sub}</p>
                    </div>
                ))}
            </div>

            {/* Quick Links + Activity */}
            <div className="grid gap-6 lg:grid-cols-5">
                {/* Quick Actions */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 hover:border-primary/15 transition-all duration-300">
                    <h3 className="text-base font-bold text-foreground mb-5">Quick Actions</h3>
                    <div className="space-y-2">
                        {[
                            { label: "View Requests", href: "/dashboard/requests", icon: FolderKanban, desc: `${openRequests} open` },
                            { label: "Manage Clients", href: "/dashboard/clients", icon: Users, desc: `${totalClients} total` },
                            { label: "Billing", href: "/dashboard/billing", icon: DollarSign, desc: `${subscriptions.length} subs` },
                        ].map((item) => (
                            <Link key={item.href} href={item.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-all duration-200 group">
                                <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                                    <item.icon className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-6 hover:border-primary/15 transition-all duration-300">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-bold text-foreground">Recent Activity</h3>
                        <Link href="/dashboard/requests" className="text-xs font-medium text-primary hover:underline">View all</Link>
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
                        <div className="space-y-2">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent/50 transition-all duration-200">
                                    <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center mt-0.5 shrink-0">
                                        <Clock className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground leading-tight truncate">{activity.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-muted-foreground">{activity.client.name}</span>
                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[activity.status] || "bg-secondary text-muted-foreground"}`}>
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
