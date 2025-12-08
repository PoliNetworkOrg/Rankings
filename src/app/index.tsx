import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import Page from "@/components/custom-ui/Page"
import { ButtonGrid } from "@/components/Homepage/ButtonGrid"
import { Button } from "@/components/ui/button"
import type { BySchoolYearIndex } from "@/utils/types/data/json/new-ranking"
import type { School } from "@/utils/types/data/school"

function getSchoolEmoji(school: School) {
  switch (school) {
    case "Architettura":
      return <span className="mr-2 rotate-270 text-lg">&#128208;</span>
    case "Design":
      return <span className="mr-2 text-lg">&#128396;&#65039;</span>
    case "Ingegneria":
      return <span className="mr-2 text-lg">&#128736;&#65039;</span>
    case "Urbanistica":
      return <span className="mr-2 text-lg">&#127969;</span>
  }
}

export const Route = createFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useQuery({
    queryKey: ["index"],
    queryFn: async () => {
      const res = await fetch(
        "http://localhost:6767/output/indexes/bySchoolYear.json"
      )
      return res.json() as Promise<BySchoolYearIndex>
    },
  })

  if (!data) return null
  const schools = Object.keys(data) as (keyof typeof data)[]
  return (
    <Page>
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
      <ButtonGrid length={schools.length}>
        {schools.map((school) => (
          <Link
            to="/$school"
            params={{ school }}
            key={school}
            className="h-full"
          >
            <Button size="card" variant="secondary" className="h-full w-full">
              {getSchoolEmoji(school)}
              <span className="text-lg">{school}</span>
            </Button>
          </Link>
        ))}
      </ButtonGrid>
      {/* {isDev && <DevSettings stableData={data} mainData={devData} />} */}
    </Page>
  )
}
