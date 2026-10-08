import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type {
  ProgressionLimits,
  ProgressionResult,
  TrackedValue,
} from '../../lib/xp/types'
import type { Tone } from '../ui/Badge'
import { IconTile } from '../ui/IconTile'
import { NumberStepper } from '../ui/NumberStepper'
import { ProgressionResult as ProgressionResultView } from './ProgressionResult'
import { TierBreakdown } from './TierBreakdown'

interface CompactProgressionCardProps {
  title: string
  short: string
  icon: LucideIcon
  tone: Tone
  limits: ProgressionLimits
  value: TrackedValue
  result: ProgressionResult
  badge?: ReactNode
  onCurrentChange: (value: number) => void
  onTargetChange: (value: number) => void
}

export function CompactProgressionCard({
  title,
  short,
  icon,
  tone,
  limits,
  value,
  result,
  badge,
  onCurrentChange,
  onTargetChange,
}: CompactProgressionCardProps) {
  return (
    <article className="flex flex-col rounded-2xl border border-white/5 bg-slate-950/40 p-4 transition-colors hover:border-white/10">
      <header className="flex items-center gap-3">
        <IconTile icon={icon} tone={tone} />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm leading-snug font-semibold text-slate-100">{title}</h3>
          <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-slate-500 uppercase">
            {short}
          </p>
        </div>
        {badge}
      </header>

      <div className="mt-4 flex items-center gap-3">
        <NumberStepper
          label="Atual"
          context={title}
          value={value.current}
          onChange={onCurrentChange}
          min={limits.min}
          max={limits.max}
        />
        <NumberStepper
          label="Destino"
          context={title}
          value={value.target}
          onChange={onTargetChange}
          min={limits.min}
          max={limits.max}
        />
      </div>

      <div className="mt-4 border-t border-white/5 pt-3">
        <ProgressionResultView result={result} />
        <TierBreakdown breakdown={result.breakdown} />
      </div>
    </article>
  )
}
