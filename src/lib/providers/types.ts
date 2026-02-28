/**
 * Unified types for AI providers
 */

export type Provider = 'openai' | 'anthropic' | 'deepseek' | 'custom'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  messages: ChatMessage[]
  model: string
  temperature?: number
  max_tokens?: number
  stream?: boolean
  top_p?: number
  stop?: string[]
}

export interface EmbeddingRequest {
  model?: string
  input: string | string[]
  encoding_format?: 'float' | 'base64'
  user?: string
}

export interface ChatResponse {
  id: string
  model: string
  provider: Provider
  choices: Array<{
    index: number
    message: ChatMessage
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  latency_ms: number
}

export interface ModelInfo {
  id: string
  name: string
  provider: Provider
  context_window: number
  input_price: number  // per 1M tokens
  output_price: number // per 1M tokens
}

/**
 * Available models with their info
 */
export const AVAILABLE_MODELS: ModelInfo[] = [
  // OpenAI models
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    context_window: 128000,
    input_price: 2.5,
    output_price: 10,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    context_window: 128000,
    input_price: 0.15,
    output_price: 0.6,
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    context_window: 128000,
    input_price: 10,
    output_price: 30,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    context_window: 16385,
    input_price: 0.5,
    output_price: 1.5,
  },

  // Anthropic models
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    context_window: 200000,
    input_price: 3,
    output_price: 15,
  },
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    context_window: 200000,
    input_price: 15,
    output_price: 75,
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    context_window: 200000,
    input_price: 0.25,
    output_price: 1.25,
  },

  // DeepSeek models
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'deepseek',
    context_window: 64000,
    input_price: 0.14,
    output_price: 0.28,
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: 'deepseek',
    context_window: 64000,
    input_price: 0.14,
    output_price: 0.28,
  },
]

/**
 * Get model info by ID
 */
export function getModelInfo(modelId: string): ModelInfo | undefined {
  return AVAILABLE_MODELS.find(m => m.id === modelId)
}

/**
 * Get provider for a model
 */
export function getProviderForModel(modelId: string): Provider {
  const model = getModelInfo(modelId)
  return model?.provider || 'openai'
}
