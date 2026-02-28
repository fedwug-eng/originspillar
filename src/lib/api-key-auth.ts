import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { verifyApiKey, getKeyPrefix } from '@/lib/encryption';

export interface ApiKeyContext {
    workspaceId: string;
    gatewayKeyId: string;
    keyPrefix: string;
    rateLimitRpm: number;
    rateLimitRpd: number;
    maxTokensPerRequest: number;
}

/**
 * Validate API key from Authorization header
 * Returns context object or NextResponse with error
 */
export async function validateApiKey(request: NextRequest): Promise<ApiKeyContext | NextResponse> {
    try {
        // Extract API key from Authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Missing or invalid Authorization header' },
                { status: 401 }
            );
        }

        const apiKey = authHeader.slice(7); // Remove 'Bearer '
        const keyPrefix = getKeyPrefix(apiKey);

        // Look up gateway API key in database
        const gatewayKey = await prisma.gatewayKey.findFirst({
            where: {
                keyPrefix: keyPrefix,
                status: 'active',
            },
            include: {
                workspace: true,
            },
        });

        if (!gatewayKey) {
            return NextResponse.json(
                { error: 'Invalid API key' },
                { status: 401 }
            );
        }

        // Verify the full key matches (using hash comparison)
        const isValid = verifyApiKey(apiKey, gatewayKey.keyHash);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid API key' },
                { status: 401 }
            );
        }

        // Check if key is expired
        if (gatewayKey.expiresAt && gatewayKey.expiresAt < new Date()) {
            return NextResponse.json(
                { error: 'API key expired' },
                { status: 401 }
            );
        }

        // Update last used timestamp asynchronously (don't block response)
        prisma.gatewayKey.update({
            where: { id: gatewayKey.id },
            data: { lastUsedAt: new Date() },
        }).catch(console.error);

        return {
            workspaceId: gatewayKey.workspaceId,
            gatewayKeyId: gatewayKey.id,
            keyPrefix: gatewayKey.keyPrefix,
            rateLimitRpm: gatewayKey.rateLimitRpm,
            rateLimitRpd: gatewayKey.rateLimitRpd,
            maxTokensPerRequest: gatewayKey.maxTokensPerRequest,
        };
    } catch (error) {
        console.error('Error validating API key:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Helper function to extract and validate API key from request
 * Use this in your API route handlers
 */
export async function requireApiKey(request: NextRequest): Promise<ApiKeyContext> {
    const result = await validateApiKey(request);

    if (result instanceof NextResponse) {
        // Return the error response
        throw result;
    }

    return result;
}
