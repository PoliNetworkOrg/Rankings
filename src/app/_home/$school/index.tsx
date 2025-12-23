import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import Page from "@/components/custom-ui/Page"
import PathBreadcrumb from "@/components/PathBreadcrumb"
import { Badge } from "@/components/ui/badge"
import { useQueries } from "@/hooks/use-queries"
import { isSchool } from "@/utils/types/data/school"
import { cn } from "@/utils/ui"

export const Route = createFileRoute("/_home/$school/")({
  component: RouteComponent,
  params: {
    parse: ({ school }) => {
      if (isSchool(school)) return { school }
      else throw redirect({ to: "/" })
    },
  },
})

function RouteComponent() {
  const { school } = Route.useParams()
  const queries = useQueries()
  const { data, isPending } = useQuery(queries.index)

  if (!data || isPending) return null
  const years = Object.keys(data[school] ?? {})
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <Page>
      <PathBreadcrumb />
      <div className="space-y-1">
        <h2 className="font-semibold text-slate-900 text-xl dark:text-slate-100">
          Anno di immatricolazione
        </h2>
        <p className="text-slate-600 text-sm dark:text-slate-400">
          Seleziona l'anno accademico di cui vuoi consultare le graduatorie
        </p>
      </div>

      <div className="flex max-sm:grid grid-cols-2 flex-wrap gap-3 w-full">
        {years.map((year, index) => {
          const isFirst = index === 0

          return (
            <Link
              key={year}
              to="/$school/$year"
              params={{ school, year }}
              className="group"
            >
              <Badge
                size="large"
                variant="secondary"
                className={cn(
                  "cursor-pointer border transition-all hover:bg-slate-200 dark:hover:bg-slate-700/80 justify-center w-full",
                  isFirst
                    ? "border-amber-700/30 shadow-[0px_2px_10px_#ffae1082,inset_0px_-4px_20px_#ffb52575] dark:border-amber-200/90 dark:shadow-[0px_3px_8px_rgba(186,130,21,0.32),inset_0px_-4px_20px_rgba(186,130,21,0.43)]"
                    : ""
                )}
              >
                {year}
              </Badge>
            </Link>
          )
        })}
      </div>

      {years.length > 0 && (
        <p className="text-slate-500 text-xs dark:text-slate-500">
          {years.length}{" "}
          {years.length === 1 ? "anno disponibile" : "anni disponibili"} dal{" "}
          {years[years.length - 1]} al {years[0]}
        </p>
      )}
    </Page>
  )
}
