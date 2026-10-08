import { Minus, Plus } from 'lucide-react'
import { useId, useState } from 'react'
import { clampNumber, parseIntegerInput } from '../../lib/numbers'

interface NumberStepperProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number | null
  step?: number
  context?: string
  className?: string
}

export function NumberStepper({
  label,
  value,
  onChange,
  min = 0,
  max = null,
  step = 1,
  context,
  className,
}: NumberStepperProps) {
  const inputId = useId()
  const [draft, setDraft] = useState<string | null>(null)

  const canDecrease = value > min
  const canIncrease = max === null || value < max
  const accessibleName = context ? `${context} — ${label}` : label

  const changeBy = (delta: number) => {
    setDraft(null)
    onChange(clampNumber(value + delta, min, max))
  }

  const handleInput = (raw: string) => {
    setDraft(raw)
    const parsed = parseIntegerInput(raw)
    if (parsed !== null) {
      onChange(clampNumber(parsed, min, max))
    }
  }

  const handleBlur = () => {
    if (draft !== null) {
      const parsed = parseIntegerInput(draft)
      if (parsed !== null) {
        onChange(clampNumber(parsed, min, max))
      }
      setDraft(null)
    }
  }

  return (
    <div className={`flex flex-col gap-1 ${className ?? ''}`}>
      <label
        htmlFor={inputId}
        className="text-[0.65rem] font-semibold tracking-[0.14em] text-slate-400 uppercase"
      >
        {label}
      </label>
      <div className="flex items-center overflow-hidden rounded-xl border border-white/10 bg-slate-950/70 transition-colors focus-within:border-violet-400/60 focus-within:ring-2 focus-within:ring-violet-500/20">
        <button
          type="button"
          onClick={() => changeBy(-step)}
          disabled={!canDecrease}
          aria-label={`Diminuir ${accessibleName}`}
          className="flex size-10 items-center justify-center text-slate-400 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:size-9"
        >
          <Minus className="size-3.5" aria-hidden="true" />
        </button>
        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          min={min}
          max={max ?? undefined}
          step={step}
          value={draft ?? String(value)}
          onChange={(event) => handleInput(event.target.value)}
          onBlur={handleBlur}
          aria-label={accessibleName}
          className="no-spinner w-12 bg-transparent py-2 text-center text-base font-semibold text-white tabular-nums outline-none"
        />
        <button
          type="button"
          onClick={() => changeBy(step)}
          disabled={!canIncrease}
          aria-label={`Aumentar ${accessibleName}`}
          className="flex size-10 items-center justify-center text-slate-400 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:size-9"
        >
          <Plus className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
