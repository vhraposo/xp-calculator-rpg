import type { DiceId, StatusLevel, XpTier } from './types'

export function tierCostBounds(tiers: readonly XpTier[]): {
  min: number
  max: number
} {
  const costs = tiers.map((tier) => tier.costPerUnit)
  return { min: Math.min(...costs), max: Math.max(...costs) }
}

export const ATTRIBUTE_TIERS: readonly XpTier[] = [
  { min: 1, max: 5, costPerUnit: 8 },
  { min: 6, max: 10, costPerUnit: 10 },
  { min: 11, max: 15, costPerUnit: 13 },
  { min: 16, max: 20, costPerUnit: 15 },
  { min: 21, max: 25, costPerUnit: 20 },
  { min: 26, max: 30, costPerUnit: 30 },
  { min: 31, max: 32, costPerUnit: 40 },
]

export const SPHERE_TIERS: readonly XpTier[] = [
  { min: 1, max: 10, costPerUnit: 8 },
  { min: 11, max: 20, costPerUnit: 10 },
  { min: 21, max: 30, costPerUnit: 12 },
  { min: 31, max: 40, costPerUnit: 15 },
  { min: 41, max: 50, costPerUnit: 18 },
  { min: 51, max: null, costPerUnit: 30 },
]

export const BASE_STATUS_COSTS: Record<StatusLevel, number> = {
  1: 6,
  2: 12,
  3: 18,
  4: 24,
  5: 30,
}

const STATUS_LEVELS: readonly StatusLevel[] = [1, 2, 3, 4, 5]

export const STATUS_TIERS: readonly XpTier[] = STATUS_LEVELS.map((level) => ({
  min: level,
  max: level,
  costPerUnit: BASE_STATUS_COSTS[level],
}))

export const SKILL_TIERS: readonly XpTier[] = [
  { min: 1, max: 2, costPerUnit: 2 },
  { min: 3, max: 5, costPerUnit: 3 },
]

export const DICE_COSTS: Record<DiceId, number> = {
  vida: 10,
  mana: 8,
  energia: 8,
}

function fixedCostTier(costPerUnit: number): readonly XpTier[] {
  return [{ min: 1, max: null, costPerUnit }]
}

export const DICE_TIERS: Record<DiceId, readonly XpTier[]> = {
  vida: fixedCostTier(DICE_COSTS.vida),
  mana: fixedCostTier(DICE_COSTS.mana),
  energia: fixedCostTier(DICE_COSTS.energia),
}
