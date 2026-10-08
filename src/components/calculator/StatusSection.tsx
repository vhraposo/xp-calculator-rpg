import { Shield } from 'lucide-react'
import { STATUS_LIMITS, STATUSES } from '../../lib/xp/constants'
import { STATUS_TIERS, tierCostBounds } from '../../lib/xp/tiers'
import type {
  ProgressionResult,
  StatusId,
  TrackedField,
  TrackedValue,
} from '../../lib/xp/types'
import { SectionCard } from '../layout/SectionCard'
import { CompactProgressionCard } from './CompactProgressionCard'
import { STATUS_ICONS } from './icons'

interface StatusSectionProps {
  values: Record<StatusId, TrackedValue>
  results: Record<StatusId, ProgressionResult>
  totalXp: number
  onChange: (id: StatusId, field: TrackedField, value: number) => void
}

export function StatusSection({
  values,
  results,
  totalXp,
  onChange,
}: StatusSectionProps) {
  const costs = tierCostBounds(STATUS_TIERS)

  return (
    <SectionCard
      id="status"
      title="Status"
      description={`${costs.min} a ${costs.max} XP por nível · máximo ${STATUS_LIMITS.max}`}
      icon={Shield}
      tone="emerald"
      totalXp={totalXp}
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {STATUSES.map((status) => (
          <CompactProgressionCard
            key={status.id}
            title={status.name}
            short={status.short}
            icon={STATUS_ICONS[status.id]}
            tone="emerald"
            limits={STATUS_LIMITS}
            value={values[status.id]}
            result={results[status.id]}
            onCurrentChange={(next) => onChange(status.id, 'current', next)}
            onTargetChange={(next) => onChange(status.id, 'target', next)}
          />
        ))}
      </div>
    </SectionCard>
  )
}
