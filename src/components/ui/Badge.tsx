import type { ReactNode } from 'react'

export type Tone =
  | 'violet'
  | 'cyan'
  | 'orange'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'slate'

const TONE_CLASSES: Record<Tone, string> = {
  violet: 'border-violet-400/25 bg-violet-500/10 text-violet-300',
  cyan: 'border-cyan-400/25 bg-cyan-500/10 text-cyan-300',
  orange: 'border-orange-400/25 bg-orange-500/10 text-orange-300',
  emerald: 'border-emerald-400/25 bg-emerald-500/10 text-emerald-300',
  amber: 'border-amber-400/25 bg-amber-500/10 text-amber-300',
  rose: 'border-rose-400/25 bg-rose-500/10 text-rose-300',
  slate: 'border-white/10 bg-white/5 text-slate-300',
}

interface BadgeProps {
  children: ReactNode
  tone?: Tone
  className?: string
}

export function Badge({ children, tone = 'slate', className }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.7rem] font-medium whitespace-nowrap ${TONE_CLASSES[tone]} ${className ?? ''}`}
    >
      {children}
    </span>
  )
}
