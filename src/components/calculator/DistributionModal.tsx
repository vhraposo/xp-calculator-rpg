import {
  Check,
  ClipboardCheck,
  ClipboardCopy,
  Dices,
  Flame,
  Orbit,
  RotateCcw,
  Shield,
  Swords,
  Target,
  TriangleAlert,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { copyTextToClipboard } from '../../lib/clipboard'
import { formatAcquired, formatXp } from '../../lib/format'
import { formatAcquiredPoints, formatDistributionSummary } from '../../lib/xp/summary'
import type { DistributionSummary } from '../../lib/xp/summary'
import type { Tone } from '../ui/Badge'
import { IconTile } from '../ui/IconTile'

interface CategoryVisual {
  readonly icon: LucideIcon
  readonly tone: Tone
}

const CATEGORY_VISUALS: Record<string, CategoryVisual> = {
  attributes: { icon: Swords, tone: 'violet' },
  spheres: { icon: Orbit, tone: 'cyan' },
  statuses: { icon: Shield, tone: 'emerald' },
  skills: { icon: Target, tone: 'amber' },
  dice: { icon: Dices, tone: 'rose' },
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface DistributionModalProps {
  summary: DistributionSummary
  isDirty: boolean
  onClose: () => void
  onReset: () => void
}

function StatTile({
  label,
  value,
  tone = 'slate',
  highlighted = false,
}: {
  label: string
  value: string
  tone?: Tone
  highlighted?: boolean
}) {
  const valueTones: Record<Tone, string> = {
    violet: 'text-violet-200',
    cyan: 'text-cyan-300',
    orange: 'text-orange-300',
    emerald: 'text-emerald-300',
    amber: 'text-amber-300',
    rose: 'text-rose-300',
    slate: 'text-white',
  }

  return (
    <div
      className={`rounded-2xl border px-3 py-2.5 ${
        highlighted
          ? 'border-violet-400/30 bg-violet-500/10'
          : 'border-white/10 bg-slate-950/50'
      }`}
    >
      <p className="text-[0.6rem] font-semibold tracking-[0.14em] text-slate-500 uppercase">
        {label}
      </p>
      <p
        className={`mt-1 text-lg font-bold tabular-nums ${valueTones[tone]}`}
      >
        {value}
      </p>
    </div>
  )
}

export function DistributionModal({
  summary,
  isDirty,
  onClose,
  onReset,
}: DistributionModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const [copyError, setCopyError] = useState<string | null>(null)
  const [confirmingReset, setConfirmingReset] = useState(false)

  const copyText = useMemo(() => formatDistributionSummary(summary), [summary])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialogRef.current?.focus()
    return () => {
      previouslyFocused?.focus()
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        if (confirmingReset) {
          setConfirmingReset(false)
        } else {
          onClose()
        }
        return
      }
      if (event.key !== 'Tab') {
        return
      }
      const dialog = dialogRef.current
      if (!dialog) {
        return
      }
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      )
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const atStart =
        document.activeElement === first || document.activeElement === dialog
      if (event.shiftKey && atStart) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, confirmingReset])

  useEffect(() => {
    if (copyState !== 'copied') {
      return
    }
    const timeout = window.setTimeout(() => setCopyState('idle'), 2500)
    return () => window.clearTimeout(timeout)
  }, [copyState])

  const handleCopy = async () => {
    try {
      await copyTextToClipboard(copyText)
      setCopyError(null)
      setCopyState('copied')
    } catch (error) {
      setCopyState('error')
      setCopyError(
        error instanceof Error && error.message
          ? error.message
          : 'Não foi possível copiar a distribuição. Copie o texto manualmente.',
      )
    }
  }

  const handleResetRequest = () => {
    if (isDirty) {
      setConfirmingReset(true)
      return
    }
    onReset()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="distribution-modal-title"
        tabIndex={-1}
        className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-violet-400/20 bg-slate-900/95 shadow-[0_24px_70px_-30px_rgba(139,92,246,0.9)] outline-none sm:rounded-3xl"
      >
        <header className="shrink-0 border-b border-white/10 bg-gradient-to-br from-violet-500/15 via-transparent to-transparent px-5 py-4">
          <div className="flex items-start gap-3">
            <IconTile
              icon={ClipboardCheck}
              tone="violet"
              className="size-10 rounded-xl"
            />
            <div className="min-w-0 flex-1">
              <h2
                id="distribution-modal-title"
                className="text-base font-bold text-white sm:text-lg"
              >
                Distribuição de XP concluída
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Confira sua distribuição antes de copiar para sua ficha.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar resumo"
              className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile
              label="XP total"
              value={`${formatXp(summary.totalXp)} XP`}
              highlighted
            />
            <StatTile
              label="Pontos adquiridos"
              value={formatXp(summary.totalUnits)}
            />
            <StatTile
              label="Energia Mística"
              value={formatAcquired(summary.energy.mystical)}
              tone="cyan"
            />
            <StatTile
              label="Energia Física"
              value={formatAcquired(summary.energy.physical)}
              tone="orange"
            />
          </div>

          <div className="mt-5 space-y-5">
            {summary.categories.map((category) => {
              const visual = CATEGORY_VISUALS[category.id] ?? {
                icon: ClipboardCheck,
                tone: 'slate' as Tone,
              }
              return (
                <section key={category.id} aria-label={category.title}>
                  <header className="flex items-center gap-2">
                    <IconTile
                      icon={visual.icon}
                      tone={visual.tone}
                      className="size-7 rounded-lg"
                    />
                    <h3 className="flex-1 text-xs font-bold tracking-[0.16em] text-slate-200 uppercase">
                      {category.title}
                    </h3>
                    <span className="text-xs font-semibold text-slate-400 tabular-nums">
                      Subtotal: {formatXp(category.totalXp)} XP
                    </span>
                  </header>

                  <ul className="mt-2 divide-y divide-white/5 rounded-2xl border border-white/5 bg-slate-950/40 px-3">
                    {category.items.map((item) => (
                      <li
                        key={item.id}
                        className={`py-2 ${item.units === 0 ? 'opacity-55' : ''}`}
                      >
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
                          <span className="font-medium text-slate-200">
                            {item.name}{' '}
                            <span className="text-xs font-semibold text-slate-500">
                              ({item.short})
                            </span>
                          </span>
                          <span className="text-slate-400 tabular-nums">
                            {item.current} → {item.target}
                          </span>
                          <span className="text-slate-600" aria-hidden="true">
                            ·
                          </span>
                          <span className="text-slate-400 tabular-nums">
                            {formatAcquiredPoints(item.units)}
                          </span>
                          <span className="ml-auto font-semibold text-slate-100 tabular-nums">
                            {formatXp(item.xp)} XP
                          </span>
                        </div>

                        {item.energy &&
                        (item.energy.mystical > 0 || item.energy.physical > 0) ? (
                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
                            {item.energy.mystical > 0 ? (
                              <span className="flex items-center gap-1 text-cyan-300">
                                <Zap className="size-3" aria-hidden="true" />
                                Energia Mística: {formatAcquired(item.energy.mystical)}
                              </span>
                            ) : null}
                            {item.energy.physical > 0 ? (
                              <span className="flex items-center gap-1 text-orange-300">
                                <Flame className="size-3" aria-hidden="true" />
                                Energia Física: {formatAcquired(item.energy.physical)}
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })}
          </div>
        </div>

        <footer className="shrink-0 border-t border-white/10 bg-slate-950/70 px-5 py-4">
          {confirmingReset ? (
            <div className="space-y-3">
              <p className="flex items-start gap-2 text-sm text-slate-200">
                <TriangleAlert
                  className="mt-0.5 size-4 shrink-0 text-rose-300"
                  aria-hidden="true"
                />
                Toda a distribuição atual será perdida. Deseja resetar os valores?
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  autoFocus
                  onClick={onReset}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-400/40 bg-rose-500/20 px-3 py-2.5 text-sm font-semibold text-rose-100 transition-colors hover:bg-rose-500/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
                >
                  <Check className="size-4" aria-hidden="true" />
                  Confirmar reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingReset(false)}
                  className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/20 px-3 py-2.5 text-sm font-bold text-violet-100 transition-colors hover:bg-violet-500/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                >
                  <ClipboardCopy className="size-4" aria-hidden="true" />
                  Copiar distribuição
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={handleResetRequest}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-200 transition-colors hover:bg-rose-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Resetar distribuição
                </button>
              </div>

              <p
                role="status"
                className={`min-h-4 text-xs ${
                  copyState === 'error' ? 'text-amber-300' : 'text-emerald-300'
                }`}
              >
                {copyState === 'copied' ? 'Distribuição copiada!' : null}
                {copyState === 'error' ? copyError : null}
              </p>

              {copyState === 'error' ? (
                <div>
                  <label
                    htmlFor="distribution-copy-fallback"
                    className="text-[0.65rem] font-semibold tracking-[0.14em] text-slate-400 uppercase"
                  >
                    Copie o texto manualmente
                  </label>
                  <textarea
                    id="distribution-copy-fallback"
                    readOnly
                    value={copyText}
                    rows={6}
                    onClick={(event) => event.currentTarget.select()}
                    onFocus={(event) => event.currentTarget.select()}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 font-mono text-xs text-slate-300 outline-none focus-visible:border-violet-400/60"
                  />
                </div>
              ) : null}
            </div>
          )}
        </footer>
      </div>
    </div>
  )
}
