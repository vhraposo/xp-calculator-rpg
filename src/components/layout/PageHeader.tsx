import { Sparkles } from 'lucide-react'

export function PageHeader() {
  return (
    <header className="flex items-center gap-4">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-500/25 to-fuchsia-500/10 text-violet-200 shadow-[0_0_44px_-14px_rgba(139,92,246,0.9)]">
        <Sparkles className="size-7" aria-hidden="true" />
      </span>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Calculadora de XP
        </h1>
        <p className="mt-1 max-w-xl text-sm text-slate-400">
          Planeje sua evolução e descubra exatamente quanto XP será necessário.
        </p>
      </div>
    </header>
  )
}
