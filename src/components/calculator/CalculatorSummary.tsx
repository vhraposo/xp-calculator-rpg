import {
  Check,
  Dices,
  Flame,
  Orbit,
  RotateCcw,
  Shield,
  Sword,
  Target,
  Trash2,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { formatSigned, formatXp } from '../../lib/format'
import type { CategoryXp, EnergyGain } from '../../lib/xp/types'
import { IconTile } from '../ui/IconTile'
import type { Tone } from '../ui/Badge'

type CategoryKey = keyof CategoryXp

interface CategoryItem {
  readonly id: CategoryKey
  readonly label: string
  readonly icon: LucideIcon
  readonly tone: Tone
}

const CATEGORY_ITEMS: readonly CategoryItem[] = [
  { id: 'attributes', label: 'Atributos', icon: Sword, tone: 'violet' },
  { id: 'spheres', label: 'Esferas', icon: Orbit, tone: 'cyan' },
  { id: 'statuses', label: 'Status', icon: Shield, tone: 'emerald' },
  { id: 'skills', label: 'Perícias', icon: Target, tone: 'amber' },
  { id: 'dice', label: 'Dados', icon: Dices, tone: 'rose' },
]

interface EnergyRowProps {
  icon: LucideIcon
  tone: Tone
  label: string
  value: number
}

function EnergyRow({ icon, tone, label, value }: EnergyRowProps) {
  return (
    <div className="flex items-center gap-2.5">
      <IconTile icon={icon} tone={tone} className="size-8 rounded-lg" />
      <span className="flex-1 text-xs text-slate-400">{label}</span>
      <span className="text-sm font-bold text-white tabular-nums">
        {formatSigned(value)}
      </span>
    </div>
  )
}

interface CalculatorSummaryProps {
  totalXp: number
  byCategory: CategoryXp
  energy: EnergyGain
  isDirty: boolean
  onReset: () => void
}

function SummaryBlock({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="border-t border-white/5 px-5 py-4">
      <h2 className="text-[0.65rem] font-semibold tracking-[0.2em] text-slate-500 uppercase">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </div>
  )
}

export function CalculatorSummary({
  totalXp,
  byCategory,
  energy,
  isDirty,
  onReset,
}: CalculatorSummaryProps) {
  const [confirming, setConfirming] = useState(false)

  const handleResetRequest = () => {
    if (isDirty) {
      setConfirming(true)
    }
  }

  const handleConfirm = () => {
    setConfirming(false)
    onReset()
  }

  return (
    <section
      aria-label="Resumo da evolução"
      className="overflow-hidden rounded-3xl border border-violet-400/20 bg-slate-900/70 shadow-[0_24px_70px_-40px_rgba(139,92,246,0.9)] backdrop-blur"
    >
      <div className="bg-gradient-to-br from-violet-500/15 via-transparent to-transparent px-5 pt-5 pb-4">
        <h2 className="text-[0.65rem] font-semibold tracking-[0.2em] text-violet-300 uppercase">
          XP total
        </h2>
        <p className="mt-1 flex items-baseline gap-2">
          <span
            key={totalXp}
            className="animate-xp-pop text-4xl font-extrabold text-white tabular-nums sm:text-5xl"
          >
            {formatXp(totalXp)}
          </span>
          <span className="text-sm font-semibold text-slate-400">XP</span>
        </p>
        <p className="mt-1.5 text-xs text-slate-400">
          para concluir toda a evolução planejada
        </p>
      </div>

      <SummaryBlock title="Distribuição por categoria">
        <ul className="space-y-2.5">
          {CATEGORY_ITEMS.map((item) => (
            <li key={item.id} className="flex items-center gap-2.5">
              <IconTile icon={item.icon} tone={item.tone} className="size-8 rounded-lg" />
              <span className="flex-1 text-sm text-slate-300">{item.label}</span>
              <span className="text-sm font-semibold text-white tabular-nums">
                {formatXp(byCategory[item.id])} XP
              </span>
            </li>
          ))}
        </ul>
      </SummaryBlock>

      <SummaryBlock title="Energia adquirida">
        <div className="space-y-2.5">
          <EnergyRow
            icon={Zap}
            tone="cyan"
            label="Energia Mística"
            value={energy.mystical}
          />
          <EnergyRow
            icon={Flame}
            tone="orange"
            label="Energia Física"
            value={energy.physical}
          />
        </div>
      </SummaryBlock>

      <div className="border-t border-white/5 px-5 py-4">
        {confirming ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-300">
              Descartar todos os valores informados e voltar ao início?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConfirm}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-400/30 bg-rose-500/15 px-3 py-2 text-xs font-semibold text-rose-200 transition-colors hover:bg-rose-500/25"
              >
                <Check className="size-4" aria-hidden="true" />
                Confirmar limpeza
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/10"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleResetRequest}
            disabled={!isDirty}
            title={isDirty ? undefined : 'Nenhum valor foi modificado'}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:bg-white/5 disabled:hover:text-slate-300"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Limpar calculadora
            {isDirty ? (
              <Trash2 className="size-3.5 opacity-60" aria-hidden="true" />
            ) : null}
          </button>
        )}
      </div>
    </section>
  )
}
