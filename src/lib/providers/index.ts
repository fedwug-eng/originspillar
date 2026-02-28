/**
 * AI Provider Router
 * Routes requests to the correct provider based on model
 */

import type { ChatRequest, ChatResponse, Provider } from './types'
import { openaiChat, isOpenAIModel } from './openai'
import { anthropicChat, isAnthropicModel } from './anthropic'
import { deepseekChat, isDeepSeekModel } from './deepseek'
import { customChat } from './custom'
import { AVAILABLE_MODELS, getModelInfo, getProviderForModel } from './types'

export type { ChatRequest, ChatResponse, Provider, ChatMessage, EmbeddingRequest } from './types'
export { AVAILABLE_MODELS, getModelInfo, getProviderForModel }
export { customChat } from './custom'

// Export model lists by provider
export const OPENAI_MODELS = AVAILABLE_MODELS.filter(m => m.provider === 'openai')
export const ANTHROPIC_MODELS = AVAILABLE_MODELS.filter(m => m.provider === 'anthropic')
export const DEEPSEEK_MODELS = AVAILABLE_MODELS.filter(m => m.provider === 'deepseek')

/**
 * Detect which provider a model belongs to (for builtin providers)
 */
export function detectProvider(model: string): Provider {
  if (isOpenAIModel(model)) return 'openai'
  if (isAnthropicModel(model)) return 'anthropic'
  if (isDeepSeekModel(model)) return 'deepseek'

  // Try to get from our model list
  const modelInfo = getModelInfo(model)
  if (modelInfo) return modelInfo.provider

  // Default to OpenAI for unknown models
  return 'openai'
}

/**
 * Route chat request to the correct provider
 */
export async function routeChatRequest(
  provider: Provider,
  apiKey: string,
  request: ChatRequest
): Promise<ChatResponse> {
  switch (provider) {
    case 'openai':
      return openaiChat(apiKey, request)
    case 'anthropic':
      return anthropicChat(apiKey, request)
    case 'deepseek':
      return deepseekChat(apiKey, request)
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}

/**
 * Route chat request to a custom provider
 */
export async function routeCustomChatRequest(
  endpointUrl: string,
  apiKey: string,
  request: ChatRequest,
  apiFormat: 'openai' | 'anthropic' = 'openai'
): Promise<ChatResponse> {
  return customChat(endpointUrl, apiKey, request, apiFormat)
}

/**
 * Get list of available models grouped by provider
 */
export function getModelsByProvider(): Record<Provider, typeof AVAILABLE_MODELS> {
  return {
    openai: AVAILABLE_MODELS.filter(m => m.provider === 'openai'),
    anthropic: AVAILABLE_MODELS.filter(m => m.provider === 'anthropic'),
    deepseek: AVAILABLE_MODELS.filter(m => m.provider === 'deepseek'),
    custom: AVAILABLE_MODELS.filter(m => m.provider === 'custom'),
  }
}

/**
 * Validate that a model is supported (for builtin models)
 */
export function isModelSupported(model: string): boolean {
  return AVAILABLE_MODELS.some(m => m.id === model)
}

/**
 * Get all available model IDs
 */
export function getAvailableModelIds(): string[] {
  return AVAILABLE_MODELS.map(m => m.id)
}

/**
 * Create embeddings (Proxy to OpenAI)
 */
export async function createEmbedding(
  apiKey: string,
  input: string | string[],
  model: string = 'text-embedding-3-small'
): Promise<any> {
  // Basic implementation for now
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ input, model })
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  return await response.json()
}
