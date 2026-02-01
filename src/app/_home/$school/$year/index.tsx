import { useQuery } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import Page from "@/components/custom-ui/Page"
import { RankingSelector } from "@/components/Homepage/RankingSelector"
import PathBreadcrumb from "@/components/PathBreadcrumb"
import { useQueries } from "@/hooks/use-queries"
import type { PhaseLink } from "@/utils/types/data/phase"
import { isSchool } from "@/utils/types/data/school"

export const Route = createFileRoute("/_home/$school/$year/")({
  component: RouteComponent,
  params: {
    parse: ({ school, year }) => {
      if (isSchool(school)) return { school, year: parseInt(year, 10) }
      else throw redirect({ to: "/" })
    },
  },
})

function RouteComponent() {
  const { school, year } = Route.useParams()
  const queries = useQueries()
  const { data, isPending } = useQuery(queries.index)

  if (!data || isPending) return null

  const yearData = data[school]?.[year] ?? []
  const phases: PhaseLink[] = yearData.map((entry) => ({
    ...entry.phase,
    id: entry.id,
  }))

  return (
    <Page>
      <PathBreadcrumb />
      <div className="w-full space-y-6">
        <div className="space-y-1">
          <h2 className="font-semibold text-3xl text-slate-900 dark:text-slate-100">
            Seleziona graduatoria
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Scegli la graduatoria da consultare per{" "}
            <span className="font-medium">{school}</span> {year}
          </p>
        </div>

        <RankingSelector phases={phases} school={school} year={year} />
      </div>
    </Page>
  )
}
