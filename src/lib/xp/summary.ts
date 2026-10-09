import { formatAcquired, formatXp } from '../format'
import { ATTRIBUTES, DICE, SKILLS, SPHERES, STATUSES } from './constants'
import type {
  CalculatorResults,
  EnergyGain,
  ProgressionResult,
} from './types'

export interface DistributionSummaryItem {
  readonly id: string
  readonly name: string
  readonly short: string
  readonly current: number
  readonly target: number
  readonly units: number
  readonly xp: number
  readonly energy: EnergyGain | null
}

export interface DistributionSummaryCategory {
  readonly id: string
  readonly title: string
  readonly items: readonly DistributionSummaryItem[]
  readonly totalXp: number
}

export interface DistributionSummary {
  readonly categories: readonly DistributionSummaryCategory[]
  readonly totalXp: number
  readonly totalUnits: number
  readonly energy: EnergyGain
}

interface SummaryDefinition {
  readonly id: string
  readonly name: string
  readonly short: string
}

function buildItem(
  definition: SummaryDefinition,
  result: ProgressionResult,
  energy: EnergyGain | null = null,
): DistributionSummaryItem {
  return {
    id: definition.id,
    name: definition.name,
    short: definition.short,
    current: result.current,
    target: result.target,
    units: result.units,
    xp: result.totalXp,
    energy,
  }
}

export function formatAcquiredPoints(units: number): string {
  return `${formatAcquired(units)} ${units === 1 ? 'ponto' : 'pontos'}`
}

export function buildDistributionSummary(
  results: CalculatorResults,
): DistributionSummary {
  const categories: DistributionSummaryCategory[] = [
    {
      id: 'attributes',
      title: 'Atributos',
      totalXp: results.byCategory.attributes,
      items: ATTRIBUTES.map((attribute) =>
        buildItem(attribute, results.attributes[attribute.id]),
      ),
    },
    {
      id: 'spheres',
      title: 'Esferas',
      totalXp: results.byCategory.spheres,
      items: SPHERES.map((sphere) =>
        buildItem(
          sphere,
          results.spheres[sphere.id],
          results.sphereEnergy[sphere.id],
        ),
      ),
    },
    {
      id: 'statuses',
      title: 'Status',
      totalXp: results.byCategory.statuses,
      items: STATUSES.map((status) =>
        buildItem(status, results.statuses[status.id]),
      ),
    },
    {
      id: 'skills',
      title: 'Pontos em Perícia',
      totalXp: results.byCategory.skills,
      items: SKILLS.map((skill) => buildItem(skill, results.skills[skill.id])),
    },
    {
      id: 'dice',
      title: 'Dados',
      totalXp: results.byCategory.dice,
      items: DICE.map((die) => buildItem(die, results.dice[die.id])),
    },
  ]

  const totalUnits = categories.reduce(
    (sum, category) =>
      sum + category.items.reduce((itemSum, item) => itemSum + item.units, 0),
    0,
  )

  return {
    categories,
    totalXp: results.totalXp,
    totalUnits,
    energy: results.energy,
  }
}

export function formatDistributionSummary(summary: DistributionSummary): string {
  const lines: string[] = ['DISTRIBUIÇÃO DE XP', '']

  for (const category of summary.categories) {
    lines.push(category.title.toUpperCase())
    for (const item of category.items) {
      lines.push(
        `${item.name} (${item.short}): ${item.current} → ${item.target} | ${formatAcquiredPoints(item.units)} | ${formatXp(item.xp)} XP`,
      )
      if (item.energy && (item.energy.mystical > 0 || item.energy.physical > 0)) {
        lines.push(
          `Energia Mística adquirida: ${formatAcquired(item.energy.mystical)}`,
        )
        lines.push(
          `Energia Física adquirida: ${formatAcquired(item.energy.physical)}`,
        )
      }
    }
    lines.push(`Subtotal: ${formatXp(category.totalXp)} XP`)
    lines.push('')
  }

  lines.push('RESUMO')
  lines.push(`XP total investido: ${formatXp(summary.totalXp)} XP`)
  lines.push(`Pontos adquiridos: ${formatXp(summary.totalUnits)}`)
  lines.push(
    `Energia Mística total adquirida: ${formatAcquired(summary.energy.mystical)}`,
  )
  lines.push(
    `Energia Física total adquirida: ${formatAcquired(summary.energy.physical)}`,
  )

  return lines.join('\n')
}
