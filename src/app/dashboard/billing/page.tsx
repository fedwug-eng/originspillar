import { currentUser, currentWorkspace } from "@/lib/current-workspace";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, CheckCircle2, AlertCircle, Calendar } from "lucide-react";

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

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Billing & Subscriptions</h1>
                <p className="text-gray-500 mt-1">Manage your client subscriptions and revenue.</p>
            </div>

            {/* Billing Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Monthly Revenue</CardTitle>
                        <CreditCard className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">${(totalMRR / 100).toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Active Subscriptions</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{activeCount}</div>
                    </CardContent>
                </Card>
                <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Subscriptions</CardTitle>
                        <Calendar className="h-4 w-4 text-violet-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{subscriptions.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Subscriptions List */}
            <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-gray-900">Subscriptions</CardTitle>
                    <CardDescription>All active and past subscriptions from your clients.</CardDescription>
                </CardHeader>
                <CardContent>
                    {subscriptions.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-30" />
                            <p className="text-lg font-medium">No subscriptions yet</p>
                            <p className="text-sm">Subscriptions will appear here when clients purchase your services.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {subscriptions.map((sub) => (
                                <div key={sub.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2 w-2 rounded-full ${sub.status === "active" ? "bg-emerald-500" : "bg-gray-300"}`} />
                                        <div>
                                            <p className="font-medium text-gray-900">{sub.client?.name || "Unknown Client"}</p>
                                            <p className="text-sm text-gray-500">
                                                {sub.status === "active" ? "Active" : sub.status} · ${(sub.amount / 100).toFixed(2)}/mo
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Renews {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
