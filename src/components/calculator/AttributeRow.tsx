import { ArrowRight } from 'lucide-react'
import { ATTRIBUTE_LIMITS } from '../../lib/xp/constants'
import type {
  Attribute,
  AttributeId,
  ProgressionResult,
  TrackedField,
  TrackedValue,
} from '../../lib/xp/types'
import { IconTile } from '../ui/IconTile'
import { NumberStepper } from '../ui/NumberStepper'
import { ProgressionResult as ProgressionResultView } from './ProgressionResult'
import { TierBreakdown } from './TierBreakdown'
import { ATTRIBUTE_ICONS } from './icons'

interface AttributeRowProps {
  attribute: Attribute
  value: TrackedValue
  result: ProgressionResult
  onChange: (id: AttributeId, field: TrackedField, value: number) => void
}

export function AttributeRow({
  attribute,
  value,
  result,
  onChange,
}: AttributeRowProps) {
  const Icon = ATTRIBUTE_ICONS[attribute.id]

  return (
    <li className="rounded-2xl border border-white/5 bg-slate-950/40 p-4 transition-colors hover:border-violet-400/25">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 lg:w-44">
          <IconTile icon={Icon} tone="violet" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-100">
              {attribute.name}
            </p>
            <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-slate-500">
              {attribute.short}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <NumberStepper
            label="Atual"
            context={attribute.name}
            value={value.current}
            onChange={(next) => onChange(attribute.id, 'current', next)}
            min={ATTRIBUTE_LIMITS.min}
            max={ATTRIBUTE_LIMITS.max}
          />
          <ArrowRight
            className="mt-5 size-4 shrink-0 text-slate-600"
            aria-hidden="true"
          />
          <NumberStepper
            label="Destino"
            context={attribute.name}
            value={value.target}
            onChange={(next) => onChange(attribute.id, 'target', next)}
            min={ATTRIBUTE_LIMITS.min}
            max={ATTRIBUTE_LIMITS.max}
          />
        </div>

        <div className="lg:w-64">
          <ProgressionResultView result={result} align="end" />
          <TierBreakdown breakdown={result.breakdown} align="end" />
        </div>
      </div>
    </li>
  )
}
