import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowUp, Loader2, StopCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ChatComposerProps = {
  isPending: boolean
  disabled: boolean
  onSubmit: (question: string) => void
  onCancel: () => void
}

export function ChatComposer({ isPending, disabled, onSubmit, onCancel }: ChatComposerProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function send() {
    if (value.trim().length === 0 || isPending || disabled) return
    onSubmit(value)
    setValue('')

    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    send()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  function handleInput() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }

  const canSend = value.trim().length > 0 && !isPending && !disabled

  return (
    <form
      onSubmit={handleSubmit}
      className={[
        'ring-border/60 focus-within:ring-primary/50 relative flex items-end gap-2 rounded-xl border',
        'bg-muted/40 px-3 py-2 ring-1 transition-all duration-200 focus-within:ring-2',
        disabled ? 'opacity-50' : '',
      ].join(' ')}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        disabled={disabled}
        rows={1}
        placeholder={
          disabled
            ? 'Waiting for dashboard data…'
            : 'Ask about steps, sleep, nutrition or goals…'
        }
        aria-label="Ask the health assistant"
        className="flex-1 resize-none bg-transparent py-0.5 text-sm outline-none placeholder:text-muted-foreground/60 disabled:cursor-not-allowed"
        style={{ minHeight: '24px', maxHeight: '120px' }}
      />

      {isPending ? (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-destructive hover:bg-destructive/10 size-8 shrink-0 rounded-full"
          onClick={onCancel}
          aria-label="Stop generation"
        >
          <StopCircle className="size-4" />
        </Button>
      ) : (
        <Button
          type="submit"
          size="icon"
          disabled={!canSend}
          className={[
            'size-8 shrink-0 rounded-full transition-all duration-200',
            canSend
              ? 'from-primary to-primary/80 bg-linear-to-br shadow-sm'
              : 'bg-muted-foreground/20',
          ].join(' ')}
          aria-label="Send message"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowUp className={['size-4', canSend ? 'text-primary-foreground' : 'text-muted-foreground'].join(' ')} />
          )}
        </Button>
      )}
    </form>
  )
}
