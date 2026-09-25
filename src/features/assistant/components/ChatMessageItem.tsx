import { AlertTriangle, RefreshCw, Sparkles } from 'lucide-react'
import type { ChatMessage } from '@/apis/assistant/assistant.type'
import type { Sentiment } from '@/types/metric'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/libs/cn'

const SENTIMENT_CLASS: Record<Sentiment, string> = {
  positive: 'border-emerald-500/30 text-emerald-600 bg-emerald-500/8 dark:text-emerald-400',
  neutral: 'border-border text-muted-foreground',
  attention: 'border-amber-500/40 text-amber-600 bg-amber-500/8 dark:text-amber-400',
}

type ChatMessageItemProps = {
  message: ChatMessage
  onRetry: (id: string) => void
  onFollowUp: (question: string) => void
}

function TypingDots() {
  return (
    <span className="flex items-end gap-0.75" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="bg-primary/60 size-1.5 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
        />
      ))}
    </span>
  )
}

export function ChatMessageItem({ message, onRetry, onFollowUp }: ChatMessageItemProps) {

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <p className="from-primary to-primary/80 text-primary-foreground max-w-[85%] rounded-2xl rounded-br-sm bg-linear-to-br px-3.5 py-2.5 text-sm leading-relaxed shadow-sm">
          {message.content}
        </p>
      </div>
    )
  }

  if (message.status === 'pending') {
    return (
      <div
        className="flex items-center gap-2.5"
        aria-live="polite"
        aria-label="Assistant is thinking"
      >
        <span className="from-primary/20 to-primary/10 flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br">
          <Sparkles className="text-primary size-3.5 animate-pulse" aria-hidden />
        </span>
        <div className="bg-muted/70 flex items-center gap-2 rounded-2xl rounded-bl-sm px-3.5 py-2.5">
          <TypingDots />
          <span className="text-muted-foreground text-xs">Analysing your data…</span>
        </div>
      </div>
    )
  }

  if (message.status === 'error') {
    return (
      <div className="flex gap-2.5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="text-destructive size-3.5" aria-hidden />
        </span>
        <div className="border-destructive/20 bg-destructive/5 flex-1 space-y-2 rounded-2xl rounded-bl-sm border p-3">
          <p className="text-destructive text-sm">{message.content}</p>
          <Button
            variant="outline"
            size="sm"
            className="border-destructive/30 text-destructive hover:bg-destructive/10 h-7 gap-1.5 rounded-full text-xs"
            onClick={() => onRetry(message.id)}
          >
            <RefreshCw className="size-3" />
            Try again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2.5">
      {}
      <span className="from-primary/20 to-primary/10 mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br">
        <Sparkles className="text-primary size-3.5" aria-hidden />
      </span>

      <div className="bg-muted/50 min-w-0 flex-1 space-y-3 rounded-2xl rounded-bl-sm border border-transparent p-3.5">
        {}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

        {}
        {message.reply && message.reply.highlights.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {message.reply.highlights.map((highlight) => (
              <Badge
                key={`${highlight.label}-${highlight.value}`}
                variant="outline"
                className={cn('rounded-full text-[11px]', SENTIMENT_CLASS[highlight.sentiment])}
              >
                {highlight.label}: <span className="ml-1 font-semibold">{highlight.value}</span>
              </Badge>
            ))}
          </div>
        ) : null}

        {}
        {message.reply && message.reply.suggestions.length > 0 ? (
          <ul className="border-border/50 space-y-1.5 border-l-2 pl-3">
            {message.reply.suggestions.map((suggestion) => (
              <li key={suggestion} className="text-muted-foreground text-xs leading-relaxed">
                {suggestion}
              </li>
            ))}
          </ul>
        ) : null}

        {}
        {message.reply && message.reply.followUpQuestions.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {message.reply.followUpQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => onFollowUp(question)}
                className="border-border/60 hover:border-primary/40 hover:bg-primary/5 hover:text-primary rounded-full border px-2.5 py-1 text-[11px] transition-all duration-150"
              >
                {question}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
