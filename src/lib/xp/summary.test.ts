import { describe, expect, it } from 'vitest'
import { computeCalculator } from './calculator'
import { createInitialState, setTrackedField } from './state'
import {
  buildDistributionSummary,
  formatAcquiredPoints,
  formatDistributionSummary,
} from './summary'
import type { CalculatorState } from './types'

function createScenarioState(): CalculatorState {
  let state = createInitialState()
  state = setTrackedField(state, 'attributes', 'for', 'target', 15)
  state = setTrackedField(state, 'attributes', 'des', 'target', 5)
  state = setTrackedField(state, 'spheres', 'nin', 'target', 3)
  state = setTrackedField(state, 'statuses', 'combate', 'target', 2)
  state = setTrackedField(state, 'statuses', 'esquiva', 'target', 1)
  state = setTrackedField(state, 'skills', 'pericia', 'target', 5)
  state = setTrackedField(state, 'dice', 'vida', 'target', 3)
  return state
}

describe('buildDistributionSummary', () => {
  it('inclui todas as categorias e itens, mesmo sem investimento', () => {
    const summary = buildDistributionSummary(
      computeCalculator(createInitialState()),
    )

    expect(summary.categories.map((category) => category.title)).toEqual([
      'Atributos',
      'Esferas',
      'Status',
      'Pontos em Perícia',
      'Dados',
    ])
    expect(summary.categories.map((category) => category.items.length)).toEqual([
      7, 6, 3, 1, 3,
    ])
    expect(summary.totalXp).toBe(0)
    expect(summary.totalUnits).toBe(0)
    expect(summary.energy).toEqual({ mystical: 0, physical: 0 })
  })

  it('deriva itens, subtotais, total, pontos e energia dos resultados centrais', () => {
    const state = createScenarioState()
    const summary = buildDistributionSummary(computeCalculator(state))

    const attributes = summary.categories[0]
    const spheres = summary.categories[1]
    const statuses = summary.categories[2]
    const skills = summary.categories[3]
    const dice = summary.categories[4]

    expect(attributes.totalXp).toBe(195)
    expect(spheres.totalXp).toBe(24)
    expect(statuses.totalXp).toBe(24)
    expect(skills.totalXp).toBe(13)
    expect(dice.totalXp).toBe(30)

    const forca = attributes.items.find((item) => item.id === 'for')
    expect(forca).toMatchObject({
      name: 'Força',
      short: 'FOR',
      current: 0,
      target: 15,
      units: 15,
      xp: 155,
    })

    const vigor = attributes.items.find((item) => item.id === 'vig')
    expect(vigor).toMatchObject({ units: 0, xp: 0, target: 0 })

    const ninjutsu = spheres.items.find((item) => item.id === 'nin')
    expect(ninjutsu?.energy).toEqual({ mystical: 30, physical: 15 })

    expect(summary.totalXp).toBe(286)
    expect(summary.totalUnits).toBe(34)
    expect(summary.energy).toEqual({ mystical: 30, physical: 15 })
  })
})

describe('formatDistributionSummary', () => {
  it('usa singular e plural corretamente na quantidade de pontos', () => {
    expect(formatAcquiredPoints(0)).toBe('+0 pontos')
    expect(formatAcquiredPoints(1)).toBe('+1 ponto')
    expect(formatAcquiredPoints(2)).toBe('+2 pontos')
  })

  it('gera o texto completo com todas as seções e itens sem investimento', () => {
    const summary = buildDistributionSummary(
      computeCalculator(createScenarioState()),
    )
    const text = formatDistributionSummary(summary)

    expect(text.startsWith('DISTRIBUIÇÃO DE XP')).toBe(true)
    expect(text).toContain('ATRIBUTOS')
    expect(text).toContain('ESFERAS')
    expect(text).toContain('STATUS')
    expect(text).toContain('PONTOS EM PERÍCIA')
    expect(text).toContain('DADOS')
    expect(text).toContain('RESUMO')

    expect(text).toContain('Força (FOR): 0 → 15 | +15 pontos | 155 XP')
    expect(text).toContain('Vigor (VIG): 0 → 0 | +0 pontos | 0 XP')
    expect(text).toContain('Ninjutsu (NIN): 0 → 3 | +3 pontos | 24 XP')
    expect(text).toContain('Energia Mística adquirida: +30')
    expect(text).toContain('Energia Física adquirida: +15')
    expect(text).toContain('Combate (CMB): 0 → 2 | +2 pontos | 18 XP')
    expect(text).toContain('Pontos em Perícia (PER): 0 → 5 | +5 pontos | 13 XP')
    expect(text).toContain('Dado de Vida (VID): 0 → 3 | +3 pontos | 30 XP')
    expect(text).toContain('Dado de Mana (MAN): 0 → 0 | +0 pontos | 0 XP')

    expect(text).toContain('Subtotal: 195 XP')
    expect(text).toContain('Subtotal: 24 XP')
    expect(text).toContain('Subtotal: 13 XP')
    expect(text).toContain('Subtotal: 30 XP')
    expect(text).toContain('XP total investido: 286 XP')
    expect(text).toContain('Pontos adquiridos: 34')
    expect(text).toContain('Energia Mística total adquirida: +30')
    expect(text).toContain('Energia Física total adquirida: +15')
  })

  it('não adiciona linhas de energia para esferas sem ganho', () => {
    const summary = buildDistributionSummary(
      computeCalculator(createInitialState()),
    )
    const text = formatDistributionSummary(summary)

    expect(text).not.toContain('Energia Mística adquirida')
    expect(text).toContain('Genjutsu (GEN): 0 → 0 | +0 pontos | 0 XP')
  })
})
