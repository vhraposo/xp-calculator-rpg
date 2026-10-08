import { Target } from 'lucide-react'
import { SKILL_LIMITS, SKILLS } from '../../lib/xp/constants'
import { SKILL_TIERS, tierCostBounds } from '../../lib/xp/tiers'
import type {
  ProgressionResult,
  SkillId,
  TrackedField,
  TrackedValue,
} from '../../lib/xp/types'
import { SectionCard } from '../layout/SectionCard'
import { CompactProgressionCard } from './CompactProgressionCard'

interface SkillSectionProps {
  values: Record<SkillId, TrackedValue>
  results: Record<SkillId, ProgressionResult>
  totalXp: number
  onChange: (id: SkillId, field: TrackedField, value: number) => void
}

export function SkillSection({
  values,
  results,
  totalXp,
  onChange,
}: SkillSectionProps) {
  const costs = tierCostBounds(SKILL_TIERS)

  return (
    <SectionCard
      id="pericias"
      title="Pontos em Perícia"
      description={`${costs.min} a ${costs.max} XP por ponto · máximo ${SKILL_LIMITS.max}`}
      icon={Target}
      tone="amber"
      totalXp={totalXp}
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {SKILLS.map((skill) => (
          <CompactProgressionCard
            key={skill.id}
            title={skill.name}
            short={skill.short}
            icon={Target}
            tone="amber"
            limits={SKILL_LIMITS}
            value={values[skill.id]}
            result={results[skill.id]}
            onCurrentChange={(next) => onChange(skill.id, 'current', next)}
            onTargetChange={(next) => onChange(skill.id, 'target', next)}
          />
        ))}
      </div>
    </SectionCard>
  )
}
