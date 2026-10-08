import { formatXp } from '../../lib/format'
import type { TierBreakdownEntry } from '../../lib/xp/types'

interface TierBreakdownProps {
  breakdown: readonly TierBreakdownEntry[]
  align?: 'start' | 'end'
  className?: string
}

export function TierBreakdown({
  breakdown,
  align = 'start',
  className,
}: TierBreakdownProps) {
  if (breakdown.length === 0) {
    return null
  }

  return (
    <ul
      className={`mt-1.5 flex flex-wrap gap-1.5 ${align === 'end' ? 'lg:justify-end' : ''} ${className ?? ''}`}
    >
      {breakdown.map((entry) => (
        <li
          key={entry.range}
          title={`${entry.units} × ${entry.costPerUnit} XP por unidade`}
          className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[0.7rem] text-slate-400 tabular-nums"
        >
          <span className="text-slate-300">{entry.range}</span>: {formatXp(entry.total)} XP
        </li>
      ))}
    </ul>
  )
}
