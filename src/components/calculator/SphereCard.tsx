import { Flame, Zap } from 'lucide-react'
import { formatSigned } from '../../lib/format'
import { SPHERE_LIMITS } from '../../lib/xp/constants'
import type {
  EnergyGain,
  ProgressionResult,
  Sphere,
  TrackedValue,
} from '../../lib/xp/types'
import { Badge } from '../ui/Badge'
import { NumberStepper } from '../ui/NumberStepper'
import { ProgressionResult as ProgressionResultView } from './ProgressionResult'
import { TierBreakdown } from './TierBreakdown'

interface SphereCardProps {
  sphere: Sphere
  value: TrackedValue
  result: ProgressionResult
  energy: EnergyGain
  onCurrentChange: (value: number) => void
  onTargetChange: (value: number) => void
}

export function SphereCard({
  sphere,
  value,
  result,
  energy,
  onCurrentChange,
  onTargetChange,
}: SphereCardProps) {
  const { mysticalPerUnit, physicalPerUnit } = sphere.energy

  return (
    <article className="flex flex-col rounded-2xl border border-white/5 bg-slate-950/40 p-4 transition-colors hover:border-cyan-400/25">
      <header className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-cyan-400/25 bg-gradient-to-br from-cyan-500/20 to-violet-500/10 text-[0.7rem] font-bold tracking-wider text-cyan-200">
          {sphere.short}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold tracking-wide text-slate-100">
            {sphere.name}
          </h3>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <Badge tone={mysticalPerUnit > 0 ? 'cyan' : 'slate'}>
              <Zap className="size-3" aria-hidden="true" />
              Mística +{mysticalPerUnit}
            </Badge>
            <Badge tone={physicalPerUnit > 0 ? 'orange' : 'slate'}>
              <Flame className="size-3" aria-hidden="true" />
              Física +{physicalPerUnit}
            </Badge>
          </div>
        </div>
      </header>

      <div className="mt-4 flex items-center gap-3">
        <NumberStepper
          label="Atual"
          context={sphere.name}
          value={value.current}
          onChange={onCurrentChange}
          min={SPHERE_LIMITS.min}
          max={SPHERE_LIMITS.max}
        />
        <NumberStepper
          label="Destino"
          context={sphere.name}
          value={value.target}
          onChange={onTargetChange}
          min={SPHERE_LIMITS.min}
          max={SPHERE_LIMITS.max}
        />
      </div>

      <div className="mt-4 border-t border-white/5 pt-3">
        <ProgressionResultView result={result} />
        <TierBreakdown breakdown={result.breakdown} />
      </div>

      <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
        {result.status === 'increase' ? (
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-xs text-cyan-300">
              <Zap className="size-3.5" aria-hidden="true" />
              Mística ganha: <strong className="font-bold">{formatSigned(energy.mystical)}</strong>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-orange-300">
              <Flame className="size-3.5" aria-hidden="true" />
              Física ganha: <strong className="font-bold">{formatSigned(energy.physical)}</strong>
            </span>
          </div>
        ) : (
          <p className="text-center text-xs text-slate-500">
            Nenhuma energia adquirida nesta evolução
          </p>
        )}
      </div>
    </article>
  )
}
