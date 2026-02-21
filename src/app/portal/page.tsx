import { currentUser } from "@/lib/current-workspace";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateRequestDialog } from "@/components/portal/create-request-dialog";
import { RequestDetailsDialog } from "@/components/requests/request-details-dialog";
import { CheckCircle2, Clock, PlayCircle } from "lucide-react";

export default async function ClientPortalPage() {
    const user = await currentUser();

    if (!user || user.role !== "CLIENT") {
        return redirect("/sign-in");
    }

    // Find the actual Client record associated with this User's email
    const client = await db.client.findFirst({
        where: {
            email: user.email,
            workspaceId: user.workspaceId,
        },
        include: {
            requests: {
                orderBy: { createdAt: "desc" },
                include: {
                    service: true,
                    comments: {
                        include: { author: true },
                        orderBy: { createdAt: "asc" }
                    }
                }
            },
            subscriptions: true,
        },
    });

    if (!client) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center text-center">
                <h3 className="text-xl font-bold text-white">Client Profile Not Found</h3>
                <p className="text-zinc-400 mt-2">
                    We could not locate your client profile within this agency. Please contact support.
                </p>
            </div>
        );
    }

    const { requests, subscriptions } = client;

    // A helper to map Kanban status to Badge variants and icons for the dark theme
    const getStatusTheme = (status: string) => {
        switch (status) {
            case "Completed": return { variant: "default", icon: <CheckCircle2 className="w-3 h-3 mr-1" />, classes: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30" };
            case "In Progress": return { variant: "secondary", icon: <PlayCircle className="w-3 h-3 mr-1" />, classes: "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30" };
            case "In Review": return { variant: "outline", icon: <Clock className="w-3 h-3 mr-1" />, classes: "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30" };
            default: return { variant: "secondary", icon: <Clock className="w-3 h-3 mr-1" />, classes: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30 hover:bg-zinc-500/30" }; // Backlog
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in-50">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back, {client.contactName || client.name}</h1>
                <p className="text-zinc-400 mt-1">
                    Manage your active requests and subscriptions.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Active Subscriptions / Plans */}
                <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-white">Active Subscriptions</CardTitle>
                        <CardDescription className="text-zinc-400">Your current recurring service plans.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {subscriptions.length === 0 ? (
                            <p className="text-sm text-zinc-500">No active subscriptions.</p>
                        ) : (
                            <div className="space-y-4">
                                {subscriptions.map(sub => (
                                    <div key={sub.id} className="flex justify-between items-center border-b border-white/10 pb-4 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium text-sm text-zinc-200">Stripe Plan</p>
                                            <p className="text-xs text-zinc-500 mt-1">ID: {sub.stripeSubscriptionId.slice(-8)}</p>
                                        </div>
                                        {/* Status Badge */}
                                        <div className={`text-xs px-2.5 py-0.5 rounded-full border ${sub.status === "active" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                                            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Summary Metrics */}
                <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-white">Request Overview</CardTitle>
                        <CardDescription className="text-zinc-400">Status of your ongoing tasks.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-zinc-950 border border-white/5 rounded-lg p-4 shadow-inner">
                            <p className="text-2xl font-bold text-white">{requests.filter(r => r.status !== "Completed").length}</p>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Open</p>
                        </div>
                        <div className="bg-zinc-950 border border-white/5 rounded-lg p-4 shadow-inner">
                            <p className="text-2xl font-bold text-white">{requests.filter(r => r.status === "Completed").length}</p>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Completed</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight text-white">Task History</h2>
                    {/* We pass the client.id so the form knows who is submitting */}
                    <div className="[&>button]:bg-violet-600 [&>button]:text-white [&>button:hover]:bg-violet-500 [&>button]:shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)]">
                        <CreateRequestDialog clientId={client.id} workspaceId={client.workspaceId} />
                    </div>
                </div>

                {requests.length === 0 ? (
                    <div className="flex h-32 items-center justify-center rounded-md border border-white/10 border-dashed bg-zinc-900/30 text-sm text-zinc-500">
                        You have not submitted any requests yet.
                    </div>
                ) : (
                    <div className="rounded-md border border-white/10 bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
                        <div className="divide-y divide-white/5">
                            {requests.map(request => {
                                const theme = getStatusTheme(request.status);
                                return (
                                    <div key={request.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-white/[0.02] transition-colors">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-medium text-white">{request.title}</h4>
                                                {request.service && (
                                                    <div className="text-[10px] font-medium uppercase tracking-wider bg-white/10 text-zinc-300 px-2 py-0.5 rounded-full">
                                                        {request.service.name}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-zinc-400 mt-1 line-clamp-1">
                                                {request.description || "No description provided."}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 shrink-0">
                                            <div className={`flex items-center text-xs px-2.5 py-0.5 rounded-full border font-medium ${theme.classes}`}>
                                                {theme.icon} {request.status}
                                            </div>
                                            <RequestDetailsDialog request={request} currentUserId={user.id} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
