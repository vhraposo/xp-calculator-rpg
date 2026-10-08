import { describe, expect, it } from 'vitest'
import {
  calculateEnergyGain,
  calculateProgressionCost,
  computeCalculator,
} from './calculator'
import { ATTRIBUTE_LIMITS, SPHERES } from './constants'
import { setTrackedField } from './state'
import { createInitialState } from './state'
import {
  ATTRIBUTE_TIERS,
  DICE_TIERS,
  SKILL_TIERS,
  SPHERE_TIERS,
  STATUS_TIERS,
} from './tiers'

const sphereById = (id: string) => {
  const sphere = SPHERES.find((candidate) => candidate.id === id)
  if (!sphere) {
    throw new Error(`Esfera não encontrada: ${id}`)
  }
  return sphere
}

describe('calculateProgressionCost — atributos', () => {
  it('cobra apenas a evolução dentro de uma única faixa', () => {
    const result = calculateProgressionCost(1, 5, ATTRIBUTE_TIERS)

    expect(result.status).toBe('increase')
    expect(result.units).toBe(4)
    expect(result.totalXp).toBe(32)
    expect(result.breakdown).toEqual([
      { range: '2–5', units: 4, costPerUnit: 8, total: 32 },
    ])
  })

  it('atravessa duas faixas (FOR 5 → 15 = 115 XP)', () => {
    const result = calculateProgressionCost(5, 15, ATTRIBUTE_TIERS)

    expect(result.totalXp).toBe(115)
    expect(result.units).toBe(10)
    expect(result.breakdown).toEqual([
      { range: '6–10', units: 5, costPerUnit: 10, total: 50 },
      { range: '11–15', units: 5, costPerUnit: 13, total: 65 },
    ])
    const subtotal = result.breakdown.reduce((sum, entry) => sum + entry.total, 0)
    expect(subtotal).toBe(result.totalXp)
  })

  it('não cobra o nível inicial novamente (5 → 6 = 10 XP)', () => {
    expect(calculateProgressionCost(5, 6, ATTRIBUTE_TIERS).totalXp).toBe(10)
    expect(calculateProgressionCost(5, 7, ATTRIBUTE_TIERS).totalXp).toBe(20)
    expect(calculateProgressionCost(5, 10, ATTRIBUTE_TIERS).totalXp).toBe(50)
    expect(calculateProgressionCost(10, 15, ATTRIBUTE_TIERS).totalXp).toBe(65)
  })

  it('atravessa várias faixas (25 → 32 = 230 XP)', () => {
    const result = calculateProgressionCost(25, 32, ATTRIBUTE_TIERS)

    expect(result.totalXp).toBe(230)
    expect(result.breakdown).toEqual([
      { range: '26–30', units: 5, costPerUnit: 30, total: 150 },
      { range: '31–32', units: 2, costPerUnit: 40, total: 80 },
    ])
  })

  it('retorna evolução vazia quando atual é igual ao destino', () => {
    const result = calculateProgressionCost(15, 15, ATTRIBUTE_TIERS)

    expect(result.status).toBe('equal')
    expect(result.totalXp).toBe(0)
    expect(result.units).toBe(0)
    expect(result.breakdown).toEqual([])
  })

  it('sinaliza redução sem calcular XP negativo', () => {
    const result = calculateProgressionCost(15, 5, ATTRIBUTE_TIERS)

    expect(result.status).toBe('reduction')
    expect(result.totalXp).toBe(0)
    expect(result.units).toBe(0)
    expect(result.breakdown).toEqual([])
  })

  it('respeita o limite máximo de 32 do atributo', () => {
    const result = calculateProgressionCost(30, 40, ATTRIBUTE_TIERS, ATTRIBUTE_LIMITS)

    expect(result.target).toBe(32)
    expect(result.totalXp).toBe(80)
    expect(result.breakdown).toEqual([
      { range: '31–32', units: 2, costPerUnit: 40, total: 80 },
    ])
  })

  it('sanitiza valores inválidos sem quebrar o cálculo', () => {
    const result = calculateProgressionCost(Number.NaN, 5, ATTRIBUTE_TIERS, ATTRIBUTE_LIMITS)

    expect(result.status).toBe('increase')
    expect(result.current).toBe(1)
    expect(result.totalXp).toBe(32)
  })
})

