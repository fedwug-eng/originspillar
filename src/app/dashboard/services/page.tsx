/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { currentWorkspace } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import { Package, Plus, DollarSign, Users, MoreHorizontal, Edit } from "lucide-react";
import { CreateServiceDialog } from "@/components/services/create-service-dialog";
import { CheckoutButton } from "@/components/services/checkout-button";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
    Active: "text-emerald-400 bg-emerald-400/10",
    Draft: "text-white/30 bg-white/[0.04]",
    Archived: "text-white/20 bg-white/[0.03]",
};

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl transition-all duration-300 ease-out hover:-translate-y-[1px] hover:shadow-lg hover:shadow-primary/[0.04] hover:border-white/[0.1] ${className}`}>
        {children}
    </div>
);

export default async function ServicesPage() {
    const workspace = await currentWorkspace();
    if (!workspace) return redirect("/sign-in");

    const services = await db.service.findMany({
        where: { workspaceId: workspace.id },
        include: { _count: { select: { requests: true } } },
        orderBy: { createdAt: "desc" },
    });

    const activeServices = services.filter(s => s.status === "Active").length;
    const activeSubscriptions = await db.subscription.count({
        where: { workspaceId: workspace.id, status: "active" }
    });
    const retainerRevenue = await db.subscription.aggregate({
        where: { workspaceId: workspace.id, status: "active" },
        _sum: { amount: true },
    });
    const monthlyRevenue = (retainerRevenue._sum.amount || 0) / 100;

    const summaryCards = [
        { label: "Active Services", value: activeServices.toString(), sub: `${services.length} total`, icon: Package, color: "text-primary" },
        { label: "Monthly Revenue", value: `$${monthlyRevenue.toLocaleString()}`, sub: "from retainers", icon: DollarSign, color: "text-emerald-400" },
        { label: "Active Subscriptions", value: activeSubscriptions.toString(), sub: "clients on retainers", icon: Users, color: "text-amber-400" },
    ];

    const formatPrice = (price: any) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(price));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white/90">Services</h1>
                    <p className="text-sm text-white/50 mt-1">Manage your service catalog and pricing.</p>
                </div>
                <CreateServiceDialog />
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {summaryCards.map((c, i) => (
                    <GlassCard key={i} className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center border border-primary/10">
                                <c.icon className={`w-5 h-5 ${c.color}`} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white/90">{c.value}</p>
                        <p className="text-xs text-white/40 mt-1">{c.label}</p>
                        <p className="text-[10px] text-white/30 mt-0.5">{c.sub}</p>
                    </GlassCard>
                ))}
            </div>

            {/* Service cards */}
            {services.length === 0 ? (
                <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] border-dashed rounded-2xl p-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                        <Package className="w-7 h-7 text-white/20" />
                    </div>
                    <p className="text-sm font-medium text-white/50">No services created</p>
                    <p className="text-xs text-white/30 mt-1">Start by defining your first offering.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {services.map((s) => {
                        const deliverables = Array.isArray(s.deliverables) ? s.deliverables as string[] : [];
                        return (
                            <GlassCard key={s.id} className="p-5 group cursor-pointer hover:bg-white/[0.06]">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center border border-primary/10">
                                            <Package className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-white/85 group-hover:text-white transition-colors">{s.name}</h3>
                                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${statusStyles[s.status] || statusStyles["Active"]}`}>
                                                {s.status}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="text-white/20 hover:text-white/50 opacity-0 group-hover:opacity-100 transition-all">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>

                                <p className="text-xs text-white/45 mb-4 leading-relaxed">{s.description || "No description provided."}</p>

                                {/* Price */}
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-xl font-bold text-white/90">{formatPrice(s.price)}</span>
                                    <span className="text-xs text-white/40">{s.type === "Recurring" ? "/month" : "one-time"}</span>
                                </div>

                                {/* Deliverables */}
                                {deliverables.length > 0 && (
                                    <div className="space-y-1.5 mb-4">
                                        {deliverables.map((d, j) => (
                                            <div key={j} className="flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-primary/50" />
                                                <span className="text-xs text-white/50">{String(d)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                                    <div className="flex items-center gap-1.5">
                                        <Users className="w-3 h-3 text-white/30" />
                                        <span className="text-xs text-white/40">{s._count.requests} active</span>
                                    </div>
                                    <CheckoutButton serviceId={s.id} workspaceId={workspace.id} />
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
