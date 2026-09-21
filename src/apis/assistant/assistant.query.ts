import { useMutation } from '@tanstack/react-query'
import { askAssistant } from './assistant.service'
import type { AskAssistantInput, AssistantReply } from './assistant.type'

export const assistantKeys = {
  all: ['assistant'] as const,
  ask: () => [...assistantKeys.all, 'ask'] as const,
}

export function useAskAssistantMutation() {
  return useMutation<AssistantReply, Error, AskAssistantInput>({
    mutationKey: assistantKeys.ask(),
    mutationFn: askAssistant,
  })
}
