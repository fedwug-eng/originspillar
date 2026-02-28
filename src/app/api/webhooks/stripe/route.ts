import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: unknown) {
        if (error instanceof Error) {
            return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
        }
        return new NextResponse(`Webhook Error: Unknown Error`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    // Handle successful checkouts
    if (event.type === "checkout.session.completed") {
        const workspaceId = session.metadata?.workspaceId;
        const serviceId = session.metadata?.serviceId;

        // If it was a subscription payment (Recurring Service)
        if (session.subscription && workspaceId) {
            // @ts-ignore: Stripe subscription typings conflict natively with TS
            const subscription = await stripe.subscriptions.retrieve(
                session.subscription as string
            );

            await db.subscription.upsert({
                where: { stripeSubscriptionId: subscription.id },
                update: {
                    status: subscription.status,
                    // @ts-ignore: Stripe current_period_start is valid
                    currentPeriodStart: new Date(subscription.current_period_start * 1000),
                    // @ts-ignore: Stripe current_period_end is valid
                    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                    cancelAtPeriodEnd: subscription.cancel_at_period_end,
                },
                create: {
                    stripeSubscriptionId: subscription.id,
                    status: subscription.status,
                    amount: session.amount_total || 0,
                    // @ts-ignore: Stripe current_period_start is valid
                    currentPeriodStart: new Date(subscription.current_period_start * 1000),
                    // @ts-ignore: Stripe current_period_end is valid
                    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                    cancelAtPeriodEnd: subscription.cancel_at_period_end,
                    workspaceId: workspaceId,
                }
            });

            console.log(`[STRIPE] Subscription created for workspace ${workspaceId}`);
        }

        // Let the console know a checkout succeeded
        console.log(`[STRIPE] Checkout successful for service ${serviceId} in workspace ${workspaceId}`);
    }

    // Handle subscription renewals or payments
    if (event.type === "invoice.payment_succeeded") {
        const invoice = event.data.object as Stripe.Invoice;
        // @ts-ignore: Stripe subscription typing
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
            // @ts-ignore: Stripe subscription typings conflict natively with TS
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);

            await db.subscription.updateMany({
                where: { stripeSubscriptionId: subscriptionId },
                data: {
                    status: subscription.status,
                    // @ts-ignore: Stripe current_period_start is valid
                    currentPeriodStart: new Date(subscription.current_period_start * 1000),
                    // @ts-ignore: Stripe current_period_start is valid
                    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                }
            });
            console.log(`[STRIPE] Invoice paid out for subscription ${subscriptionId}`);
        }
    }

    // Handle subscription cancellation or updates
    if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
        const subscription = event.data.object as Stripe.Subscription;

        await db.subscription.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: {
                status: subscription.status,
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                // @ts-ignore
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                // @ts-ignore
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            }
        });

        console.log(`[STRIPE] Subscription ${subscription.id} status updated to ${subscription.status}`);
    }

    return new NextResponse(null, { status: 200 });
}
