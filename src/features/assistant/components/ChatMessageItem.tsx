import { AlertTriangle, RefreshCw, Sparkles } from 'lucide-react'
import type { ChatMessage } from '@/apis/assistant/assistant.type'
import type { Sentiment } from '@/types/metric'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/libs/cn'

const SENTIMENT_CLASS: Record<Sentiment, string> = {
  positive: 'border-success/40 text-success bg-success/10',
  neutral: 'border-border text-muted-foreground',
  attention: 'border-warning/50 text-warning bg-warning/10',
}

type ChatMessageItemProps = {
  message: ChatMessage
  onRetry: (id: string) => void
  onFollowUp: (question: string) => void
}

export function ChatMessageItem({ message, onRetry, onFollowUp }: ChatMessageItemProps) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <p className="bg-primary text-primary-foreground max-w-[85%] rounded-2xl rounded-br-sm px-3 py-2 text-sm">
          {message.content}
        </p>
      </div>
    )
  }

  if (message.status === 'pending') {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm" aria-live="polite">
        <Sparkles className="size-4 animate-pulse" aria-hidden />
        Reading your data...
      </div>
    )
  }

  if (message.status === 'error') {
    return (
      <div className="border-destructive/30 bg-destructive/5 space-y-2 rounded-2xl rounded-bl-sm border p-3">
        <p className="text-destructive flex items-start gap-2 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {message.content}
        </p>
        <Button variant="outline" size="sm" onClick={() => onRetry(message.id)}>
          <RefreshCw className="size-3.5" />
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-muted/60 space-y-3 rounded-2xl rounded-bl-sm p-3">
      <p className="text-sm whitespace-pre-wrap">{message.content}</p>

      {message.reply && message.reply.highlights.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {message.reply.highlights.map((highlight) => (
            <Badge
              key={`${highlight.label}-${highlight.value}`}
              variant="outline"
              className={cn('text-[11px]', SENTIMENT_CLASS[highlight.sentiment])}
            >
              {highlight.label}: {highlight.value}
            </Badge>
          ))}
        </div>
      ) : null}

      {message.reply && message.reply.suggestions.length > 0 ? (
        <ul className="space-y-1">
          {message.reply.suggestions.map((suggestion) => (
            <li key={suggestion} className="text-muted-foreground flex gap-2 text-sm">
              <span aria-hidden>-</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {message.reply && message.reply.followUpQuestions.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {message.reply.followUpQuestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => onFollowUp(question)}
              className="border-border hover:bg-accent rounded-full border px-2.5 py-1 text-xs transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
