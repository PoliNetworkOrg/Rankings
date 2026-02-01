import { Link } from "@tanstack/react-router"
import { useContext, useMemo } from "react"
import MobileContext from "@/contexts/MobileContext"
import { phaseGroupLabel } from "@/utils/phase"
import type { PhaseLink } from "@/utils/types/data/phase"
import type { School } from "@/utils/types/data/school"
import { cn } from "@/utils/ui"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

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
  separatorStyles: string
}

const LANGUAGES: LanguageConfig[] = [
  {
    lang: "IT",
    title: "Italiano",
    flag: "🇮🇹",
    headerStyles:
      "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    separatorStyles:
      "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  },
  {
    lang: "EN",
    title: "English",
    flag: "🇬🇧",
    headerStyles:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
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
  const { isMobile } = useContext(MobileContext)
  const columnsData = useMemo(() => {
    return LANGUAGES.map((config) => ({
      config,
      groups: groupPhases(phases, config.lang),
    }))
  }, [phases])

  return (
    <div className="w-full space-y-6">
      {/* Columns grid */}
      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
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
      <div className="flex gap-4 text-slate-400 text-xs max-sm:flex-col sm:gap-1">
        <p className="text-slate-400">
          {phases.length} graduatorie disponibili in totale.{" "}
        </p>
        <Tooltip delayDuration={100} useTouch={true}>
          <TooltipTrigger className="select-none rounded-xl border-dashed underline max-sm:border max-sm:py-3 dark:border-slate-600">
            Perché non trovo una graduatoria?
          </TooltipTrigger>
          <TooltipContent
            side={isMobile ? "top" : "bottom"}
            className="select-none bg-slate-300 dark:bg-slate-800 dark:text-slate-300"
          >
            <p className="max-w-[80vw] sm:max-w-120">
              Il Politecnico ha cambiato negli anni le modalità di pubblicazione
              delle graduatorie, oltre a eliminare molto rapidamente i file
              grezzi dai server pubblici, rendendo malfunzionante il nostro
              script di scraping e parsing. <br /> Durante i processi (lenti) di
              riscrittura/manutenzione dello script, alcune di queste
              graduatorie sono andate perse o mai individuate perché già
              eliminate.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
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
  return (
    <div className="overflow-hidden rounded-xl border-2 border-slate-200 bg-transparent dark:border-slate-700">
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
            <PhaseRankings group={group} school={school} year={year} />
          </div>
        ))}
        {groups.length === 0 && (
          <div className="px-4 py-6 text-center text-slate-600 italic dark:text-slate-400">
            Nessuna graduatoria presente
          </div>
        )}
      </div>
    </div>
  )
}

function PhaseRankings({
  group,
  school,
  year,
}: {
  group: PhaseGroup
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
                "rounded-lg border border-slate-300 px-3 py-1.5 text-center font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:no-underline dark:border-transparent dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/80"
              )}
            >
              {getRankingLabel(phase)}
            </Link>
          ))}
        </div>
      )}

      {/* Extra-UE rankings row with dashed border and label */}
      {extraEuPhases.length > 0 && (
        <div className="relative mt-3 rounded-lg border border-amber-500 border-dashed bg-amber-50/30 p-1.5 pt-2.5 dark:border-amber-700 dark:bg-amber-950/20">
          {/* Label */}
          <span className="-translate-y-1/2 absolute top-0 left-2.5 rounded-lg bg-amber-300/20 px-1.5 font-medium text-amber-600 text-xs dark:bg-slate-800 dark:text-amber-500">
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
                  "rounded-lg border border-slate-300 px-3 py-1.5 text-center font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:no-underline dark:border-transparent dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/80"
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
    return "Generale"
  }
  return `${phase.secondary}ª`
}
