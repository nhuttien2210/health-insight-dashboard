import { Apple, Check, Dumbbell, Footprints, Moon, TrendingDown } from 'lucide-react'
import type { GoalType } from '@/apis/health/health.type'
import { GOAL_LABEL, GOAL_VALUES, PROFILE_LIMITS } from '@/constants/health'
import { cn } from '@/libs/cn'

const GOAL_ICON = {
  lose_weight: TrendingDown,
  build_muscle: Dumbbell,
  improve_sleep: Moon,
  increase_activity: Footprints,
  eat_better: Apple,
} as const

type GoalSelectorProps = {
  value: GoalType[]
  onChange: (goals: GoalType[]) => void
}

export function GoalSelector({ value, onChange }: GoalSelectorProps) {
  const atLimit = value.length >= PROFILE_LIMITS.goals.max

  function toggle(goal: GoalType) {
    onChange(value.includes(goal) ? value.filter((item) => item !== goal) : [...value, goal])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {GOAL_VALUES.map((goal) => {
        const Icon = GOAL_ICON[goal]
        const selected = value.includes(goal)
        const disabled = !selected && atLimit

        return (
          <button
            key={goal}
            type="button"
            onClick={() => toggle(goal)}
            disabled={disabled}
            aria-pressed={selected}
            className={cn(
              'flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors',
              'focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none',
              selected
                ? 'border-primary bg-primary/10 text-primary font-medium'
                : 'border-border hover:bg-accent',
              disabled && 'cursor-not-allowed opacity-45 hover:bg-transparent',
            )}
          >
            {selected ? (
              <Check className="size-4" aria-hidden />
            ) : (
              <Icon className="size-4" aria-hidden />
            )}
            {GOAL_LABEL[goal]}
          </button>
        )
      })}
    </div>
  )
}
