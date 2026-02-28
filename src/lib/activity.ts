import { db } from "@/lib/db";

/**
 * Log an activity event for the workspace feed and notifications.
 */
export async function logActivity({
    actorId,
    action,
    resourceType,
    resourceId,
    workspaceId,
    metadata,
}: {
    actorId: string;
    action: string;       // e.g. "request.created", "client.onboarded", "message.sent"
    resourceType: string; // e.g. "request", "client", "message", "service"
    resourceId: string;
    workspaceId: string;
    metadata?: Record<string, unknown>;
}) {
    try {
        await db.activityLog.create({
            data: {
                actorId,
                action,
                resourceType,
                resourceId,
                workspaceId,
                metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
            },
        });
    } catch (error) {
        // Non-critical: don't crash the parent operation
        console.error("Failed to log activity:", error);
    }
}
