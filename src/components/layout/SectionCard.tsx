import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { formatXp } from '../../lib/format'
import type { Tone } from '../ui/Badge'
import { Badge } from '../ui/Badge'
import { IconTile } from '../ui/IconTile'

interface SectionCardProps {
  id: string
  title: string
  description?: string
  icon: LucideIcon
  tone?: Tone
  totalXp: number
  children: ReactNode
}

export function SectionCard({
  id,
  title,
  description,
  icon,
  tone = 'violet',
  totalXp,
  children,
}: SectionCardProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="rounded-3xl border border-white/5 bg-slate-900/50 p-4 backdrop-blur-sm sm:p-5"
    >
      <header className="flex items-center gap-3 border-b border-white/5 pb-4">
        <IconTile icon={icon} tone={tone} />
        <div className="min-w-0 flex-1">
          <h2
            id={`${id}-title`}
            className="text-sm font-bold tracking-[0.16em] text-white uppercase"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 text-xs text-slate-500">{description}</p>
          ) : null}
        </div>
        <Badge tone={totalXp > 0 ? 'emerald' : 'slate'}>
          {formatXp(totalXp)} XP
        </Badge>
      </header>
      <div className="pt-4">{children}</div>
    </section>
  )
}
