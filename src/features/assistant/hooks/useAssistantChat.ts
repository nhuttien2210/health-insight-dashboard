import { useCallback, useRef } from 'react'
import { useAskAssistantMutation } from '@/apis/assistant/assistant.query'
import type { ChatMessage } from '@/apis/assistant/assistant.type'
import { isLlmConfigured } from '@/libs/gemini'
import { toAppError } from '@/libs/axios/error'
import { useAssistantStore } from '../stores/useAssistantStore'
import { useHealthContext } from './useHealthContext'

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
    status: role === 'user' ? 'done' : 'pending',
  }
}

export function useAssistantChat() {
  const context = useHealthContext()
  const messages = useAssistantStore((state) => state.messages)
  const appendMessage = useAssistantStore((state) => state.appendMessage)
  const updateMessage = useAssistantStore((state) => state.updateMessage)
  const removeMessage = useAssistantStore((state) => state.removeMessage)
  const clearConversation = useAssistantStore((state) => state.clearConversation)

  const mutation = useAskAssistantMutation()
  const abortRef = useRef<AbortController | null>(null)

  const ask = useCallback(
    async (question: string) => {
      const trimmed = question.trim()
      if (trimmed.length === 0 || context === null || mutation.isPending) return

      const userMessage = createMessage('user', trimmed)
      const pendingMessage = createMessage('assistant', '')

      const history = useAssistantStore.getState().messages

      appendMessage(userMessage)
      appendMessage(pendingMessage)

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const reply = await mutation.mutateAsync({
          question: trimmed,
          history,
          context,
          signal: controller.signal,
        })
        updateMessage(pendingMessage.id, { status: 'done', content: reply.answer, reply })
      } catch (error) {
        const appError = toAppError(error)
        if (appError.code === 'ABORTED') {
          removeMessage(pendingMessage.id)
          return
        }
        updateMessage(pendingMessage.id, {
          status: 'error',
          content: appError.message,
          errorCode: appError.code,
        })
      }
    },
    [appendMessage, context, mutation, removeMessage, updateMessage],
  )

  const retry = useCallback(
    (messageId: string) => {
      const current = useAssistantStore.getState().messages
      const index = current.findIndex((message) => message.id === messageId)
      const question = current[index - 1]
      if (!question || question.role !== 'user') return
      removeMessage(messageId)
      void ask(question.content)
    },
    [ask, removeMessage],
  )

  const cancel = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return {
    messages,
    ask,
    retry,
    cancel,
    clearConversation,
    isPending: mutation.isPending,
    isConfigured: isLlmConfigured(),
    hasContext: context !== null,
  }
}
