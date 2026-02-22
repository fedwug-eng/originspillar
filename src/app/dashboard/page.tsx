import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Activity, ArrowUpRight } from "lucide-react";
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

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Overview</h2>
                <p className="text-gray-500 mt-1">
                    Your agency&apos;s performance at a glance.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Monthly Revenue</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-emerald-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">${estimatedMRR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <p className="text-xs text-gray-400 mt-1">
                            Active Stripe Subscriptions
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Active Clients</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{activeClients}</div>
                        <p className="text-xs text-gray-400 mt-1">
                            Across all plans
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Open Requests</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-amber-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{openRequests}</div>
                        <p className="text-xs text-gray-400 mt-1">
                            Backlog, In Progress, In Review
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center">
                            <ArrowUpRight className="h-4 w-4 text-violet-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{completedRequests}</div>
                        <p className="text-xs text-gray-400 mt-1">
                            Delivered successfully
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-white border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Activity Chart</CardTitle>
                        <CardDescription>Request completion volume over the last 30 days.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2 h-[350px] flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100 m-4 border-dashed relative group overflow-hidden">
                        <div className="flex items-end gap-2 w-full h-full p-4 opacity-40">
                            {[40, 70, 45, 90, 65, 80, 50, 100, 70].map((height, i) => (
                                <div key={i} className="w-full bg-violet-200 border border-violet-300 rounded-t-sm transition-all duration-500 group-hover:bg-violet-400" style={{ height: `${height}%` }} />
                            ))}
                        </div>
                        <p className="text-gray-400 absolute font-medium">Chart Coming Soon</p>
                    </CardContent>
                </Card>

                <Card className="col-span-3 bg-white border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Recent Activity</CardTitle>
                        <CardDescription>
                            Latest updates on your active requests.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentActivity.length === 0 ? (
                            <div className="text-center py-12">
                                <Activity className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                                <p className="text-sm text-gray-400">No recent activity.</p>
                                <p className="text-xs text-gray-400 mt-1">Create a request to get started.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-900 leading-none truncate max-w-[200px]">{activity.title}</p>
                                            <p className="text-sm text-gray-500">{activity.client.name} · <span className="text-violet-600 font-medium">{activity.status}</span></p>
                                        </div>
                                        <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
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
