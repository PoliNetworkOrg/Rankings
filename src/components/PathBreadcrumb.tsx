import { useQueries } from "@/hooks/use-queries"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link, useParams } from "@tanstack/react-router"
import { LuArrowRight, LuHouse } from "react-icons/lu"
import { Badge } from "./ui/badge"
import { numberToRoman } from "@/utils/strings/numbers"
import PhaseFlag from "./custom-ui/PhaseFlag"
import { cn } from "@/utils/ui"

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

  const q = useQueries()
  const ranking = params.id ? useSuspenseQuery(q.ranking(params.id)) : null

  return (
    <div className="flex h-8 w-full items-center gap-2 text-lg">
      <Link to="/">
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
      {ranking && ranking.data && (
        <>
          <LuArrowRight size={18} />
          <Badge variant="outline" className={cn("px-1 gap-1", ranking.data.phase.language === "IT" ? "border-green-500 dark:border-green-700" : "border-blue-300 dark:border-blue-700")}>
            <Badge variant="secondary" className={cn("gap-2 pointer-events-none", ranking.data.phase.language === "IT" ?
              "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
            )} >
              <PhaseFlag phase={ranking.data.phase} />
              {ranking.data.phase.primary === 0 ? "Fase Generale" : `${numberToRoman(ranking.data.phase.primary)} Fase`}
            </Badge>
            <Badge variant="secondary" >
              {numberToRoman(ranking.data.phase.secondary)} Grad.
            </Badge>
            {ranking.data.phase.isExtraEu && <Badge className="dark:border-amber-500 dark:text-amber-500" variant="outline">Extra-EU</Badge>}
          </Badge>
        </>
      )
      }
    </div >
  )
}
