import { Orbit } from 'lucide-react'
import { SPHERES } from '../../lib/xp/constants'
import type {
  EnergyGain,
  ProgressionResult,
  SphereId,
  TrackedField,
  TrackedValue,
} from '../../lib/xp/types'
import { SectionCard } from '../layout/SectionCard'
import { SphereCard } from './SphereCard'

interface SphereSectionProps {
  values: Record<SphereId, TrackedValue>
  results: Record<SphereId, ProgressionResult>
  energy: Record<SphereId, EnergyGain>
  totalXp: number
  onChange: (id: SphereId, field: TrackedField, value: number) => void
}

export function SphereSection({
  values,
  results,
  energy,
  totalXp,
  onChange,
}: SphereSectionProps) {
  return (
    <SectionCard
      id="esferas"
      title="Esferas"
      description="Cada esfera evolui por faixas de custo, sem limite máximo de nível"
      icon={Orbit}
      tone="cyan"
      totalXp={totalXp}
    >
      <div className="grid gap-3 md:grid-cols-2">
        {SPHERES.map((sphere) => (
          <SphereCard
            key={sphere.id}
            sphere={sphere}
            value={values[sphere.id]}
            result={results[sphere.id]}
            energy={energy[sphere.id]}
            onCurrentChange={(next) => onChange(sphere.id, 'current', next)}
            onTargetChange={(next) => onChange(sphere.id, 'target', next)}
          />
        ))}
      </div>
    </SectionCard>
  )
}
