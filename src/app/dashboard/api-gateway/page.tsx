import { currentUser } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
    Activity, Zap, DollarSign, TrendingUp,
    Server, ActivityIcon, PlusCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ApiGatewayOverview() {
    const user = await currentUser();

    if (!user) {
        return redirect("/sign-in");
    }

    const workspaceId = user.workspace.id;

    // Fetch aggregate stats
    const usageStats = await db.usageRecord.aggregate({
        where: { workspaceId },
        _count: { id: true },
        _sum: {
            totalTokens: true,
            providerCost: true,
            markupApplied: true,
            agencyCost: true,
        },
    });

    const activeKeysCount = await db.gatewayKey.count({
        where: { workspaceId, status: "active" },
    });

    const activeProviders = await db.providerCredential.findMany({
        where: { workspaceId },
        orderBy: { createdAt: "desc" },
    });

    const totalRequests = usageStats._count.id;
    const totalTokens = usageStats._sum.totalTokens || 0;
    const totalCost = usageStats._sum.providerCost || 0;
    const totalAgencyProfit = usageStats._sum.markupApplied || 0;

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">API Gateway</h1>
                <p className="text-muted-foreground">Manage AI credentials, issue client keys, and track token usage.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total API Requests
                        </CardTitle>
                        <Activity className="w-4 h-4 text-primary opacity-80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-sans">
                            {totalRequests.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            All time aggregated
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Tokens Processed
                        </CardTitle>
                        <Zap className="w-4 h-4 text-amber-500 opacity-80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-sans">
                            {totalTokens.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Prompt + Completion
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Provider Cost
                        </CardTitle>
                        <DollarSign className="w-4 h-4 text-emerald-500 opacity-80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-sans">
                            ${totalCost.toFixed(4)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Paid to OpenAI/Anthropic
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Agency Profit
                        </CardTitle>
                        <TrendingUp className="w-4 h-4 text-purple-500 opacity-80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-sans text-purple-500">
                            ${totalAgencyProfit.toFixed(4)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Revenue from markups
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Active Providers */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>AI Providers</CardTitle>
                            <CardDescription>Your configured upstream AI models.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/api-gateway/providers">
                                <PlusCircle className="w-4 h-4 mr-2" /> Add Provider
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activeProviders.map((provider) => (
                                <div
                                    key={provider.id}
                                    className="flex items-center justify-between p-4 border rounded-xl bg-accent/20 hover:bg-accent/40 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-background rounded-lg border">
                                            <Server className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-[15px]">{provider.keyName}</p>
                                            <p className="text-xs text-muted-foreground capitalize">
                                                {provider.provider} • {provider.keyPreview}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={provider.isActive ? 'default' : 'secondary'}
                                        className={provider.isActive ? "bg-emerald-500/15 text-emerald-600 border-none px-2.5 py-0.5" : ""}
                                    >
                                        {provider.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            ))}
                            {activeProviders.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-sm text-muted-foreground">No providers configured yet.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Gateway Status */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Gateway Status</CardTitle>
                            <CardDescription>Generate keys for your clients.</CardDescription>
                        </div>
                        <Button size="sm" asChild>
                            <Link href="/dashboard/api-gateway/keys">
                                Manage Keys
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center p-8 bg-accent/20 border border-dashed rounded-xl h-[200px]">
                            <ActivityIcon className="w-10 h-10 text-muted-foreground/30 mb-4" />
                            <div className="text-3xl font-bold mb-1">{activeKeysCount}</div>
                            <p className="text-sm text-muted-foreground">Active Gateway Keys issued</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
