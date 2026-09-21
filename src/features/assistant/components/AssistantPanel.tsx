import { useEffect, useRef } from 'react'
import { KeyRound, MessageSquarePlus, Sparkles } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ASSISTANT_DISCLAIMER, SUGGESTED_QUESTIONS } from '@/constants/assistant'
import { useAssistantStore } from '../stores/useAssistantStore'
import { useAssistantChat } from '../hooks/useAssistantChat'
import { ChatComposer } from './ChatComposer'
import { ChatMessageItem } from './ChatMessageItem'

export function AssistantPanel() {
  const { messages, ask, retry, cancel, clearConversation, isPending, isConfigured, hasContext } =
    useAssistantChat()
  const prefilledQuestion = useAssistantStore((state) => state.prefilledQuestion)
  const consumePrefilled = useAssistantStore((state) => state.consumePrefilled)
  const scrollRef = useRef<HTMLDivElement>(null)

  // A question can be opened from a dashboard card; it is asked once, then cleared.
  useEffect(() => {
    if (!prefilledQuestion || !isConfigured || !hasContext) return
    consumePrefilled()
    void ask(prefilledQuestion)
  }, [ask, consumePrefilled, hasContext, isConfigured, prefilledQuestion])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {!isConfigured ? (
          <Alert>
            <KeyRound />
            <AlertTitle>The assistant needs an API key</AlertTitle>
            <AlertDescription>
              Add <code className="font-mono text-xs">VITE_GEMINI_API_KEY</code> to your{' '}
              <code className="font-mono text-xs">.env</code> file and reload. Everything else on the
              dashboard works without it.
            </AlertDescription>
          </Alert>
        ) : null}

        {messages.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="Ask about your health data"
            description="Answers come from the same 90 days the dashboard is built on, and nothing else."
            className="border-none"
          />
        ) : (
          messages.map((message) => (
            <ChatMessageItem key={message.id} message={message} onRetry={retry} onFollowUp={ask} />
          ))
        )}

        {messages.length === 0 && isConfigured ? (
          <div className="flex flex-wrap justify-center gap-1.5">
            {SUGGESTED_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => ask(question)}
                className="border-border hover:bg-accent rounded-full border px-2.5 py-1 text-xs transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="space-y-2 border-t px-4 py-3">
        <ChatComposer
          isPending={isPending}
          disabled={!isConfigured || !hasContext}
          onSubmit={ask}
          onCancel={cancel}
        />
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-[11px]">{ASSISTANT_DISCLAIMER}</p>
          {messages.length > 0 ? (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearConversation}>
              <MessageSquarePlus className="size-3.5" />
              New chat
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
