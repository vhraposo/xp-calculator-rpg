import {
  Brain,
  Crosshair,
  Crown,
  Droplet,
  Focus,
  Hand,
  Heart,
  HeartPulse,
  Rabbit,
  Swords,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { AttributeId, DiceId, StatusId } from '../../lib/xp/types'

export const ATTRIBUTE_ICONS: Record<AttributeId, LucideIcon> = {
  for: Swords,
  des: Rabbit,
  vig: HeartPulse,
  int: Brain,
  con: Focus,
  car: Crown,
  sdm: Hand,
}

export const STATUS_ICONS: Record<StatusId, LucideIcon> = {
  combate: Swords,
  precisao: Crosshair,
  esquiva: Wind,
}

export const DICE_ICONS: Record<DiceId, LucideIcon> = {
  vida: Heart,
  mana: Droplet,
  energia: Zap,
}
