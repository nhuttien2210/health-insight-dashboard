import type { ReactNode } from 'react'
import { DASHBOARD_SECTIONS, type DashboardSectionId } from '../constants/sections'
import { SectionHeading } from './SectionHeading'

const SECTION_BY_ID = Object.fromEntries(
  DASHBOARD_SECTIONS.map((section) => [section.id, section]),
) as Record<DashboardSectionId, (typeof DASHBOARD_SECTIONS)[number]>

type DashboardSectionProps = {
  id: DashboardSectionId
  children: ReactNode
}

export function DashboardSection({ id, children }: DashboardSectionProps) {
  const section = SECTION_BY_ID[id]
  const headingId = `${section.id}-heading`

  return (
    <section id={section.id} aria-labelledby={headingId} className="animate-fade-in-up scroll-mt-28 space-y-3 sm:scroll-mt-32">
      <SectionHeading
        id={headingId}
        title={section.title}
        description={section.description}
        icon={section.icon}
      />
      {children}
    </section>
  )
}