describe('calculateProgressionCost — esferas', () => {
  it('atravessa faixas de esfera (5 → 12 = 60 XP)', () => {
    const result = calculateProgressionCost(5, 12, SPHERE_TIERS)

    expect(result.totalXp).toBe(60)
    expect(result.units).toBe(7)
    expect(result.breakdown).toEqual([
      { range: '6–10', units: 5, costPerUnit: 8, total: 40 },
      { range: '11–12', units: 2, costPerUnit: 10, total: 20 },
    ])
  })

  it('calcula a primeira faixa inteira (1 → 10 = 72 XP)', () => {
    expect(calculateProgressionCost(1, 10, SPHERE_TIERS).totalXp).toBe(72)
  })

  it('continua indefinidamente acima de 51 (50 → 55 = 150 XP)', () => {
    const result = calculateProgressionCost(50, 55, SPHERE_TIERS)

    expect(result.totalXp).toBe(150)
    expect(result.breakdown).toEqual([
      { range: '51–55', units: 5, costPerUnit: 30, total: 150 },
    ])
  })

  it('atravessa a fronteira dos 50 (48 → 53 = 126 XP)', () => {
    const result = calculateProgressionCost(48, 53, SPHERE_TIERS)

    expect(result.totalXp).toBe(126)
    expect(result.breakdown).toEqual([
      { range: '49–50', units: 2, costPerUnit: 18, total: 36 },
      { range: '51–53', units: 3, costPerUnit: 30, total: 90 },
    ])
  })

  it('não possui limite máximo', () => {
    expect(calculateProgressionCost(99, 101, SPHERE_TIERS).totalXp).toBe(60)
    expect(calculateProgressionCost(500, 501, SPHERE_TIERS).totalXp).toBe(30)
  })
})

describe('calculateEnergyGain — energia das esferas', () => {
  it('calcula energia por unidade adquirida (NIN 5 → 12 = +70 Mística / +35 Física)', () => {
    const ninjutsu = sphereById('nin')
    const progression = calculateProgressionCost(5, 12, SPHERE_TIERS)
    const energy = calculateEnergyGain(progression.units, ninjutsu.energy)

    expect(progression.units).toBe(7)
    expect(energy).toEqual({ mystical: 70, physical: 35 })
  })

  it('aplica as regras de cada esfera', () => {
    expect(calculateEnergyGain(3, sphereById('gen').energy)).toEqual({
      mystical: 45,
      physical: 0,
    })
    expect(calculateEnergyGain(3, sphereById('tai').energy)).toEqual({
      mystical: 0,
      physical: 45,
    })
    expect(calculateEnergyGain(2, sphereById('buk').energy)).toEqual({
      mystical: 10,
      physical: 20,
    })
    expect(calculateEnergyGain(4, sphereById('hij').energy)).toEqual({
      mystical: 40,
      physical: 40,
    })
    expect(calculateEnergyGain(5, sphereById('kin').energy)).toEqual({
      mystical: 100,
      physical: 0,
    })
  })

  it('não concede energia sem unidades adquiridas', () => {
    expect(calculateEnergyGain(0, sphereById('nin').energy)).toEqual({
      mystical: 0,
      physical: 0,
    })
    expect(calculateEnergyGain(-3, sphereById('nin').energy)).toEqual({
      mystical: 0,
      physical: 0,
    })
  })
})

describe('calculadora de status', () => {
  it('Status Base 1 → 5 = 84 XP', () => {
    const result = calculateProgressionCost(1, 5, STATUS_TIERS)

    expect(result.totalXp).toBe(84)
    expect(result.breakdown.map((entry) => entry.total)).toEqual([12, 18, 24, 30])
  })

  it('cobra o custo do nível adquirido (1 → 2 = 12 XP, 4 → 5 = 30 XP)', () => {
    expect(calculateProgressionCost(1, 2, STATUS_TIERS).totalXp).toBe(12)
    expect(calculateProgressionCost(4, 5, STATUS_TIERS).totalXp).toBe(30)
  })

  it('respeita o limite máximo de nível 5', () => {
    const result = calculateProgressionCost(4, 7, STATUS_TIERS, { min: 1, max: 5 })

    expect(result.target).toBe(5)
    expect(result.totalXp).toBe(30)
  })
})

