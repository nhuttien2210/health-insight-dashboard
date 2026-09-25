import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ChatMessage } from '@/apis/assistant/assistant.type'

type AssistantState = {
  isOpen: boolean
  messages: ChatMessage[]
  prefilledQuestion: string | null
  open: (prefilled?: string) => void
  close: () => void
  consumePrefilled: () => void
  appendMessage: (message: ChatMessage) => void
  updateMessage: (id: string, patch: Partial<ChatMessage>) => void
  removeMessage: (id: string) => void
  clearConversation: () => void
}

export const useAssistantStore = create<AssistantState>()(
  devtools(
    (set) => ({
      isOpen: false,
      messages: [],
      prefilledQuestion: null,

      open: (prefilled) =>
        set({ isOpen: true, prefilledQuestion: prefilled ?? null }, false, 'assistant/open'),
      close: () => set({ isOpen: false }, false, 'assistant/close'),
      consumePrefilled: () => set({ prefilledQuestion: null }, false, 'assistant/consumePrefilled'),

      appendMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] }), false, 'assistant/append'),

      updateMessage: (id, patch) =>
        set(
          (state) => ({
            messages: state.messages.map((message) =>
              message.id === id ? { ...message, ...patch } : message,
            ),
          }),
          false,
          'assistant/update',
        ),

      removeMessage: (id) =>
        set(
          (state) => ({ messages: state.messages.filter((message) => message.id !== id) }),
          false,
          'assistant/remove',
        ),

      clearConversation: () => set({ messages: [] }, false, 'assistant/clear'),
    }),
    { name: 'AssistantStore' },
  ),
)

export const selectIsOpen = (state: AssistantState) => state.isOpen
export const selectMessages = (state: AssistantState) => state.messages
