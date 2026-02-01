import { AiOutlineBulb } from "react-icons/ai"
import type { BySchoolYearIndex } from "@/utils/types/data/ranking"
import type { School } from "@/utils/types/data/school"

type Props = {
  data: BySchoolYearIndex
  schoolFilter?: School
}

function getStats(data: BySchoolYearIndex, schoolFilter?: School) {
  const years = new Set<number>()
  let totalRankings = 0

  const filtered = schoolFilter ? { [schoolFilter]: data[schoolFilter] } : data

  for (const schoolData of Object.values(filtered)) {
    for (const [year, rankings] of Object.entries(schoolData)) {
      years.add(Number(year))
      totalRankings += rankings.length
    }
  }

  const sortedYears = [...years].sort((a, b) => a - b)

  return {
    yearCount: years.size,
    minYear: sortedYears[0],
    maxYear: sortedYears[sortedYears.length - 1],
    totalRankings,
  }
}

export function ArchiveTip({ data, schoolFilter }: Props) {
  const stats = getStats(data, schoolFilter)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-linear-to-br from-indigo-50 via-white to-purple-50 p-5 dark:border-indigo-900/50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/30">
      {/* Decorative background elements */}
      <div className="-top-12 -right-12 absolute h-32 w-32 rounded-full bg-indigo-200/30 blur-2xl dark:bg-indigo-500/10" />
      <div className="-bottom-8 -left-8 absolute h-24 w-24 rounded-full bg-purple-200/30 blur-2xl dark:bg-purple-500/10" />

      <div className="relative flex items-center gap-2">
        {/* Stats line with pill badges */}
        <AiOutlineBulb
          size={18}
          className="text-yellow-600 dark:text-yellow-200"
        />
        <p className="text-slate-700 text-sm leading-relaxed dark:text-slate-300">
          L'archivio{" "}
          {schoolFilter && <span className="font-bold">{schoolFilter}</span>}{" "}
          contiene{" "}
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 font-semibold text-indigo-700 text-xs dark:bg-indigo-900/50 dark:text-indigo-300">
            {stats.totalRankings} graduatorie
          </span>{" "}
          distribuite su{" "}
          <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 font-semibold text-purple-700 text-xs dark:bg-purple-900/50 dark:text-purple-300">
            {stats.yearCount} anni
          </span>{" "}
          <span className="whitespace-nowrap text-slate-500 dark:text-slate-400">
            ({stats.minYear} - {stats.maxYear})
          </span>
        </p>

        {/* Warning with subtle styling -- TODO: hidden for now, maybe readd it later (hidden -> flex) */}
        <p className="hidden items-center gap-1.5 text-slate-500 text-xs dark:text-slate-400">
          <svg
            className="h-3.5 w-3.5 shrink-0 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Alcune graduatorie potrebbero non essere disponibili per determinati
          anni o fasi.
        </p>
      </div>
    </div>
  )
}
