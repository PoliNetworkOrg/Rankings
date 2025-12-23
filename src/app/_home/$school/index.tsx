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

  const currentYear = new Date().getFullYear()

  return (
    <Page>
      <PathBreadcrumb />
      <div className="w-full space-y-4">
        <div className="space-y-1">
          <h2 className="font-semibold text-slate-900 text-xl dark:text-slate-100">
            Anno di immatricolazione
          </h2>
          <p className="text-slate-600 text-sm dark:text-slate-400">
            Seleziona l'anno accademico di cui vuoi consultare le graduatorie
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {years.map((year, index) => {
            const isRecent = year >= currentYear - 1
            const isFirst = index === 0

            return (
              <Link
                key={year}
                to="/$school/$year"
                params={{ school, year }}
                className="group"
              >
                <Badge
                  variant={isFirst ? "default" : "secondary"}
                  size="medium"
                  className={cn(
                    "cursor-pointer transition-all",
                    "hover:scale-105",
                    isFirst &&
                      "ring-2 ring-slate-900/20 dark:ring-slate-100/20",
                    isRecent && !isFirst && "border-green-500/30"
                  )}
                >
                  {year}
                  {isRecent && (
                    <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-green-500" />
                  )}
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
      </div>
    </Page>
  )
}
