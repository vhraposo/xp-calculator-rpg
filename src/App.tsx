import { CalculatorSummary } from './components/calculator/CalculatorSummary'
import { AttributeSection } from './components/calculator/AttributeSection'
import { DiceSection } from './components/calculator/DiceSection'
import { SkillSection } from './components/calculator/SkillSection'
import { SphereSection } from './components/calculator/SphereSection'
import { StatusSection } from './components/calculator/StatusSection'
import { PageHeader } from './components/layout/PageHeader'
import { useCalculator } from './hooks/useCalculator'
import { formatXp } from './lib/format'

export default function App() {
  const {
    state,
    results,
    isDirty,
    reset,
    updateAttribute,
    updateSphere,
    updateStatus,
    updateSkill,
    updateDice,
  } = useCalculator()

  return (
    <div className="relative min-h-dvh">
      <div className="app-backdrop" aria-hidden="true" />

      <main className="mx-auto w-full max-w-7xl px-4 pt-8 pb-28 sm:px-6 lg:px-8 lg:pt-12 lg:pb-16">
        <PageHeader />

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-6">
            <CalculatorSummary
              totalXp={results.totalXp}
              byCategory={results.byCategory}
              energy={results.energy}
              isDirty={isDirty}
              onReset={reset}
            />
          </div>

          <div className="space-y-6">
            <AttributeSection
              values={state.attributes}
              results={results.attributes}
              totalXp={results.byCategory.attributes}
              onChange={updateAttribute}
            />
            <SphereSection
              values={state.spheres}
              results={results.spheres}
              energy={results.sphereEnergy}
              totalXp={results.byCategory.spheres}
              onChange={updateSphere}
            />
            <StatusSection
              values={state.statuses}
              results={results.statuses}
              totalXp={results.byCategory.statuses}
              onChange={updateStatus}
            />
            <SkillSection
              values={state.skills}
              results={results.skills}
              totalXp={results.byCategory.skills}
              onChange={updateSkill}
            />
            <DiceSection
              values={state.dice}
              results={results.dice}
              totalXp={results.byCategory.dice}
              onChange={updateDice}
            />
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-slate-500">
          O nível inicial não é cobrado novamente — você paga apenas pela evolução.
        </footer>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/90 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <span className="text-[0.65rem] font-semibold tracking-[0.18em] text-slate-400 uppercase">
            XP total
          </span>
          <span
            key={results.totalXp}
            className="animate-xp-pop text-lg font-bold text-white tabular-nums"
          >
            {formatXp(results.totalXp)} XP
          </span>
        </div>
      </div>
    </div>
  )
}
