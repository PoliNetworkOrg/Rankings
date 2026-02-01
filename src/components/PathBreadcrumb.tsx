import { useSuspenseQuery } from "@tanstack/react-query"
import { Link, useParams } from "@tanstack/react-router"
import { Suspense } from "react"
import { LuArrowRight, LuHouse } from "react-icons/lu"
import { useQueries } from "@/hooks/use-queries"
import { numberToRoman } from "@/utils/strings/numbers"
import { cn } from "@/utils/ui"
import PhaseFlag from "./custom-ui/PhaseFlag"
import { Badge } from "./ui/badge"

export default function PathBreadcrumb() {
  const params = useParams({
    shouldThrow: false,
    strict: false,
    select({ school, year, id }) {
      return { school, year, id }
    },
  })

  if (!params || !params.school) return null
  const { school, year } = params

  return (
    <div className="flex w-full items-center gap-2 text-lg max-sm:flex-col max-sm:items-start max-sm:gap-4">
      <div className="flex items-center gap-2 text-lg">
        <Link aria-label="Home" to="/">
          <LuHouse size={18} />
        </Link>
        <LuArrowRight size={18} />
        <Link to="/$school" params={{ school }}>
          {school}
        </Link>
        {year && (
          <>
            <LuArrowRight size={18} />
            <Link to="/$school/$year" params={{ school, year }}>
              {year}
            </Link>
          </>
        )}
      </div>
      {params.id && (
        <Suspense fallback={null}>
          <div className="flex items-center justify-center gap-2">
            <LuArrowRight size={18} />
            <RankingInfo id={params.id} withBadgeOutline />
          </div>
        </Suspense>
      )}
    </div>
  )
}

export function RankingInfo({
  id,
  extended,
  withBadgeOutline,
}: {
  id: string
  extended?: boolean
  withBadgeOutline?: boolean
}) {
  const q = useQueries()
  const ranking = useSuspenseQuery(q.ranking(id))

  if (ranking.error) return null

  const Content = () => (
    <>
      <Badge
        variant="secondary"
        className={cn(
          "pointer-events-none gap-2",
          ranking.data.phase.language === "IT"
            ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
            : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
        )}
      >
        <PhaseFlag phase={ranking.data.phase} />
        {ranking.data.phase.primary === 0
          ? "Fase Generale"
          : extended
            ? `${ranking.data.phase.primary}ª Fase`
            : `${numberToRoman(ranking.data.phase.primary)} Fase`}
      </Badge>
      <Badge variant="secondary">
        {ranking.data.phase.secondary
          ? extended
            ? `${ranking.data.phase.secondary}ª Graduatoria`
            : `${numberToRoman(ranking.data.phase.secondary)} Grad.`
          : extended
            ? "Graduatoria Generale"
            : "Generale"}
      </Badge>
      {ranking.data.phase.isExtraEu && (
        <Badge
          className="border-dashed dark:border-amber-500 dark:text-amber-500"
          variant="outline"
        >
          Extra-UE
        </Badge>
      )}
    </>
  )

  return withBadgeOutline ? (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 px-1",
        ranking.data.phase.language === "IT"
          ? "border-green-500 dark:border-green-700"
          : "border-blue-300 dark:border-blue-700"
      )}
    >
      <Content />
    </Badge>
  ) : (
    <Content />
  )
}
