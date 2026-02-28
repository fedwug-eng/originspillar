"use client";

import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Activity,
    ChevronLeft,
    ChevronRight,
    Clock,
    Zap,
    CheckCircle,
    XCircle,
    TrendingUp,
    Server
} from 'lucide-react';
import { getGatewayUsageData } from './actions';

interface UsageRequest {
    id: string;
    provider: string;
    model: string;
    totalTokens: number;
    providerCost: number;
    latency: number;
    statusCode: number;
    createdAt: Date;
    gatewayKey: { keyName: string } | null;
}

interface UsageDataProps {
    initialData: {
        requests: UsageRequest[];
        pagination: {
            page: number;
            limit: number;
            totalRecords: number;
            totalPages: number;
        };
        stats: {
            totalTokens: number;
            providerCost: number;
            agencyProfit: number;
            avgLatency: number;
        };
    }
}

const PROVIDER_COLORS: Record<string, string> = {
    openai: 'bg-emerald-500',
    anthropic: 'bg-orange-500',
    deepseek: 'bg-blue-500',
};

export function UsageClient({ initialData }: UsageDataProps) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);

    async function handlePageChange(newPage: number) {
        setLoading(true);
        try {
            const newData = await getGatewayUsageData(newPage);
            // @ts-ignore mapping date types
            setData(newData);
        } catch (error) {
            console.error("Failed to fetch usage page", error);
        } finally {
            setLoading(false);
        }
    }

    function formatDate(date: Date | string) {
        return new Date(date).toLocaleString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }

    function formatNumber(num: number) {
        if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString();
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto w-full">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Usage Analytics</h2>
                <p className="text-muted-foreground mt-2">
                    Monitor token consumption, analyze provider costs, and calculate total client profit generation.
                </p>
            </div>

            {/* Stats Summary */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-medium text-muted-foreground">Total Proxy Requests</p>
                            <div className="p-2 bg-primary/10 rounded-full">
                                <Activity className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-bold tracking-tight font-sans">
                                {data.pagination.totalRecords.toLocaleString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-medium text-muted-foreground">Total Tokens Pumped</p>
                            <div className="p-2 bg-amber-500/10 rounded-full">
                                <Zap className="w-4 h-4 text-amber-500" />
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-bold tracking-tight font-sans">
                                {formatNumber(data.stats.totalTokens)}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-medium text-muted-foreground">Upstream API Cost</p>
                            <div className="p-2 bg-rose-500/10 rounded-full">
                                <Server className="w-4 h-4 text-rose-500" />
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-bold tracking-tight font-sans text-rose-500">
                                ${data.stats.providerCost.toFixed(4)}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-medium text-muted-foreground">Client Markup Profit</p>
                            <div className="p-2 bg-emerald-500/10 rounded-full">
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-bold tracking-tight font-sans text-emerald-500">
                                ${data.stats.agencyProfit.toFixed(4)}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Request Log Table */}
            <Card className="border-border/60 shadow-sm">
                <CardHeader className='border-b bg-muted/20 pb-4'>
                    <CardTitle>Inference Proxy Log</CardTitle>
                    <CardDescription>
                        Real-time feed of all models queried through your gateway keys.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[50px] pl-6">Status</TableHead>
                                    <TableHead>Client Key</TableHead>
                                    <TableHead>Provider</TableHead>
                                    <TableHead>Model</TableHead>
                                    <TableHead className="text-right">Tokens</TableHead>
                                    <TableHead className="text-right">Cost</TableHead>
                                    <TableHead className="text-right">Latency</TableHead>
                                    <TableHead className="pr-6 text-right">Timestamp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <Activity className="w-8 h-8 text-primary animate-pulse" />
                                                <p className="text-sm text-muted-foreground animate-pulse">Fetching usage...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : data.requests.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-64 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 bg-accent/50 rounded-full flex items-center justify-center">
                                                    <Server className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">No inferences recorded</p>
                                                    <p className="text-sm text-muted-foreground mt-1">Requests passing through your proxy will appear here.</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.requests.map((request) => (
                                        <TableRow key={request.id} className="group transition-colors data-[state=selected]:bg-muted">
                                            <TableCell className="pl-6">
                                                {request.statusCode >= 200 && request.statusCode < 300 ? (
                                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium text-sm">
                                                {request.gatewayKey?.keyName || 'Unknown Key'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`w-2 h-2 rounded-full ${PROVIDER_COLORS[request.provider] || 'bg-gray-500'
                                                            }`}
                                                    />
                                                    <span className="capitalize text-sm">{request.provider}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-[11px] bg-accent/60 text-accent-foreground px-2 py-0.5 rounded-md font-mono border border-border/50">
                                                    {request.model}
                                                </code>
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-[13px] text-muted-foreground">
                                                {formatNumber(request.totalTokens)}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-[13px] text-muted-foreground">
                                                ${request.providerCost.toFixed(5)}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-[13px] text-muted-foreground">
                                                {request.latency}ms
                                            </TableCell>
                                            <TableCell className="pr-6 text-right text-[13px] text-muted-foreground">
                                                {formatDate(request.createdAt)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Footer */}
                    {data.pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between p-4 border-t bg-muted/10">
                            <p className="text-sm text-muted-foreground">
                                Showing page <span className="font-medium text-foreground">{data.pagination.page}</span> of <span className="font-medium text-foreground">{data.pagination.totalPages}</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(Math.max(1, data.pagination.page - 1))}
                                    disabled={data.pagination.page <= 1 || loading}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(data.pagination.page + 1)}
                                    disabled={data.pagination.page >= data.pagination.totalPages || loading}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
