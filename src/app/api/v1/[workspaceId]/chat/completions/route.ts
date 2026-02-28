/**
 * API Gateway - Unified Chat Completions Endpoint
 * POST /api/v1/[workspaceId]/chat/completions
 * 
 * This endpoint:
 * 1. Validates GatewayKey (platform-issued API key)
 * 2. Finds the right provider (builtin or custom) for the model
 * 3. Routes request to the correct AI provider
 * 4. Logs UsageRecord
 * 5. Returns unified response format
 */

import { NextRequest, NextResponse } from 'next/server'
import { db as prisma } from '@/lib/db'
import { decrypt } from '@/lib/encryption'
import { validateApiKey } from '@/lib/api-key-auth'
import {
    routeChatRequest,
    routeCustomChatRequest,
    detectProvider,
    type ChatRequest,
    type ChatResponse
} from '@/lib/providers'
import {
    calculateCost,
} from '@/lib/token-counter'
import { ProviderCredential } from '@prisma/client'

interface RouteParams {
    params: Promise<{ workspaceId: string }>
}

export async function POST(
    request: NextRequest,
    { params }: RouteParams
) {
    const startTime = Date.now()
    const { workspaceId } = await params

    try {
        // Validate API key from header using GatewayKey model
        const authResult = await validateApiKey(request)

        if (authResult instanceof NextResponse) {
            return authResult
        }

        const { workspaceId: keyWorkspaceId, gatewayKeyId, rateLimitRpm, rateLimitRpd, maxTokensPerRequest } = authResult

        // Verify the workspaceId matches the URL parameter
        if (keyWorkspaceId !== workspaceId) {
            return NextResponse.json(
                { error: 'API key does not match workspace' },
                { status: 403 }
            )
        }

        // Find workspace with providers
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: {
                providerCredentials: true,
            },
        })

        if (!workspace) {
            return NextResponse.json(
                { error: 'Workspace not found' },
                { status: 404 }
            )
        }

        // Parse request body
        const body = await request.json()
        const chatRequest: ChatRequest = {
            messages: body.messages || [],
            model: body.model || 'gpt-4o-mini',
            temperature: body.temperature,
            max_tokens: body.max_tokens,
            stream: false, // Streaming not supported in MVP
            top_p: body.top_p,
            stop: body.stop,
        }

        // Validate messages
        if (!chatRequest.messages || chatRequest.messages.length === 0) {
            return NextResponse.json(
                { error: 'Messages array is required and cannot be empty' },
                { status: 400 }
            )
        }

        // Find provider for this model
        let providerCred = workspace.providerCredentials.find((p: ProviderCredential) => {
            if (!p.isActive) return false
            if (p.providerType === 'custom' && p.models) {
                const models = JSON.parse(p.models)
                return models.includes(chatRequest.model)
            }
            return false
        })

        // Builtin providers
        if (!providerCred) {
            const detectedProvider = detectProvider(chatRequest.model)
            providerCred = workspace.providerCredentials.find((p: ProviderCredential) =>
                p.provider === detectedProvider &&
                p.providerType === 'builtin' &&
                p.isActive
            )
        }

        // Fallback detection
        if (!providerCred) {
            providerCred = workspace.providerCredentials.find((p: ProviderCredential) => {
                if (!p.isActive) return false
                if (p.providerType === 'builtin') {
                    if (p.provider === 'openai' && chatRequest.model.includes('gpt')) return true
                    if (p.provider === 'anthropic' && chatRequest.model.includes('claude')) return true
                    if (p.provider === 'deepseek' && chatRequest.model.includes('deepseek')) return true
                }
                return false
            })
        }

        if (!providerCred) {
            return NextResponse.json(
                {
                    error: `No provider configured for model "${chatRequest.model}". Add a provider key in the dashboard.`
                },
                { status: 400 }
            )
        }

        // Decrypt the API key
        const decryptedKey = decrypt(providerCred.encryptedKey)

        // Route to provider
        let response: ChatResponse
        try {
            if (providerCred.providerType === 'custom' && providerCred.endpointUrl) {
                // Custom provider
                response = await routeCustomChatRequest(
                    providerCred.endpointUrl,
                    decryptedKey,
                    chatRequest,
                    providerCred.apiFormat as 'openai' | 'anthropic'
                )
            } else {
                // Builtin provider
                response = await routeChatRequest(
                    providerCred.provider as 'openai' | 'anthropic' | 'deepseek',
                    decryptedKey,
                    chatRequest
                )
            }
        } catch (error: any) {
            // Log failed request
            await prisma.usageRecord.create({
                data: {
                    workspaceId: workspace.id,
                    gatewayKeyId: gatewayKeyId,
                    endpoint: '/chat/completions',
                    model: chatRequest.model,
                    provider: providerCred.provider,
                    promptTokens: 0,
                    completionTokens: 0,
                    totalTokens: 0,
                    providerCost: 0,
                    markupApplied: 0,
                    agencyCost: 0,
                    latency: Date.now() - startTime,
                    statusCode: 500,
                    errorMessage: error.message,
                },
            })

            return NextResponse.json(
                { error: `Provider error: ${error.message}` },
                { status: 500 }
            )
        }

        // Calculate provider cost
        const providerCost = calculateCost(
            response.usage.prompt_tokens,
            response.usage.completion_tokens,
            chatRequest.model
        )

        // Agency markup (e.g. 5%)
        // Can be made dynamic per-workspace later
        const markupPercent = 5;
        const markupAmount = providerCost * (markupPercent / 100);
        const agencyCost = providerCost + markupAmount;

        // Log request
        await prisma.usageRecord.create({
            data: {
                workspaceId: workspace.id,
                gatewayKeyId: gatewayKeyId,
                endpoint: '/chat/completions',
                model: chatRequest.model,
                provider: providerCred.provider,
                promptTokens: response.usage.prompt_tokens,
                completionTokens: response.usage.completion_tokens,
                totalTokens: response.usage.total_tokens,
                providerCost: providerCost,
                markupApplied: markupAmount,
                agencyCost: agencyCost,
                latency: response.latency_ms,
                statusCode: 200,
            },
        })

        // Update provider last used
        await prisma.providerCredential.update({
            where: { id: providerCred.id },
            data: { lastUsedAt: new Date() },
        })

        // Return response
        return NextResponse.json({
            ...response,
            provider_name: providerCred.keyName,
            usage: {
                ...response.usage,
                provider_cost: providerCost,
                agency_cost: agencyCost,
            },
        })

    } catch (error: any) {
        console.error('API Gateway error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
