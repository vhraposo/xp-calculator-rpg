import { sanitizeInteger } from '../numbers'
import {
  ATTRIBUTES,
  DICE,
  INITIAL_LEVELS,
  SKILLS,
  SPHERES,
  STATUSES,
} from './constants'
import type {
  CalculatorState,
  TrackedField,
  TrackedValue,
} from './types'

function createTrackedValues<K extends string>(
  definitions: readonly { readonly id: K }[],
  initial: number,
): Record<K, TrackedValue> {
  const values = {} as Record<K, TrackedValue>
  for (const definition of definitions) {
    values[definition.id] = { current: initial, target: initial }
  }
  return values
}

export function createInitialState(): CalculatorState {
  return {
    attributes: createTrackedValues(ATTRIBUTES, INITIAL_LEVELS.attributes),
    spheres: createTrackedValues(SPHERES, INITIAL_LEVELS.spheres),
    statuses: createTrackedValues(STATUSES, INITIAL_LEVELS.statuses),
    skills: createTrackedValues(SKILLS, INITIAL_LEVELS.skills),
    dice: createTrackedValues(DICE, INITIAL_LEVELS.dice),
  }
}

type CalculatorCategory = keyof CalculatorState

export function setTrackedField(
  state: CalculatorState,
  category: CalculatorCategory,
  id: string,
  field: TrackedField,
  value: number,
): CalculatorState {
  const record = state[category] as Record<string, TrackedValue>
  const existing = record[id] ?? { current: 0, target: 0 }
  return {
    ...state,
    [category]: {
      ...record,
      [id]: { ...existing, [field]: sanitizeInteger(value) },
    },
  }
}

const CATEGORIES: readonly CalculatorCategory[] = [
  'attributes',
  'spheres',
  'statuses',
  'skills',
  'dice',
]

export function hasCustomValues(state: CalculatorState): boolean {
  const baseline = createInitialState()
  return CATEGORIES.some((category) => {
    const current = state[category] as Record<string, TrackedValue>
    const initial = baseline[category] as Record<string, TrackedValue>
    return Object.keys(current).some((id) => {
      const value = current[id]
      const initialValue = initial[id]
      return (
        value.current !== initialValue.current ||
        value.target !== initialValue.target
      )
    })
  })
}
