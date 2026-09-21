import { MAX_CONTEXT_TURNS } from '@/constants/assistant'
import { createGeminiProvider, type LlmMessage, type LlmProvider } from '@/libs/gemini'
import { AppError, toAppError } from '@/utils/error'
import { extractJson } from '@/utils/json'
import { assistantReplySchema } from './assistant.schema'
import { buildSystemPrompt, REPAIR_INSTRUCTION } from './assistant.prompt'
import type { AskAssistantInput, AssistantReply, ChatMessage } from './assistant.type'

let provider: LlmProvider | null = null

function getProvider(): LlmProvider {
  provider ??= createGeminiProvider()
  return provider
}

/** Only the tail of the conversation is sent; the transcript on screen is untouched. */
function toLlmMessages(history: ChatMessage[], question: string): LlmMessage[] {
  const recent = history
    .filter((message) => message.status === 'done')
    .slice(-MAX_CONTEXT_TURNS * 2)
    .map<LlmMessage>((message) => ({
      role: message.role === 'user' ? 'user' : 'model',
      text: message.role === 'assistant' ? (message.reply?.answer ?? message.content) : message.content,
    }))

  return [...recent, { role: 'user', text: question }]
}

/**
 * Never throws on a malformed reply: the ladder falls back to the raw text so the
 * user still sees an answer, and only a genuinely empty response is an error.
 */
export function parseReply(raw: string): AssistantReply {
  const parsed = assistantReplySchema.safeParse(extractJson(raw))
  if (parsed.success) return parsed.data

  const text = raw.trim()
  if (text.length === 0) {
    throw new AppError(
      'INVALID_RESPONSE',
      'The assistant did not return an answer. Please try asking again.',
    )
  }

  if (import.meta.env.DEV) {
    console.warn('[assistant] falling back to raw text', parsed.error?.issues)
  }

  return {
    answer: text,
    highlights: [],
    suggestions: [],
    referencedMetrics: [],
    followUpQuestions: [],
  }
}

export async function askAssistant({
  question,
  history,
  context,
  signal,
}: AskAssistantInput): Promise<AssistantReply> {
  const llm = getProvider()
  const system = buildSystemPrompt(context)
  const messages = toLlmMessages(history, question)

  try {
    const raw = await llm.chat({ system, messages, signal })

    try {
      return parseReply(raw)
    } catch (error) {
      if (toAppError(error).code !== 'INVALID_RESPONSE') throw error

      // One corrective retry only - repeated attempts burn quota and rarely help.
      const repaired = await llm.chat({
        system,
        messages: [...messages, { role: 'user', text: REPAIR_INSTRUCTION }],
        signal,
      })
      return parseReply(repaired)
    }
  } catch (error) {
    throw toAppError(error)
  }
}
