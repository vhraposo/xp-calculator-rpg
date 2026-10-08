import { Swords } from 'lucide-react'
import { ATTRIBUTE_LIMITS, ATTRIBUTES } from '../../lib/xp/constants'
import type {
  AttributeId,
  ProgressionResult,
  TrackedField,
  TrackedValue,
} from '../../lib/xp/types'
import { SectionCard } from '../layout/SectionCard'
import { AttributeRow } from './AttributeRow'

interface AttributeSectionProps {
  values: Record<AttributeId, TrackedValue>
  results: Record<AttributeId, ProgressionResult>
  totalXp: number
  onChange: (id: AttributeId, field: TrackedField, value: number) => void
}

export function AttributeSection({
  values,
  results,
  totalXp,
  onChange,
}: AttributeSectionProps) {
  return (
    <SectionCard
      id="atributos"
      title="Atributos"
      description={`Evolução por faixas de custo · máximo ${ATTRIBUTE_LIMITS.max}`}
      icon={Swords}
      tone="violet"
      totalXp={totalXp}
    >
      <ul className="space-y-3">
        {ATTRIBUTES.map((attribute) => (
          <AttributeRow
            key={attribute.id}
            attribute={attribute}
            value={values[attribute.id]}
            result={results[attribute.id]}
            onChange={onChange}
          />
        ))}
      </ul>
    </SectionCard>
  )
}
