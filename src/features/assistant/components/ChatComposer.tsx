import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { Loader2, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type ChatComposerProps = {
  isPending: boolean
  disabled: boolean
  onSubmit: (question: string) => void
  onCancel: () => void
}

export function ChatComposer({ isPending, disabled, onSubmit, onCancel }: ChatComposerProps) {
  const [value, setValue] = useState('')

  function send() {
    if (value.trim().length === 0 || isPending || disabled) return
    onSubmit(value)
    setValue('')
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    send()
  }

  // Enter sends, Shift+Enter breaks the line - the convention people expect in a chat.
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <Textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        placeholder="Ask about your steps, sleep, nutrition or goals"
        aria-label="Ask the health assistant"
        className="max-h-28 min-h-9 resize-none"
      />
      {isPending ? (
        <Button type="button" variant="outline" size="icon" onClick={onCancel} aria-label="Stop">
          <X />
        </Button>
      ) : (
        <Button type="submit" size="icon" disabled={disabled || value.trim().length === 0} aria-label="Send">
          {isPending ? <Loader2 className="animate-spin" /> : <Send />}
        </Button>
      )}
    </form>
  )
}
