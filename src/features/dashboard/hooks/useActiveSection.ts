import { useCallback, useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import {
  DASHBOARD_SECTION_IDS,
  DASHBOARD_SECTIONS,
  isDashboardSectionId,
  type DashboardSectionId,
} from '../constants/sections'

export function useActiveSection() {
  const reduceMotion = usePrefersReducedMotion()
  const [activeId, setActiveId] = useState<DashboardSectionId>(DASHBOARD_SECTIONS[0].id)
  const lockedUntilRef = useRef(0)

  const selectSection = useCallback(
    (id: DashboardSectionId) => {
      lockedUntilRef.current = Date.now() + 900
      setActiveId(id)

      const element = document.getElementById(id)
      element?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    },
    [reduceMotion],
  )

  useEffect(() => {
    const elements = DASHBOARD_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    )
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < lockedUntilRef.current) return

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        const nextId = visible[0]?.target.id
        if (nextId && isDashboardSectionId(nextId)) setActiveId(nextId)
      },
      {

        rootMargin: '-30% 0px -55% 0px',
        threshold: [0, 0.25, 0.5],
      },
    )

    for (const element of elements) observer.observe(element)

    function activateLastSectionNearBottom() {
      if (Date.now() < lockedUntilRef.current) return
      const remaining =
        document.documentElement.scrollHeight - window.scrollY - window.innerHeight
      if (remaining < 80) {
        setActiveId(DASHBOARD_SECTION_IDS[DASHBOARD_SECTION_IDS.length - 1])
      }
    }

    window.addEventListener('scroll', activateLastSectionNearBottom, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', activateLastSectionNearBottom)
    }
  }, [])

  return { activeId, selectSection }
}
