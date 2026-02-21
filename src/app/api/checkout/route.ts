import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
    try {
        const { serviceId, workspaceId } = await req.json();

        if (!serviceId || !workspaceId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const service = await db.service.findUnique({
            where: {
                id: serviceId,
                workspaceId: workspaceId,
            }
        });

        if (!service) {
            return new NextResponse("Service not found", { status: 404 });
        }

        const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "https://originspillar.com";

        // Construct the checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: service.type === "Recurring" ? "subscription" : "payment",
            success_url: `${origin}/dashboard/services?success=true`,
            cancel_url: `${origin}/dashboard/services?canceled=true`,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: service.name,
                            description: service.description || undefined,
                        },
                        unit_amount: Math.round(Number(service.price) * 100), // Stripe expects cents
                        ...(service.type === "Recurring" ? { recurring: { interval: "month" } } : {}),
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                workspaceId: workspaceId,
                serviceId: serviceId,
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("[CHECKOUT_ERROR]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
