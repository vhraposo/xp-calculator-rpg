export type AttributeId =
  | 'for'
  | 'des'
  | 'vig'
  | 'int'
  | 'con'
  | 'car'
  | 'sdm'

export type SphereId = 'nin' | 'gen' | 'tai' | 'buk' | 'hij' | 'kin'

export type StatusId = 'combate' | 'precisao' | 'esquiva'

export type SkillId = 'pericia'

export type DiceId = 'vida' | 'mana' | 'energia'

export type StatusLevel = 1 | 2 | 3 | 4 | 5

export interface XpTier {
  readonly min: number
  readonly max: number | null
  readonly costPerUnit: number
}

export interface TierBreakdownEntry {
  readonly range: string
  readonly units: number
  readonly costPerUnit: number
  readonly total: number
}

export type ProgressionStatus = 'increase' | 'equal' | 'reduction'

export interface ProgressionResult {
  readonly current: number
  readonly target: number
  readonly units: number
  readonly totalXp: number
  readonly status: ProgressionStatus
  readonly breakdown: readonly TierBreakdownEntry[]
}

export interface ProgressionLimits {
  readonly min: number
  readonly max: number | null
}

export interface TrackedValue {
  current: number
  target: number
}

export type TrackedField = keyof TrackedValue

export interface EnergyRule {
  readonly mysticalPerUnit: number
  readonly physicalPerUnit: number
}

export interface EnergyGain {
  readonly mystical: number
  readonly physical: number
}

export interface Attribute {
  readonly id: AttributeId
  readonly name: string
  readonly short: string
}

export interface Sphere {
  readonly id: SphereId
  readonly name: string
  readonly short: string
  readonly energy: EnergyRule
}

export interface Status {
  readonly id: StatusId
  readonly name: string
  readonly short: string
}

export interface Skill {
  readonly id: SkillId
  readonly name: string
  readonly short: string
}

export interface Dice {
  readonly id: DiceId
  readonly name: string
  readonly short: string
}

export interface CalculatorState {
  attributes: Record<AttributeId, TrackedValue>
  spheres: Record<SphereId, TrackedValue>
  statuses: Record<StatusId, TrackedValue>
  skills: Record<SkillId, TrackedValue>
  dice: Record<DiceId, TrackedValue>
}

export interface CategoryXp {
  readonly attributes: number
  readonly spheres: number
  readonly statuses: number
  readonly skills: number
  readonly dice: number
}

export interface CalculatorResults {
  readonly attributes: Record<AttributeId, ProgressionResult>
  readonly spheres: Record<SphereId, ProgressionResult>
  readonly statuses: Record<StatusId, ProgressionResult>
  readonly skills: Record<SkillId, ProgressionResult>
  readonly dice: Record<DiceId, ProgressionResult>
  readonly sphereEnergy: Record<SphereId, EnergyGain>
  readonly energy: EnergyGain
  readonly byCategory: CategoryXp
  readonly totalXp: number
}
