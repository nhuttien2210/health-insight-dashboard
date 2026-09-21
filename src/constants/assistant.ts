export const SUGGESTED_QUESTIONS = [
  'How am I progressing?',
  'What should I focus on?',
  'How has my activity changed?',
  'Give me a summary of my current health.',
  'What are some areas I could improve?',
] as const

/** Turns kept in the request. The transcript on screen is not truncated. */
export const MAX_CONTEXT_TURNS = 8

export const ASSISTANT_DISCLAIMER =
  'General wellness information based on your data. Not medical advice.'

export const DEFAULT_GEMINI_MODEL = 'gemini-2.0-flash'

/** Low temperature: this assistant reports numbers, it does not write freely. */
export const LLM_TEMPERATURE = 0.3

export const LLM_MAX_OUTPUT_TOKENS = 900
