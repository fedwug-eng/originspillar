import { db } from "@/lib/db";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { currentWorkspace } from "@/lib/current-workspace";

export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { MoreHorizontal, Box, Zap, Users, DollarSign, CheckCircle2 } from "lucide-react";
import { CreateServiceDialog } from "@/components/services/create-service-dialog";
import { CheckoutButton } from "@/components/services/checkout-button";
import { redirect } from "next/navigation";

export default async function ServicesPage() {
    const workspace = await currentWorkspace();

    if (!workspace) {
        return redirect("/sign-in");
    }

    const services = await db.service.findMany({
        where: { workspaceId: workspace.id },
        include: {
            _count: { select: { requests: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    const activeServices = services.filter(s => s.status === "Active").length;
    const activeSubscriptions = await db.subscription.count({
        where: { workspaceId: workspace.id, status: "active" }
    });

    const formatPrice = (price: any) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(price));
    };

    const summaryCards = [
        { label: "Active Services", value: activeServices.toString(), icon: Zap, color: "text-primary", bg: "bg-primary/10" },
        { label: "Active Subscriptions", value: activeSubscriptions.toString(), icon: Users, color: "text-emerald-400", bg: "bg-emerald-400/10" },
        { label: "Total Offerings", value: services.length.toString(), icon: Box, color: "text-amber-400", bg: "bg-amber-400/10" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-dash-text">Services</h2>
                    <p className="text-dash-muted mt-1">Manage your service catalog and pricing.</p>
                </div>
                <CreateServiceDialog />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                {summaryCards.map((card, i) => (
                    <div key={i} className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-300">
                        <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                            <card.icon className={`w-5 h-5 ${card.color}`} />
                        </div>
                        <p className="text-2xl font-bold text-dash-text">{card.value}</p>
                        <p className="text-xs text-dash-muted mt-0.5">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Service Cards */}
            {services.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dash-border border-dashed bg-dash-card p-8 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-6">
                        <Box className="w-9 h-9 text-dash-muted/40" />
                    </div>
                    <h3 className="text-lg font-bold text-dash-text">No services created</h3>
                    <p className="mt-2 text-sm text-dash-muted">Start by defining your first offering.</p>
                </div>
            ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => {
                        const deliverables = Array.isArray(service.deliverables) ? service.deliverables as string[] : [];
                        return (
                            <div key={service.id} className="group bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl overflow-hidden hover:border-white/[0.12] hover:bg-white/[0.06] transition-all duration-500">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${service.status === "Active" ? "bg-emerald-400/15 text-emerald-400" : "bg-white/[0.06] text-dash-muted"
                                            }`}>
                                            {service.status}
                                        </span>
                                        <Button variant="ghost" size="icon" className="-mr-2 text-dash-muted hover:text-white hover:bg-white/[0.06] rounded-full h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <h3 className="text-lg font-bold text-dash-text mb-1.5">{service.name}</h3>
                                    <p className="text-sm text-dash-muted leading-relaxed line-clamp-2">{service.description || "No description provided."}</p>

                                    {/* Deliverables */}
                                    {deliverables.length > 0 && (
                                        <div className="mt-4 space-y-1.5">
                                            {deliverables.slice(0, 4).map((item, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-dash-muted">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                                                    <span>{String(item)}</span>
                                                </div>
                                            ))}
                                            {deliverables.length > 4 && (
                                                <p className="text-[10px] text-dash-muted/60 ml-5.5">+{deliverables.length - 4} more</p>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-baseline gap-1 mt-5">
                                        <span className="text-3xl font-extrabold text-dash-text">{formatPrice(service.price)}</span>
                                        {service.type === "Recurring" && (
                                            <span className="text-sm text-dash-muted">/ month</span>
                                        )}
                                    </div>
                                </div>
                                <div className="px-6 pb-6 pt-4 border-t border-white/[0.04] flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-semibold text-dash-muted bg-white/[0.04] px-2.5 py-1 rounded-lg">
                                            {service.type}
                                        </span>
                                        <span className="text-xs text-dash-muted/60">{service._count.requests} client{service._count.requests !== 1 ? "s" : ""}</span>
                                    </div>
                                    <CheckoutButton serviceId={service.id} workspaceId={workspace.id} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
