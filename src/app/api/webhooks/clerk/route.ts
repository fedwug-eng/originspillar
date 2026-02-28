import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db as prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_signature || !svix_timestamp) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400
        })
    }

    const eventType = evt.type;

    if (eventType === 'user.created') {
        const { id, email_addresses, first_name, last_name } = evt.data;

        const email = email_addresses[0]?.email_address;

        if (!email) {
            console.error("No email provided in webhook payload", id);
            return new Response('No email address provided', { status: 400 });
        }

        try {
            // Check if this new user is actually a Client invited by an Agency
            const existingClientRecord = await prisma.client.findFirst({
                where: { email: email.toLowerCase() }
            });

            if (existingClientRecord) {
                // It's a client logging in for the first time!
                await prisma.user.create({
                    data: {
                        clerkUserId: id,
                        email: email,
                        firstName: first_name,
                        lastName: last_name,
                        role: 'CLIENT',
                        workspaceId: existingClientRecord.workspaceId
                    }
                });
                console.log(`Successfully mapped Clerk ID ${id} to existing Client record for workspace ${existingClientRecord.workspaceId}`);
                return new Response('', { status: 200 });
            }

            // Otherwise, it's a net-new Agency signing up
            // Use native Prisma nested writes for guaranteed atomic database transactions
            const workspace = await prisma.workspace.create({
                data: {
                    name: `${first_name || 'Agency'}'s Workspace`,
                    slug: `ws-${id.substring(0, 8).toLowerCase()}`,
                    users: {
                        create: {
                            clerkUserId: id,
                            email: email,
                            firstName: first_name,
                            lastName: last_name,
                            role: 'ADMIN',
                        }
                    }
                }
            });

            console.log(`Successfully created new atomic ADMIN user & workspace for Clerk ID: ${id}`);
        } catch (error) {
            console.error("Error creating user/workspace in DB", error);
            return new Response('Error interacting with database', { status: 500 });
        }
    }

    return new Response('', { status: 200 })
}
