import { db } from "@/lib/db";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { currentWorkspace } from "@/lib/current-workspace";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(numPrice);

        return formatted;
    };

    return (
        <div className="space-y-8 animate-in fade-in-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Services</h2>
                    <p className="text-zinc-400">
                        Manage your service catalog and pricing.
                    </p>
                </div>
                <div className="[&>button]:bg-violet-600 [&>button]:text-white [&>button:hover]:bg-violet-500 [&>button]:shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)]">
                    <CreateServiceDialog />
                </div>
            </div>

            {services.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-white/10 border-dashed bg-zinc-900/30 p-8 text-center animate-in fade-in-50">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 mb-6">
                            <Box className="w-10 h-10 text-zinc-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">No services created</h3>
                        <p className="mt-2 text-sm text-zinc-400">
                            You haven&apos;t created any services yet. Start by defining your first offering.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <Card key={service.id} className="relative bg-zinc-900/50 border-white/10 backdrop-blur-sm shadow-xl hover:border-violet-500/30 transition-all group overflow-hidden">
                            {/* Abstract Glow Overlay */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-[50px] rounded-full mix-blend-screen -z-10 group-hover:bg-violet-500/20 transition-all" />

                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <div className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${service.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>
                                        {service.status}
                                    </div>
                                    <Button variant="ghost" size="icon" className="-mr-2 text-zinc-500 hover:text-white hover:bg-white/10">
                                        <span className="sr-only">Actions</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="mt-2 text-xl text-white">{service.name}</CardTitle>
                                <CardDescription className="text-zinc-400 mt-2 line-clamp-2">{service.description || "No description provided."}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-3xl font-bold tracking-tight text-white">{formatPrice(service.price)}</span>
                                    {service.type === "Recurring" && (
                                        <span className="text-sm font-medium text-zinc-500">/ month</span>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-4 border-t border-white/5 pt-6">
                                <div className="text-xs font-medium text-zinc-400 border border-white/10 bg-white/5 rounded-md px-2.5 py-1">
                                    {service.type} Data
                                </div>
                                <div className="w-full [&>button]:w-full [&>button]:bg-white [&>button]:text-zinc-950 [&>button:hover]:bg-zinc-200 font-medium">
                                    <CheckoutButton serviceId={service.id} workspaceId={workspace.id} />
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
