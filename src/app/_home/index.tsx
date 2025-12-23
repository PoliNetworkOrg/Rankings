import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import Alert from "@/components/custom-ui/Alert"
import Page from "@/components/custom-ui/Page"
import Spinner from "@/components/custom-ui/Spinner"
import { ArchiveTip } from "@/components/Homepage/ArchiveTip"
import { SchoolCard } from "@/components/Homepage/SchoolCard"
import { useQueries } from "@/hooks/use-queries"

export const Route = createFileRoute("/_home/")({
  component: RouteComponent,
})

function RouteComponent() {
  const queries = useQueries()
  const { data, isPending, error } = useQuery(queries.index)

  const schools = data
    ? (Object.keys(data) as (keyof typeof data)[])
    : undefined

  return (
    <Page>
      <div className="flex w-full flex-1 flex-col items-start gap-6 py-4">
        <div className="space-y-2">
          <h1 className="font-bold text-2xl text-slate-900 tracking-tight sm:text-3xl dark:text-slate-100">
            Storico Graduatorie PoliMi
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Consulta le graduatorie storiche del Politecnico di Milano.
            Seleziona un'area di studi per iniziare.
          </p>
        </div>

        {schools && data && (
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            {schools.map((school) => (
              <SchoolCard key={school} school={school} />
            ))}
          </div>
        )}

        {isPending && (
          <div className="flex w-full justify-center py-12">
            <Spinner />
          </div>
        )}
        {error instanceof Error && <Alert level="error">{error.message}</Alert>}

        <div className="flex-1"></div>
        <div className="flex w-full justify-center">
          {data && <ArchiveTip data={data} />}
        </div>
      </div>
    </Page>
  )
}
