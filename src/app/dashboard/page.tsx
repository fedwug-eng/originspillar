import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Activity, ArrowUpRight } from "lucide-react";
import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/current-workspace";
import { redirect } from "next/navigation";

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

    // Calculate real MRR from active Stripe subscriptions (amount is in cents)
    const estimatedMRR = subscriptions.reduce((sum, sub) => sum + (sub.amount / 100), 0);

    return (
        <div className="space-y-8 animate-in fade-in-50">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Overview</h2>
                <p className="text-zinc-400">
                    Here is your agency's performance at a glance.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Metric Cards - Dark Mode / Glassmorphic */}
                <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-300">Monthly Revenue</CardTitle>
                        <CreditCard className="h-4 w-4 text-violet-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">${estimatedMRR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <p className="text-xs text-zinc-500 mt-1">
                            Active Stripe Subscriptions
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-300">Active Clients</CardTitle>
                        <Users className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{activeClients}</div>
                        <p className="text-xs text-zinc-500 mt-1">
                            Across all plans
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-300">Open Requests</CardTitle>
                        <Activity className="h-4 w-4 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{openRequests}</div>
                        <p className="text-xs text-zinc-500 mt-1">
                            In Backlog, In Progress, In Review
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-300">Completed Requests</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{completedRequests}</div>
                        <p className="text-xs text-zinc-500 mt-1">
                            Delivered securely
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-zinc-900/50 border-white/5 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-white">Overview</CardTitle>
                        <CardDescription className="text-zinc-400">Request completion volume over the last 30 days.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2 h-[350px] flex items-center justify-center bg-black/40 rounded-lg border border-white/5 m-4 border-dashed relative group overflow-hidden">
                        {/* Abstract Chart Placeholder (Dark Mode) */}
                        <div className="absolute inset-0 bg-gradient-to-t from-violet-500/10 to-transparent opacity-50" />
                        <div className="flex items-end gap-2 w-full h-full p-4 opacity-50">
                            {[40, 70, 45, 90, 65, 80, 50, 100, 70].map((height, i) => (
                                <div key={i} className="w-full bg-violet-500/20 border border-violet-500/30 rounded-t-sm transition-all duration-500 group-hover:bg-violet-500/40" style={{ height: `${height}%` }} />
                            ))}
                        </div>
                        <p className="text-zinc-500 absolute font-medium">Chart Coming Soon</p>
                    </CardContent>
                </Card>

                <Card className="col-span-3 bg-zinc-900/50 border-white/5 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Activity</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Recent updates on your active requests.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentActivity.length === 0 ? (
                            <p className="text-sm text-zinc-500 text-center py-8">No recent activity.</p>
                        ) : (
                            <div className="space-y-6">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-white leading-none truncate max-w-[200px]">{activity.title}</p>
                                            <p className="text-sm text-zinc-400">{activity.client.name} &bull; <span className="text-violet-400">{activity.status}</span></p>
                                        </div>
                                        <div className="ml-auto font-medium text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                            {new Date(activity.updatedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
