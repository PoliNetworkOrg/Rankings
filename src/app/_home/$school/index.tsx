import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import Page from "@/components/custom-ui/Page"
import { ArchiveTip } from "@/components/Homepage/ArchiveTip"
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
        <h2 className="font-semibold text-3xl text-slate-900 dark:text-slate-100">
          Anno di immatricolazione
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Seleziona l'anno accademico di cui vuoi consultare le graduatorie
        </p>
      </div>

      <div className="mx-auto my-6 flex w-full flex-col gap-3 rounded-xl border border-slate-600 bg-slate-300/20 p-4 sm:gap-6 sm:p-8 lg:max-w-3xl dark:border-slate-800 dark:bg-slate-800/20">
        <div className="mx-auto grid w-full max-w-3xl grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3 gap-y-4 sm:gap-4">
          {years.map((year, index) => {
            const isFirst = index === 0
            return (
              <Link
                key={year}
                to="/$school/$year"
                params={{ school, year }}
                className={`group ${isFirst ? "-col-end-1 col-start-1" : ""}`}
              >
                <Badge
                  size="large"
                  variant="outline"
                  className={cn(
                    "w-full cursor-pointer justify-center border transition-all hover:no-underline",
                    isFirst
                      ? "border-[#1156ae]/70 bg-[#1156ae]/20 py-5 hover:bg-[#1156ae]/50 dark:border-[#1156ae]/80 dark:bg-[#1156ae]/20 dark:hover:bg-[#1156ae]/80"
                      : "border-slate-300 hover:bg-slate-200 dark:border-slate-700 dark:hover:bg-slate-700/80"
                  )}
                >
                  {year}
                </Badge>
              </Link>
            )
          })}
        </div>

        {years.length > 0 && (
          <p className="self-center text-center text-slate-500 text-xs dark:text-slate-500">
            {years.length}{" "}
            {years.length === 1 ? "anno disponibile" : "anni disponibili"} dal{" "}
            {years[years.length - 1]} al {years[0]}
          </p>
        )}
      </div>

      <div className="mt-auto flex w-full flex-col items-center justify-center gap-4">
        <ArchiveTip data={data} schoolFilter={school} />
      </div>
    </Page>
  )
}
