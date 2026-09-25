import { MAX_CONTEXT_TURNS } from '@/constants/assistant'
import { createGeminiProvider, type LlmMessage, type LlmProvider } from '@/libs/gemini'
import { AppError, toAppError } from '@/libs/axios/error'
import { extractJson } from '@/utils/json'
import { assistantReplySchema } from './assistant.schema'
import { buildSystemPrompt, REPAIR_INSTRUCTION } from './assistant.prompt'
import type { AskAssistantInput, AssistantReply, ChatMessage } from './assistant.type'

let provider: LlmProvider | null = null

function getProvider(): LlmProvider {
  provider ??= createGeminiProvider()
  return provider
}

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

export function parseReply(raw: string, options?: { allowFallback?: boolean }): AssistantReply {
  const parsed = assistantReplySchema.safeParse(extractJson(raw))
  if (parsed.success) return parsed.data

  if (!options?.allowFallback) {
    throw new AppError(
      'INVALID_RESPONSE',
      'Failed to parse structured JSON from assistant.',
    )
  }

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

      const repaired = await llm.chat({
        system,
        messages: [...messages, { role: 'user', text: REPAIR_INSTRUCTION }],
        signal,
      })
      return parseReply(repaired, { allowFallback: true })
    }
  } catch (error) {
    throw toAppError(error)
  }
}
