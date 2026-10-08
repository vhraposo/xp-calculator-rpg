import { clampNumber, sanitizeInteger } from '../numbers'
import {
  ATTRIBUTE_LIMITS,
  ATTRIBUTES,
  DICE,
  DICE_LIMITS,
  SKILL_LIMITS,
  SKILLS,
  SPHERE_LIMITS,
  SPHERES,
  STATUS_LIMITS,
  STATUSES,
} from './constants'
import {
  ATTRIBUTE_TIERS,
  DICE_TIERS,
  SKILL_TIERS,
  SPHERE_TIERS,
  STATUS_TIERS,
} from './tiers'
import type {
  CalculatorResults,
  CalculatorState,
  CategoryXp,
  DiceId,
  EnergyGain,
  EnergyRule,
  ProgressionLimits,
  ProgressionResult,
  SphereId,
  TierBreakdownEntry,
  TrackedValue,
  XpTier,
} from './types'

export function findTierAtLevel(
  tiers: readonly XpTier[],
  level: number,
): XpTier | null {
  for (const tier of tiers) {
    if (level >= tier.min && (tier.max === null || level <= tier.max)) {
      return tier
    }
  }
  return null
}

function formatLevelRange(firstLevel: number, lastLevel: number): string {
  return firstLevel === lastLevel ? `${firstLevel}` : `${firstLevel}–${lastLevel}`
}

export function calculateProgressionCost(
  currentValue: number,
  targetValue: number,
  tiers: readonly XpTier[],
  limits?: Partial<ProgressionLimits>,
): ProgressionResult {
  const min = limits?.min ?? 0
  const max = limits?.max ?? null
  const current = clampNumber(currentValue, min, max)
  const target = clampNumber(targetValue, min, max)

  if (target < current) {
    return {
      current,
      target,
      units: 0,
      totalXp: 0,
      status: 'reduction',
      breakdown: [],
    }
  }

  if (target === current) {
    return {
      current,
      target,
      units: 0,
      totalXp: 0,
      status: 'equal',
      breakdown: [],
    }
  }

  interface TierAccumulator {
    firstLevel: number
    lastLevel: number
    units: number
    costPerUnit: number
    total: number
  }

  const accumulators = new Map<XpTier, TierAccumulator>()
  let totalXp = 0

  // Cada nível comprado é cobrado pela faixa em que se encontra; o nível inicial nunca é cobrado.
  for (let level = current + 1; level <= target; level += 1) {
    const tier = findTierAtLevel(tiers, level)
    if (tier === null) {
      continue
    }

    totalXp += tier.costPerUnit
    const accumulator = accumulators.get(tier)
    if (accumulator) {
      accumulator.lastLevel = level
      accumulator.units += 1
      accumulator.total += tier.costPerUnit
    } else {
      accumulators.set(tier, {
        firstLevel: level,
        lastLevel: level,
        units: 1,
        costPerUnit: tier.costPerUnit,
        total: tier.costPerUnit,
      })
    }
  }

  const breakdown: TierBreakdownEntry[] = [...accumulators.values()].map(
    (accumulator) => ({
      range: formatLevelRange(accumulator.firstLevel, accumulator.lastLevel),
      units: accumulator.units,
      costPerUnit: accumulator.costPerUnit,
      total: accumulator.total,
    }),
  )

  return {
    current,
    target,
    units: target - current,
    totalXp,
    status: 'increase',
    breakdown,
  }
}

export function calculateEnergyGain(
  units: number,
  rule: EnergyRule,
): EnergyGain {
  const safeUnits = Math.max(0, sanitizeInteger(units))
  return {
    mystical: safeUnits * rule.mysticalPerUnit,
    physical: safeUnits * rule.physicalPerUnit,
  }
}

interface Identified<K extends string> {
  readonly id: K
}

function mapProgression<K extends string>(
  definitions: readonly Identified<K>[],
  values: Record<K, TrackedValue>,
  tiers: readonly XpTier[],
  limits: ProgressionLimits,
): Record<K, ProgressionResult> {
  const results = {} as Record<K, ProgressionResult>
  for (const definition of definitions) {
    const value = values[definition.id]
    results[definition.id] = calculateProgressionCost(
      value.current,
      value.target,
      tiers,
      limits,
    )
  }
  return results
}

function sumXp(results: readonly ProgressionResult[]): number {
  return results.reduce((total, result) => total + result.totalXp, 0)
}

export function computeCalculator(state: CalculatorState): CalculatorResults {
  const attributes = mapProgression(
    ATTRIBUTES,
    state.attributes,
    ATTRIBUTE_TIERS,
    ATTRIBUTE_LIMITS,
  )
  const spheres = mapProgression(
    SPHERES,
    state.spheres,
    SPHERE_TIERS,
    SPHERE_LIMITS,
  )
  const statuses = mapProgression(
    STATUSES,
    state.statuses,
    STATUS_TIERS,
    STATUS_LIMITS,
  )
  const skills = mapProgression(SKILLS, state.skills, SKILL_TIERS, SKILL_LIMITS)

  const dice = {} as Record<DiceId, ProgressionResult>
  for (const die of DICE) {
    const value = state.dice[die.id]
    dice[die.id] = calculateProgressionCost(
      value.current,
      value.target,
      DICE_TIERS[die.id],
      DICE_LIMITS,
    )
  }

  const sphereEnergy = {} as Record<SphereId, EnergyGain>
  let mysticalEnergy = 0
  let physicalEnergy = 0
  for (const sphere of SPHERES) {
    const gain = calculateEnergyGain(spheres[sphere.id].units, sphere.energy)
    sphereEnergy[sphere.id] = gain
    mysticalEnergy += gain.mystical
    physicalEnergy += gain.physical
  }

  const byCategory: CategoryXp = {
    attributes: sumXp(Object.values(attributes)),
    spheres: sumXp(Object.values(spheres)),
    statuses: sumXp(Object.values(statuses)),
    skills: sumXp(Object.values(skills)),
    dice: sumXp(Object.values(dice)),
  }

  const totalXp =
    byCategory.attributes +
    byCategory.spheres +
    byCategory.statuses +
    byCategory.skills +
    byCategory.dice

  return {
    attributes,
    spheres,
    statuses,
    skills,
    dice,
    sphereEnergy,
    energy: { mystical: mysticalEnergy, physical: physicalEnergy },
    byCategory,
    totalXp,
  }
}
