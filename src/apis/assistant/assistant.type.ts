import type { z } from 'zod'
import type {
  assistantReplySchema,
  chatMessageSchema,
  healthContextSchema,
} from './assistant.schema'

export type AssistantReply = z.infer<typeof assistantReplySchema>
export type ChatMessage = z.infer<typeof chatMessageSchema>
export type HealthContext = z.infer<typeof healthContextSchema>

export type AskAssistantInput = {
  question: string
  history: ChatMessage[]
  context: HealthContext
  signal?: AbortSignal
}
