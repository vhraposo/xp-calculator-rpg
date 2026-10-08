import type {
  Attribute,
  Dice,
  ProgressionLimits,
  Skill,
  Sphere,
  Status,
} from './types'

export const ATTRIBUTE_LIMITS: ProgressionLimits = { min: 1, max: 32 }
export const SPHERE_LIMITS: ProgressionLimits = { min: 1, max: null }
export const STATUS_LIMITS: ProgressionLimits = { min: 1, max: 5 }
export const SKILL_LIMITS: ProgressionLimits = { min: 1, max: 5 }
export const DICE_LIMITS: ProgressionLimits = { min: 0, max: null }

export const INITIAL_LEVELS = {
  attributes: 1,
  spheres: 1,
  statuses: 1,
  skills: 1,
  dice: 0,
} as const

export const ATTRIBUTES: readonly Attribute[] = [
  { id: 'for', name: 'Força', short: 'FOR' },
  { id: 'des', name: 'Destreza', short: 'DES' },
  { id: 'vig', name: 'Vigor', short: 'VIG' },
  { id: 'int', name: 'Inteligência', short: 'INT' },
  { id: 'con', name: 'Concentração', short: 'CON' },
  { id: 'car', name: 'Carisma', short: 'CAR' },
  { id: 'sdm', name: 'Selos de Mão', short: 'SDM' },
]

export const SPHERES: readonly Sphere[] = [
  {
    id: 'nin',
    name: 'Ninjutsu',
    short: 'NIN',
    energy: { mysticalPerUnit: 10, physicalPerUnit: 5 },
  },
  {
    id: 'gen',
    name: 'Genjutsu',
    short: 'GEN',
    energy: { mysticalPerUnit: 15, physicalPerUnit: 0 },
  },
  {
    id: 'tai',
    name: 'Taijutsu',
    short: 'TAI',
    energy: { mysticalPerUnit: 0, physicalPerUnit: 15 },
  },
  {
    id: 'buk',
    name: 'Bukijutsu',
    short: 'BUK',
    energy: { mysticalPerUnit: 5, physicalPerUnit: 10 },
  },
  {
    id: 'hij',
    name: 'Hijutsu',
    short: 'HIJ',
    energy: { mysticalPerUnit: 10, physicalPerUnit: 10 },
  },
  {
    id: 'kin',
    name: 'Kinjutsu',
    short: 'KIN',
    energy: { mysticalPerUnit: 20, physicalPerUnit: 0 },
  },
]

export const STATUSES: readonly Status[] = [
  { id: 'combate', name: 'Combate', short: 'CMB' },
  { id: 'precisao', name: 'Precisão', short: 'PRE' },
  { id: 'esquiva', name: 'Esquiva', short: 'ESQ' },
]

export const SKILLS: readonly Skill[] = [
  { id: 'pericia', name: 'Pontos em Perícia', short: 'PER' },
]

export const DICE: readonly Dice[] = [
  { id: 'vida', name: 'Dado de Vida', short: 'VID' },
  { id: 'mana', name: 'Dado de Mana', short: 'MAN' },
  { id: 'energia', name: 'Dado de Energia', short: 'ENE' },
]