describe('pontos em perícia', () => {
  it('1 → 5 = 11 XP', () => {
    const result = calculateProgressionCost(1, 5, SKILL_TIERS)

    expect(result.totalXp).toBe(11)
    expect(result.breakdown).toEqual([
      { range: '2', units: 1, costPerUnit: 2, total: 2 },
      { range: '3–5', units: 3, costPerUnit: 3, total: 9 },
    ])
  })

  it('calcula dentro de uma única faixa (1 → 2 = 2 XP / 2 → 5 = 9 XP)', () => {
    expect(calculateProgressionCost(1, 2, SKILL_TIERS).totalXp).toBe(2)
    expect(calculateProgressionCost(2, 5, SKILL_TIERS).totalXp).toBe(9)
  })

  it('respeita o limite máximo de 5', () => {
    const result = calculateProgressionCost(3, 9, SKILL_TIERS, { min: 1, max: 5 })

    expect(result.target).toBe(5)
    expect(result.totalXp).toBe(6)
  })
})

describe('dados', () => {
  it('Dado de Vida 3 → 5 = 20 XP', () => {
    expect(calculateProgressionCost(3, 5, DICE_TIERS.vida).totalXp).toBe(20)
  })

  it('Dado de Mana e Dado de Energia custam 8 XP por dado', () => {
    expect(calculateProgressionCost(0, 3, DICE_TIERS.mana).totalXp).toBe(24)
    expect(calculateProgressionCost(0, 2, DICE_TIERS.energia).totalXp).toBe(16)
  })

  it('cobra o primeiro dado a partir de zero', () => {
    expect(calculateProgressionCost(0, 1, DICE_TIERS.vida).totalXp).toBe(10)
  })
})

describe('computeCalculator', () => {
  it('estado inicial não gera XP nem energia', () => {
    const results = computeCalculator(createInitialState())

    expect(results.totalXp).toBe(0)
    expect(results.energy).toEqual({ mystical: 0, physical: 0 })
    expect(results.byCategory).toEqual({
      attributes: 0,
      spheres: 0,
      statuses: 0,
      skills: 0,
      dice: 0,
    })
    expect(results.attributes.for.status).toBe('equal')
  })

  it('agrega XP por categoria, total e energia (cenário combinado)', () => {
    let state = createInitialState()
    state = setTrackedField(state, 'attributes', 'for', 'current', 5)
    state = setTrackedField(state, 'attributes', 'for', 'target', 15)
    state = setTrackedField(state, 'spheres', 'nin', 'current', 5)
    state = setTrackedField(state, 'spheres', 'nin', 'target', 12)
    state = setTrackedField(state, 'statuses', 'combate', 'target', 5)
    state = setTrackedField(state, 'skills', 'pericia', 'target', 5)
    state = setTrackedField(state, 'dice', 'vida', 'current', 3)
    state = setTrackedField(state, 'dice', 'vida', 'target', 5)

    const results = computeCalculator(state)

    expect(results.attributes.for.totalXp).toBe(115)
    expect(results.spheres.nin.totalXp).toBe(60)
    expect(results.statuses.combate.totalXp).toBe(84)
    expect(results.skills.pericia.totalXp).toBe(11)
    expect(results.dice.vida.totalXp).toBe(20)
    expect(results.byCategory).toEqual({
      attributes: 115,
      spheres: 60,
      statuses: 84,
      skills: 11,
      dice: 20,
    })
    expect(results.totalXp).toBe(290)
    expect(results.energy).toEqual({ mystical: 70, physical: 35 })
    expect(results.sphereEnergy.nin).toEqual({ mystical: 70, physical: 35 })
    expect(results.sphereEnergy.gen).toEqual({ mystical: 0, physical: 0 })
  })

  it('soma energia de múltiplas esferas', () => {
    let state = createInitialState()
    state = setTrackedField(state, 'spheres', 'nin', 'current', 5)
    state = setTrackedField(state, 'spheres', 'nin', 'target', 12)
    state = setTrackedField(state, 'spheres', 'tai', 'target', 3)

    const results = computeCalculator(state)

    expect(results.sphereEnergy.nin).toEqual({ mystical: 70, physical: 35 })
    expect(results.sphereEnergy.tai).toEqual({ mystical: 0, physical: 30 })
    expect(results.energy).toEqual({ mystical: 70, physical: 65 })
  })

  it('ignora evoluções negativas nas somas', () => {
    let state = createInitialState()
    state = setTrackedField(state, 'attributes', 'for', 'current', 10)
    state = setTrackedField(state, 'attributes', 'for', 'target', 5)

    const results = computeCalculator(state)

    expect(results.attributes.for.status).toBe('reduction')
    expect(results.totalXp).toBe(0)
  })
})
