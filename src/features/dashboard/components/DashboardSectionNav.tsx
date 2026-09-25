import { cn } from '@/libs/cn'
import { DASHBOARD_SECTIONS } from '../constants/sections'
import { useActiveSection } from '../hooks/useActiveSection'
import { RangeFilter } from './RangeFilter'

export function DashboardSectionNav() {
  const { activeId, selectSection } = useActiveSection()

  return (
    <div className="sticky top-14 z-30 -mx-4 mt-4 border-b border-border/40 bg-background/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-360 items-stretch">

        {}
        <nav
          aria-label="Dashboard sections"
          className="scrollbar-none min-w-0 flex-1 overflow-x-auto"
        >
          <ul className="flex h-full min-w-max">
            {DASHBOARD_SECTIONS.map((section) => {
              const isActive = section.id === activeId
              const Icon = section.icon

              return (
                <li key={section.id} className="flex">
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? 'location' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      selectSection(section.id)
                    }}
                    className={cn(
                      'relative flex items-center gap-1.5 whitespace-nowrap px-3 py-3 font-medium transition-colors duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50 rounded-sm',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40',
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-4 shrink-0 transition-colors',
                        isActive ? 'text-primary' : 'text-muted-foreground',
                      )}
                      aria-hidden
                    />
                    {}
                    <span className="hidden text-sm sm:inline">{section.title}</span>
                    <span className="text-xs sm:hidden">{section.shortTitle}</span>

                    {}
                    <span
                      className={cn(
                        'absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-primary transition-opacity duration-150',
                        isActive ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        {}
        <div className="flex shrink-0 items-center border-l px-2 sm:px-3">
          <RangeFilter />
        </div>

      </div>
    </div>
  )
}
