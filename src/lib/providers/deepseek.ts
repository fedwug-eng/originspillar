/**
 * DeepSeek provider implementation
 * DeepSeek uses an OpenAI-compatible API
 */

import type { ChatRequest, ChatResponse, ChatMessage } from './types'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1'

interface DeepSeekChoice {
  index: number
  message: {
    role: string
    content: string
  }
  finish_reason: string
}

interface DeepSeekResponse {
  id: string
  object: string
  created: number
  model: string
  choices: DeepSeekChoice[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export async function deepseekChat(
  apiKey: string,
  request: ChatRequest
): Promise<ChatResponse> {
  const startTime = Date.now()

  const response = await fetch(`${DEEPSEEK_API_URL}/chat/completions`, {
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
    signal: AbortSignal.timeout(60000),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`DeepSeek API error: ${response.status} - ${error}`)
  }

  const data: DeepSeekResponse = await response.json()
  const latency = Date.now() - startTime

  return {
    id: data.id,
    model: data.model,
    provider: 'deepseek',
    choices: data.choices.map((choice) => ({
      index: choice.index,
      message: {
        role: choice.message.role as ChatMessage['role'],
        content: choice.message.content,
      },
      finish_reason: choice.finish_reason,
    })),
    usage: {
      prompt_tokens: data.usage.prompt_tokens,
      completion_tokens: data.usage.completion_tokens,
      total_tokens: data.usage.total_tokens,
    },
    latency_ms: latency,
  }
}

export const DEEPSEEK_MODELS = [
  'deepseek-chat',
  'deepseek-coder',
]

export function isDeepSeekModel(model: string): boolean {
  return DEEPSEEK_MODELS.includes(model)
}
