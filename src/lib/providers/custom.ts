/**
 * Custom Provider implementation
 * Handles any OpenAI-compatible API endpoint
 */

import type { ChatRequest, ChatResponse, ChatMessage } from './types'

interface OpenAICompatibleResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

interface AnthropicCompatibleResponse {
  id: string
  type: string
  role: string
  model: string
  content: Array<{
    type: string
    text: string
  }>
  stop_reason: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

/**
 * Make a request to a custom OpenAI-compatible endpoint
 */
export async function customOpenAIChat(
  endpointUrl: string,
  apiKey: string,
  request: ChatRequest
): Promise<ChatResponse> {
  const startTime = Date.now()
  
  // Ensure endpoint ends with /chat/completions
  let url = endpointUrl
  if (!url.endsWith('/chat/completions')) {
    url = url.replace(/\/$/, '') + '/chat/completions'
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: request.model,
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.max_tokens,
      stream: false,
      top_p: request.top_p,
      stop: request.stop,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Custom API error: ${response.status} - ${error}`)
  }

  const data: OpenAICompatibleResponse = await response.json()
  const latency = Date.now() - startTime

  return {
    id: data.id || `custom-${Date.now()}`,
    model: data.model || request.model,
    provider: 'custom',
    choices: data.choices.map((choice) => ({
      index: choice.index,
      message: {
        role: choice.message.role as ChatMessage['role'],
        content: choice.message.content,
      },
      finish_reason: choice.finish_reason,
    })),
    usage: {
      prompt_tokens: data.usage?.prompt_tokens || 0,
      completion_tokens: data.usage?.completion_tokens || 0,
      total_tokens: data.usage?.total_tokens || 0,
    },
    latency_ms: latency,
  }
}

/**
 * Make a request to a custom Anthropic-compatible endpoint
 */
export async function customAnthropicChat(
  endpointUrl: string,
  apiKey: string,
  request: ChatRequest
): Promise<ChatResponse> {
  const startTime = Date.now()
  
  // Ensure endpoint ends with /messages
  let url = endpointUrl
  if (!url.endsWith('/messages')) {
    url = url.replace(/\/$/, '') + '/messages'
  }
  
  // Extract system message if present
  const systemMessage = request.messages.find(m => m.role === 'system')
  const otherMessages = request.messages.filter(m => m.role !== 'system')
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: request.model,
      max_tokens: request.max_tokens ?? 4096,
      system: systemMessage?.content,
      messages: otherMessages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      temperature: request.temperature ?? 0.7,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Custom API error: ${response.status} - ${error}`)
  }

  const data: AnthropicCompatibleResponse = await response.json()
  const latency = Date.now() - startTime

  return {
    id: data.id || `custom-${Date.now()}`,
    model: data.model || request.model,
    provider: 'custom',
    choices: [{
      index: 0,
      message: {
        role: 'assistant',
        content: data.content
          .filter(c => c.type === 'text')
          .map(c => c.text)
          .join(''),
      },
      finish_reason: data.stop_reason || 'stop',
    }],
    usage: {
      prompt_tokens: data.usage.input_tokens,
      completion_tokens: data.usage.output_tokens,
      total_tokens: data.usage.input_tokens + data.usage.output_tokens,
    },
    latency_ms: latency,
  }
}

/**
 * Route to custom provider based on API format
 */
export async function customChat(
  endpointUrl: string,
  apiKey: string,
  request: ChatRequest,
  apiFormat: 'openai' | 'anthropic' = 'openai'
): Promise<ChatResponse> {
  if (apiFormat === 'anthropic') {
    return customAnthropicChat(endpointUrl, apiKey, request)
  }
  return customOpenAIChat(endpointUrl, apiKey, request)
}
