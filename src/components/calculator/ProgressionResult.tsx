import { TriangleAlert } from 'lucide-react'
import { formatXp } from '../../lib/format'
import type { ProgressionResult as ProgressionResultData } from '../../lib/xp/types'

interface ProgressionResultProps {
  result: ProgressionResultData
  align?: 'start' | 'end'
  className?: string
}

export function ProgressionResult({
  result,
  align = 'start',
  className,
}: ProgressionResultProps) {
  const alignment = align === 'end' ? 'text-left lg:text-right' : 'text-left'

  if (result.status === 'reduction') {
    return (
      <div className={`${alignment} ${className ?? ''}`}>
        <p className="flex items-center gap-1.5 text-sm font-medium text-amber-300 lg:justify-start">
          <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
          Redução de nível não disponível
        </p>
        <p className="mt-0.5 text-xs text-slate-400">
          XP: <span className="font-semibold">—</span>
        </p>
      </div>
    )
  }

  if (result.status === 'equal') {
    return (
      <div className={`${alignment} ${className ?? ''}`}>
        <p className="text-sm font-medium text-slate-400">Sem evolução</p>
        <p className="mt-0.5 text-xs text-slate-500">0 XP</p>
      </div>
    )
  }

  return (
    <div className={`${alignment} ${className ?? ''}`}>
      <p className="text-xs text-slate-400">
        {result.current} → {result.target}
        <span className="text-emerald-300/90">
          {' '}
          · {result.units} {result.units === 1 ? 'unidade' : 'unidades'}
        </span>
      </p>
      <p className="mt-0.5 text-lg font-bold text-emerald-400 tabular-nums">
        +{formatXp(result.totalXp)} XP
      </p>
    </div>
  )
}
