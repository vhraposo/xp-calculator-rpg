import { useCallback, useMemo, useState } from 'react'
import { computeCalculator } from '../lib/xp/calculator'
import { createInitialState, hasCustomValues, setTrackedField } from '../lib/xp/state'
import type {
  AttributeId,
  CalculatorResults,
  CalculatorState,
  DiceId,
  SkillId,
  SphereId,
  StatusId,
  TrackedField,
} from '../lib/xp/types'

export interface CalculatorController {
  state: CalculatorState
  results: CalculatorResults
  isDirty: boolean
  reset: () => void
  updateAttribute: (id: AttributeId, field: TrackedField, value: number) => void
  updateSphere: (id: SphereId, field: TrackedField, value: number) => void
  updateStatus: (id: StatusId, field: TrackedField, value: number) => void
  updateSkill: (id: SkillId, field: TrackedField, value: number) => void
  updateDice: (id: DiceId, field: TrackedField, value: number) => void
}

export function useCalculator(): CalculatorController {
  const [state, setState] = useState<CalculatorState>(createInitialState)

  const results = useMemo(() => computeCalculator(state), [state])
  const isDirty = useMemo(() => hasCustomValues(state), [state])

  const reset = useCallback(() => {
    setState(createInitialState())
  }, [])

  const updateAttribute = useCallback(
    (id: AttributeId, field: TrackedField, value: number) => {
      setState((previous) => setTrackedField(previous, 'attributes', id, field, value))
    },
    [],
  )

  const updateSphere = useCallback(
    (id: SphereId, field: TrackedField, value: number) => {
      setState((previous) => setTrackedField(previous, 'spheres', id, field, value))
    },
    [],
  )

  const updateStatus = useCallback(
    (id: StatusId, field: TrackedField, value: number) => {
      setState((previous) => setTrackedField(previous, 'statuses', id, field, value))
    },
    [],
  )

  const updateSkill = useCallback(
    (id: SkillId, field: TrackedField, value: number) => {
      setState((previous) => setTrackedField(previous, 'skills', id, field, value))
    },
    [],
  )

  const updateDice = useCallback(
    (id: DiceId, field: TrackedField, value: number) => {
      setState((previous) => setTrackedField(previous, 'dice', id, field, value))
    },
    [],
  )

  return {
    state,
    results,
    isDirty,
    reset,
    updateAttribute,
    updateSphere,
    updateStatus,
    updateSkill,
    updateDice,
  }
}
