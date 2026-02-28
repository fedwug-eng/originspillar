"use server";

import { currentUser } from "@/lib/current-workspace";
import { db } from "@/lib/db";

export async function getGatewayUsageData(page = 1, limit = 20) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const skip = (page - 1) * limit;

    const [requests, totalRecords, aggregateStats] = await Promise.all([
        db.usageRecord.findMany({
            where: { workspaceId: user.workspace.id },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
            select: {
                id: true,
                provider: true,
                model: true,
                totalTokens: true,
                providerCost: true,
                latency: true,
                statusCode: true,
                createdAt: true,
                gatewayKey: { select: { keyName: true } }
            }
        }),
        db.usageRecord.count({
            where: { workspaceId: user.workspace.id }
        }),
        db.usageRecord.aggregate({
            where: { workspaceId: user.workspace.id },
            _sum: {
                totalTokens: true,
                providerCost: true,
                markupApplied: true,
            },
            _avg: {
                latency: true,
            }
        })
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    return {
        requests,
        pagination: {
            page,
            limit,
            totalRecords,
            totalPages
        },
        stats: {
            totalTokens: aggregateStats._sum.totalTokens || 0,
            providerCost: aggregateStats._sum.providerCost || 0,
            agencyProfit: aggregateStats._sum?.markupApplied || 0,
            avgLatency: aggregateStats._avg?.latency || 0
        }
    };
}
