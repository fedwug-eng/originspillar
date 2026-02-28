/**
 * Anthropic (Claude) provider implementation
 */

import type { ChatRequest, ChatResponse, ChatMessage } from './types'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1'

interface AnthropicResponse {
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

export async function anthropicChat(
  apiKey: string,
  request: ChatRequest
): Promise<ChatResponse> {
  const startTime = Date.now()
  
  // Extract system message if present
  const systemMessage = request.messages.find(m => m.role === 'system')
  const otherMessages = request.messages.filter(m => m.role !== 'system')
  
  const response = await fetch(`${ANTHROPIC_API_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
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
      top_p: request.top_p,
      stop_sequences: request.stop,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Anthropic API error: ${response.status} - ${error}`)
  }

  const data: AnthropicResponse = await response.json()
  const latency = Date.now() - startTime

  return {
    id: data.id,
    model: data.model,
    provider: 'anthropic',
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

export const ANTHROPIC_MODELS = [
  'claude-3-5-sonnet-20241022',
  'claude-3-5-sonnet',
  'claude-3-opus-20240229',
  'claude-3-opus',
  'claude-3-sonnet-20240229',
  'claude-3-sonnet',
  'claude-3-haiku-20240307',
  'claude-3-haiku',
]

export function isAnthropicModel(model: string): boolean {
  return ANTHROPIC_MODELS.some(m => model.includes(m.replace('-20240229', '').replace('-20240307', '').replace('-20241022', '')))
}
