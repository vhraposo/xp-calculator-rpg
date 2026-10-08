import type { LucideIcon } from 'lucide-react'
import type { Tone } from './Badge'

const TILE_TONES: Record<Tone, string> = {
  violet: 'border-violet-400/25 bg-violet-500/10 text-violet-300',
  cyan: 'border-cyan-400/25 bg-cyan-500/10 text-cyan-300',
  orange: 'border-orange-400/25 bg-orange-500/10 text-orange-300',
  emerald: 'border-emerald-400/25 bg-emerald-500/10 text-emerald-300',
  amber: 'border-amber-400/25 bg-amber-500/10 text-amber-300',
  rose: 'border-rose-400/25 bg-rose-500/10 text-rose-300',
  slate: 'border-white/10 bg-white/5 text-slate-300',
}

interface IconTileProps {
  icon: LucideIcon
  tone?: Tone
  className?: string
}

export function IconTile({ icon: Icon, tone = 'violet', className }: IconTileProps) {
  return (
    <span
      className={`flex size-9 shrink-0 items-center justify-center rounded-xl border ${TILE_TONES[tone]} ${className ?? ''}`}
    >
      <Icon className="size-4.5" aria-hidden="true" />
    </span>
  )
}
