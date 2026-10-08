import { Dices } from 'lucide-react'
import { formatXp } from '../../lib/format'
import { DICE, DICE_LIMITS } from '../../lib/xp/constants'
import { DICE_COSTS } from '../../lib/xp/tiers'
import type {
  DiceId,
  ProgressionResult,
  TrackedField,
  TrackedValue,
} from '../../lib/xp/types'
import { Badge } from '../ui/Badge'
import { SectionCard } from '../layout/SectionCard'
import { CompactProgressionCard } from './CompactProgressionCard'
import { DICE_ICONS } from './icons'

interface DiceSectionProps {
  values: Record<DiceId, TrackedValue>
  results: Record<DiceId, ProgressionResult>
  totalXp: number
  onChange: (id: DiceId, field: TrackedField, value: number) => void
}

export function DiceSection({
  values,
  results,
  totalXp,
  onChange,
}: DiceSectionProps) {
  return (
    <SectionCard
      id="dados"
      title="Dados"
      description="Custo fixo por dado adicional, sem faixas de progressão"
      icon={Dices}
      tone="rose"
      totalXp={totalXp}
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {DICE.map((die) => (
          <CompactProgressionCard
            key={die.id}
            title={die.name}
            short={die.short}
            icon={DICE_ICONS[die.id]}
            tone="rose"
            limits={DICE_LIMITS}
            value={values[die.id]}
            result={results[die.id]}
            badge={<Badge tone="slate">{formatXp(DICE_COSTS[die.id])} XP/dado</Badge>}
            onCurrentChange={(next) => onChange(die.id, 'current', next)}
            onTargetChange={(next) => onChange(die.id, 'target', next)}
          />
        ))}
      </div>
    </SectionCard>
  )
}
