import { Link } from "@tanstack/react-router"
import { useMemo } from "react"
import { phaseGroupLabel } from "@/utils/phase"
import { numberToRoman } from "@/utils/strings/numbers"
import type { PhaseLink } from "@/utils/types/data/phase"
import type { School } from "@/utils/types/data/school"
import { cn } from "@/utils/ui"

type Props = {
  phases: PhaseLink[]
  school: School
  year: number
}

type Language = "IT" | "EN"

type LanguageConfig = {
  lang: Language
  title: string
  flag: string
  headerStyles: string
  itemStyles: string
  separatorStyles: string
}

const LANGUAGES: LanguageConfig[] = [
  {
    lang: "IT",
    title: "Italiano",
    flag: "🇮🇹",
    headerStyles:
      "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    itemStyles:
      "bg-white hover:bg-green-50 dark:bg-slate-800 dark:hover:bg-green-900/20",
    separatorStyles:
      "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  },
  {
    lang: "EN",
    title: "English",
    flag: "🇬🇧",
    headerStyles:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    itemStyles:
      "bg-white hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-900/20",
    separatorStyles:
      "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  },
]

// Group phases by primary, then by secondary, keeping extraEu/normal pairs together
type PhaseGroup = {
  primary: number
  secondaries: Array<{
    secondary: number
    normal?: PhaseLink
    extraEu?: PhaseLink
  }>
}

function groupPhases(phases: PhaseLink[], lang: Language): PhaseGroup[] {
  const langPhases = phases.filter((p) => p.language === lang)

  // Group by primary
  const byPrimary = new Map<number, PhaseLink[]>()
  for (const phase of langPhases) {
    const existing = byPrimary.get(phase.primary) ?? []
    existing.push(phase)
    byPrimary.set(phase.primary, existing)
  }

  // For each primary, group by secondary and pair normal/extraEu
  const result: PhaseGroup[] = []
  for (const [primary, phasesInPrimary] of [...byPrimary.entries()].sort(
    ([a], [b]) => a - b
  )) {
    const bySecondary = new Map<
      number,
      { normal?: PhaseLink; extraEu?: PhaseLink }
    >()

    for (const phase of phasesInPrimary) {
      const existing = bySecondary.get(phase.secondary) ?? {}
      if (phase.isExtraEu) {
        existing.extraEu = phase
      } else {
        existing.normal = phase
      }
      bySecondary.set(phase.secondary, existing)
    }

    result.push({
      primary,
      secondaries: [...bySecondary.entries()]
        .sort(([a], [b]) => a - b)
        .map(([secondary, pair]) => ({ secondary, ...pair })),
    })
  }

  return result
}

export function RankingSelector({ phases, school, year }: Props) {
  const columnsData = useMemo(() => {
    return LANGUAGES.map((config) => ({
      config,
      groups: groupPhases(phases, config.lang),
    })).filter((c) => c.groups.length > 0)
  }, [phases])

  const gridCols = columnsData.length

  return (
    <div className="w-full space-y-6">
      {/* Columns grid */}
      <div
        className={cn(
          "grid items-start gap-4",
          gridCols === 1 && "mx-auto max-w-md grid-cols-1",
          gridCols === 2 && "grid-cols-1 sm:grid-cols-2"
        )}
      >
        {columnsData.map(({ config, groups }) => (
          <LanguageColumn
            key={config.lang}
            config={config}
            groups={groups}
            school={school}
            year={year}
          />
        ))}
      </div>

      {/* Summary */}
      <p className="text-slate-400 text-xs">
        {phases.length} graduatorie disponibili
      </p>
    </div>
  )
}

function LanguageColumn({
  config,
  groups,
  school,
  year,
}: {
  config: LanguageConfig
  groups: PhaseGroup[]
  school: School
  year: number
}) {
  // const hasMultiplePhases = groups.length > 1

  return (
    <div className="overflow-hidden rounded-xl border-2 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50">
      {/* Column header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 font-semibold",
          config.headerStyles
        )}
      >
        <span>{config.title}</span>
        <span className="text-xl">{config.flag}</span>
      </div>

      {/* Content with phase groups */}
      <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
        {groups.map((group) => (
          <div key={group.primary}>
            {/* Phase separator - only show if multiple phases */}
            <div
              className={cn(
                "px-4 py-2 font-semibold text-xs uppercase tracking-wide",
                config.separatorStyles
              )}
            >
              {phaseGroupLabel(group.primary)}
            </div>

            {/* Rankings rows - normal first, then extra-EU */}
            <PhaseRankings
              group={group}
              config={config}
              school={school}
              year={year}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function PhaseRankings({
  group,
  config,
  school,
  year,
}: {
  group: PhaseGroup
  config: LanguageConfig
  school: School
  year: number
}) {
  const normalPhases = group.secondaries
    .filter((s) => s.normal)
    .map((s) => s.normal as PhaseLink)
  const extraEuPhases = group.secondaries
    .filter((s) => s.extraEu)
    .map((s) => s.extraEu as PhaseLink)

  return (
    <div className="space-y-2 p-3">
      {/* Normal rankings row */}
      {normalPhases.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(3rem,1fr))] gap-2">
          {normalPhases.map((phase) => (
            <Link
              key={phase.id}
              to="/$school/$year/$id"
              params={{ school, year, id: phase.id }}
              className={cn(
                "rounded-lg border border-slate-200 px-3 py-2.5 text-center font-medium text-slate-900 transition-colors dark:border-slate-600 dark:text-slate-100",
                config.itemStyles
              )}
            >
              {getRankingLabel(phase)}
            </Link>
          ))}
        </div>
      )}

      {/* Extra-EU rankings row with dashed border and label */}
      {extraEuPhases.length > 0 && (
        <div className="relative mt-3 rounded-lg border border-amber-300 border-dashed bg-amber-50/30 p-1.5 pt-2.5 dark:border-amber-700 dark:bg-amber-950/20">
          {/* Label */}
          <span className="-translate-y-1/2 absolute top-0 left-2.5 bg-white px-1.5 font-medium text-amber-600 text-xs dark:bg-slate-800 dark:text-amber-500">
            Extra-UE
          </span>
          {/* Buttons */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(3rem,1fr))] gap-1.5">
            {extraEuPhases.map((phase) => (
              <Link
                key={phase.id}
                to="/$school/$year/$id"
                params={{ school, year, id: phase.id }}
                className={cn(
                  "rounded-lg border border-slate-200 px-3 py-1.5 text-center font-medium text-slate-700 transition-colors dark:border-slate-600 dark:text-slate-300",
                  config.itemStyles
                )}
              >
                {getRankingLabel(phase)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function getRankingLabel(phase: PhaseLink) {
  if (phase.secondary === 0) {
    return phase.stripped || "Graduatoria"
  }
  return `${numberToRoman(phase.secondary)}`
}
