import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import Alert from "@/components/custom-ui/Alert"
import Page from "@/components/custom-ui/Page"
import Spinner from "@/components/custom-ui/Spinner"
import { ButtonGrid } from "@/components/Homepage/ButtonGrid"
import { SchoolEmoji } from "@/components/school-emoji"
import { Button } from "@/components/ui/button"
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
      <div className="flex w-full flex-1 flex-col items-start gap-4 py-4">
        <h3 className="w-full font-bold text-2xl">
          👋 Ciao!{" "}
          <span className="whitespace-nowrap">Questo sito raccoglie</span>{" "}
          <span className="whitespace-nowrap">lo storico</span>{" "}
          <span className="whitespace-nowrap">delle graduatorie</span>{" "}
          <span className="whitespace-nowrap">del Politecnico di Milano.</span>
        </h3>
        <p className="w-full text-xl">
          Inizia scegliendo l'area di studi di tuo interesse
        </p>
        {schools && (
          <ButtonGrid length={schools.length}>
            {schools.map((school) => (
              <Link
                to="/$school"
                params={{ school }}
                key={school}
                className="h-full"
              >
                <Button
                  size="card"
                  variant="secondary"
                  className="h-full w-full"
                >
                  <SchoolEmoji school={school} />
                  <span className="text-lg">{school}</span>
                </Button>
              </Link>
            ))}
          </ButtonGrid>
        )}
        {isPending && <Spinner />}
        {error instanceof Error && <Alert level="error">{error.message}</Alert>}
      </div>
    </Page>
  )
}
