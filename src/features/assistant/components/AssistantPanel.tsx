import { useEffect, useRef } from 'react'
import { MessageSquarePlus, Sparkles } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { KeyRound } from 'lucide-react'
import { ASSISTANT_DISCLAIMER, SUGGESTED_QUESTIONS } from '@/constants/assistant'
import { useAssistantStore } from '../stores/useAssistantStore'
import { useAssistantChat } from '../hooks/useAssistantChat'
import { ChatComposer } from './ChatComposer'
import { ChatMessageItem } from './ChatMessageItem'

export function AssistantPanel() {
  const { messages, ask, retry, cancel, clearConversation, isPending, isConfigured, hasContext } =
    useAssistantChat()

  function handleNewChat() {
    cancel()           
    clearConversation()
  }
  const prefilledQuestion = useAssistantStore((state) => state.prefilledQuestion)
  const consumePrefilled = useAssistantStore((state) => state.consumePrefilled)
  const scrollRef = useRef<HTMLDivElement>(null)

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
      {}
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {!isConfigured ? (
          <Alert className="border-amber-500/30 bg-amber-500/5">
            <KeyRound className="size-4 text-amber-500" />
            <AlertTitle className="text-amber-600 dark:text-amber-400">API key required</AlertTitle>
            <AlertDescription className="text-muted-foreground text-xs">
              Add <code className="bg-muted rounded px-1 font-mono text-[11px]">VITE_GEMINI_API_KEY</code>{' '}
              to your <code className="bg-muted rounded px-1 font-mono text-[11px]">.env</code> and reload.
            </AlertDescription>
          </Alert>
        ) : null}

        {messages.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-8">
            {}
            <div className="relative">
              <div className="from-primary/20 to-primary/5 absolute -inset-3 animate-pulse rounded-full bg-linear-to-br blur-xl" />
              <div className="from-primary/15 to-primary/5 relative flex size-16 items-center justify-center rounded-full bg-linear-to-br border shadow-sm">
                <Sparkles className="text-primary size-7" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold">Ask about your health data</p>
              <p className="text-muted-foreground mt-1 max-w-56 text-xs leading-relaxed">
                Answers are grounded in the same data the dashboard is built on.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessageItem key={message.id} message={message} onRetry={retry} onFollowUp={ask} />
          ))
        )}

        {}
        {messages.length === 0 && isConfigured ? (
          <div className="flex flex-col gap-3">
            <p className="text-muted-foreground text-center text-[11px] uppercase tracking-wider">
              Try asking
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  id={`suggested-${question.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}`}
                  type="button"
                  onClick={() => ask(question)}
                  className="border-border/60 hover:border-primary/40 hover:bg-primary/5 hover:text-primary group flex min-h-10 items-center gap-1.5 rounded-full border bg-transparent px-3.5 py-2 text-xs transition-all duration-200"
                >
                  <Sparkles className="group-hover:text-primary text-muted-foreground size-3 shrink-0 transition-colors" />
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {}
      <div className="shrink-0 border-t px-4 py-3">
        <ChatComposer
          isPending={isPending}
          disabled={!isConfigured || !hasContext}
          onSubmit={ask}
          onCancel={cancel}
        />

        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-[11px]">{ASSISTANT_DISCLAIMER}</p>
          {messages.length > 0 ? (
            <Button
              id="new-chat-btn"
              variant="ghost"
              size="sm"
              className="hover:bg-destructive/10 hover:text-destructive h-7 gap-1.5 rounded-full text-xs transition-colors"
              onClick={handleNewChat}
            >
              <MessageSquarePlus className="size-3.5" />
              New chat
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
