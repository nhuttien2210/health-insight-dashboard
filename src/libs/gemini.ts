import { GoogleGenAI } from '@google/genai'
import { DEFAULT_GEMINI_MODEL, LLM_MAX_OUTPUT_TOKENS, LLM_TEMPERATURE } from '@/constants/assistant'
import { AppError } from '@/libs/axios/error'

export type LlmMessage = {
  role: 'user' | 'model'
  text: string
}

export type LlmChatInput = {
  system: string
  messages: LlmMessage[]
  signal?: AbortSignal
}

export type LlmProvider = {
  name: string
  isConfigured: boolean
  chat: (input: LlmChatInput) => Promise<string>
}

function readApiKey(): string {
  return import.meta.env.VITE_GEMINI_API_KEY?.trim() ?? ''
}

export function isLlmConfigured(): boolean {
  return readApiKey().length > 0
}

export function createGeminiProvider(): LlmProvider {
  const apiKey = readApiKey()
  const model = import.meta.env.VITE_GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL

  return {
    name: `google:${model}`,
    isConfigured: apiKey.length > 0,

    async chat({ system, messages, signal }) {
      if (apiKey.length === 0) {
        throw new AppError(
          'MISSING_KEY',
          'The AI assistant needs a Gemini API key. Add VITE_GEMINI_API_KEY to your .env file and reload.',
        )
      }

      const client = new GoogleGenAI({ apiKey })

      const response = await client.models.generateContent({
        model,
        contents: messages.map((message) => ({
          role: message.role,
          parts: [{ text: message.text }],
        })),
        config: {
          systemInstruction: system,
          temperature: LLM_TEMPERATURE,
          maxOutputTokens: LLM_MAX_OUTPUT_TOKENS,
          responseMimeType: 'application/json',
          abortSignal: signal,
        },
      })

      return response.text ?? ''
    },
  }
}
