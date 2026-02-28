/**
 * Simple token counter for estimating token usage
 * In production, use tiktoken for accurate counts
 */

// Average characters per token (rough estimates)
const CHARS_PER_TOKEN: Record<string, number> = {
    // OpenAI
    'gpt-4.5': 3.5,
    'gpt-4': 4,
    'gpt-4-turbo': 4,
    'gpt-3.5-turbo': 4,
    // Anthropic Claude
    'claude-4': 3.5,
    'claude-3-opus': 3.5,
    'claude-3-sonnet': 3.5,
    'claude-3-haiku': 3.5,
    // DeepSeek
    'deepseek-chat': 4,
    'deepseek-coder': 4,
    'deepseek-v3': 4,
    'deepseek-r1': 4,
    // Google
    'gemini': 4,
    // xAI
    'grok': 4,
    'default': 4,
}

/**
 * Estimate token count from text
 */
export function estimateTokens(text: string, model: string = 'default'): number {
    const charsPerToken = CHARS_PER_TOKEN[model] || CHARS_PER_TOKEN['default']
    return Math.ceil(text.length / charsPerToken)
}

/**
 * Count tokens for chat messages
 */
export function countChatTokens(
    messages: Array<{ role: string; content: string }>,
    model: string = 'default'
): number {
    let totalTokens = 0

    for (const message of messages) {
        // Add tokens for role and formatting
        totalTokens += 4 // Every message follows <im_start>{role/name}\n{content}<im_end>\n

        // Add tokens for content
        totalTokens += estimateTokens(message.content, model)
    }

    // Add tokens for reply priming
    totalTokens += 3

    return totalTokens
}

/**
 * Pricing per 1K tokens (in USD)
 * Update these as pricing changes
 */
export const PRICING_PER_1K_TOKENS: Record<string, { input: number; output: number }> = {
    // OpenAI models (February 2026)
    'gpt-4.5': { input: 0.075, output: 0.15 },
    'gpt-4o': { input: 0.0025, output: 0.01 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
    'o3': { input: 0.01, output: 0.04 },
    'o4-mini': { input: 0.0011, output: 0.0044 },

    // Anthropic models (Claude 4 - May 2025)
    'claude-sonnet-4-20250514': { input: 0.003, output: 0.015 },
    'claude-opus-4-20250514': { input: 0.015, output: 0.075 },
    'claude-4-haiku-20250514': { input: 0.0008, output: 0.004 },
    'claude-3-5-sonnet-20241022': { input: 0.003, output: 0.015 },
    'claude-3-opus-20240229': { input: 0.015, output: 0.075 },
    'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 },

    // DeepSeek models
    'deepseek-chat': { input: 0.00014, output: 0.00028 },
    'deepseek-coder': { input: 0.00014, output: 0.00028 },
    'deepseek-v3': { input: 0.00027, output: 0.0011 },
    'deepseek-r1': { input: 0.00055, output: 0.00219 },

    // Google Gemini models
    'gemini-2.0-flash': { input: 0.0, output: 0.0 }, // Free
    'gemini-1.5-pro': { input: 0.00125, output: 0.005 },
    'gemini-1.5-flash': { input: 0.000075, output: 0.0003 },

    // xAI Grok models
    'grok-3': { input: 0.003, output: 0.015 },
    'grok-3-mini': { input: 0.0006, output: 0.003 },
    'grok-2': { input: 0.002, output: 0.01 },

    // Default fallback
    'default': { input: 0.001, output: 0.002 },
}

/**
 * Calculate cost for tokens
 */
export function calculateCost(
    inputTokens: number,
    outputTokens: number,
    model: string
): number {
    const pricing = PRICING_PER_1K_TOKENS[model] || PRICING_PER_1K_TOKENS['default']

    const inputCost = (inputTokens / 1000) * pricing.input
    const outputCost = (outputTokens / 1000) * pricing.output

    return inputCost + outputCost
}
