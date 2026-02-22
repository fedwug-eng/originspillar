import { db } from "@/lib/db";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { currentWorkspace } from "@/lib/current-workspace";

export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { MoreHorizontal, Box } from "lucide-react";
import { CreateServiceDialog } from "@/components/services/create-service-dialog";
import { CheckoutButton } from "@/components/services/checkout-button";
import { redirect } from "next/navigation";

export default async function ServicesPage() {
    const workspace = await currentWorkspace();

    if (!workspace) {
        return redirect("/sign-in");
    }

    const services = await db.service.findMany({
        where: {
            workspaceId: workspace.id,
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formatPrice = (price: any) => {
        const numPrice = Number(price);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(numPrice);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Services</h2>
                    <p className="text-muted-foreground mt-1">
                        Manage your service catalog and pricing.
                    </p>
                </div>
                <CreateServiceDialog />
            </div>

            {services.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-border border-dashed bg-card p-8 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mb-6">
                        <Box className="w-9 h-9 text-accent-foreground/40" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">No services created</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        You haven&apos;t created any services yet. Start by defining your first offering.
                    </p>
                </div>
            ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <div key={service.id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-xl hover:shadow-primary/[0.04] transition-all duration-500">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${service.status === "Active" ? "bg-op-emerald/10 text-op-emerald" : "bg-secondary text-muted-foreground"}`}>
                                        {service.status}
                                    </span>
                                    <Button variant="ghost" size="icon" className="-mr-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full h-8 w-8">
                                        <span className="sr-only">Actions</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-1.5">{service.name}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{service.description || "No description provided."}</p>
                                <div className="flex items-baseline gap-1 mt-5">
                                    <span className="text-3xl font-extrabold text-foreground">{formatPrice(service.price)}</span>
                                    {service.type === "Recurring" && (
                                        <span className="text-sm text-muted-foreground">/ month</span>
                                    )}
                                </div>
                            </div>
                            <div className="px-6 pb-6 pt-4 border-t border-border space-y-3">
                                <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2.5 py-1 rounded-lg">
                                    {service.type}
                                </span>
                                <div className="w-full">
                                    <CheckoutButton serviceId={service.id} workspaceId={workspace.id} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
