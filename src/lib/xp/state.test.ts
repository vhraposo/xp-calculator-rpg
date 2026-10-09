import { describe, expect, it } from 'vitest'
import { createInitialState, hasCustomValues, setTrackedField } from './state'

describe('createInitialState', () => {
  it('inicia todas as categorias no nível 0', () => {
    const state = createInitialState()

    expect(state.attributes.for).toEqual({ current: 0, target: 0 })
    expect(state.attributes.sdm).toEqual({ current: 0, target: 0 })
    expect(state.spheres.nin).toEqual({ current: 0, target: 0 })
    expect(state.statuses.combate).toEqual({ current: 0, target: 0 })
    expect(state.skills.pericia).toEqual({ current: 0, target: 0 })
    expect(state.dice.vida).toEqual({ current: 0, target: 0 })
    expect(state.dice.energia).toEqual({ current: 0, target: 0 })
  })

  it('cria referências independentes entre atributos', () => {
    const state = createInitialState()
    const updated = setTrackedField(state, 'attributes', 'for', 'target', 10)

    expect(updated.attributes.for.target).toBe(10)
    expect(updated.attributes.des.target).toBe(0)
    expect(state.attributes.for.target).toBe(0)
  })
})

describe('setTrackedField', () => {
  it('atualiza current e target de forma imutável', () => {
    const state = createInitialState()
    const first = setTrackedField(state, 'spheres', 'gen', 'current', 5)
    const second = setTrackedField(first, 'spheres', 'gen', 'target', 8)

    expect(state.spheres.gen).toEqual({ current: 0, target: 0 })
    expect(second.spheres.gen).toEqual({ current: 5, target: 8 })
    expect(second.spheres.nin).toEqual({ current: 0, target: 0 })
  })

  it('sanitiza valores inválidos', () => {
    const state = createInitialState()
    const updated = setTrackedField(state, 'dice', 'mana', 'target', Number.NaN)

    expect(updated.dice.mana.target).toBe(0)
  })
})

describe('hasCustomValues', () => {
  it('retorna false no estado inicial e true após qualquer alteração', () => {
    const state = createInitialState()

    expect(hasCustomValues(state)).toBe(false)
    expect(hasCustomValues(setTrackedField(state, 'attributes', 'for', 'target', 2))).toBe(true)
    expect(hasCustomValues(setTrackedField(state, 'dice', 'vida', 'target', 1))).toBe(true)
  })
})
