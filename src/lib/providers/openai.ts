/**
 * OpenAI provider implementation
 */

import type { ChatRequest, ChatResponse, ChatMessage } from './types'

const OPENAI_API_URL = 'https://api.openai.com/v1'

interface OpenAIChoice {
  index: number
  message: {
    role: string
    content: string
  }
  finish_reason: string
}

interface OpenAIResponse {
  id: string
  object: string
  created: number
  model: string
  choices: OpenAIChoice[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export async function openaiChat(
  apiKey: string,
  request: ChatRequest
): Promise<ChatResponse> {
  const startTime = Date.now()

  const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
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
    throw new Error(`OpenAI API error: ${response.status} - ${error}`)
  }

  const data: OpenAIResponse = await response.json()
  const latency = Date.now() - startTime

  return {
    id: data.id,
    model: data.model,
    provider: 'openai',
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

export const OPENAI_MODELS = [
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4-turbo',
  'gpt-4-turbo-preview',
  'gpt-4',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
]

export function isOpenAIModel(model: string): boolean {
  return OPENAI_MODELS.some(m => model.startsWith(m))
}
