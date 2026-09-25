import { Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { AssistantPanel } from './components/AssistantPanel'
import { useAssistantStore } from './stores/useAssistantStore'

const TITLE = 'Health assistant'
const DESCRIPTION = 'Grounded in your dashboard data'

export function FloatingAssistant() {
  const isOpen = useAssistantStore((state) => state.isOpen)
  const open = useAssistantStore((state) => state.open)
  const close = useAssistantStore((state) => state.close)
  const isDesktop = useIsDesktop()

  if (!isOpen) {
    return (
      <Button
        onClick={() => open()}
        size="lg"
        className="fixed right-4 bottom-4 z-40 rounded-full shadow-lg"
      >
        <Sparkles />
        Ask about my health
      </Button>
    )
  }

  if (isDesktop) {
    return (
      <aside
        aria-label={TITLE}
        className="bg-background fixed right-4 bottom-4 z-40 flex h-[min(640px,80vh)] w-[380px] flex-col rounded-xl border shadow-xl"
      >
        <header className="flex items-start justify-between gap-2 border-b px-4 py-3">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="text-primary size-4" aria-hidden />
              {TITLE}
            </p>
            <p className="text-muted-foreground text-xs">{DESCRIPTION}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={close} aria-label="Close assistant">
            <X />
          </Button>
        </header>
        <AssistantPanel />
      </aside>
    )
  }

  return (
    <Sheet open onOpenChange={(next) => (next ? open() : close())}>
      <SheetContent side="bottom" className="h-[85vh] p-0">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="text-primary size-4" aria-hidden />
            {TITLE}
          </SheetTitle>
          <SheetDescription>{DESCRIPTION}</SheetDescription>
        </SheetHeader>
        <AssistantPanel />
      </SheetContent>
    </Sheet>
  )
}
