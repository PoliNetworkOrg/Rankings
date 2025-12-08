import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { useState } from "react"
import Page from "@/components/custom-ui/Page"
import Spinner from "@/components/custom-ui/Spinner"
import { ButtonGrid } from "@/components/Homepage/ButtonGrid"
import { Button } from "@/components/ui/button"
import type { BySchoolYearIndex } from "@/utils/types/data/json/new-ranking"
import { isSchool } from "@/utils/types/data/school"
import PathBreadcrumb from "@/components/PathBreadcrumb"

export const Route = createFileRoute("/$school/")({
  component: RouteComponent,
  params: {
    parse: ({ school }) => {
      if (isSchool(school)) return { school }
      else throw redirect({ to: "/" })
    },
  },
})

function RouteComponent() {
  const [clicked, setClicked] = useState(false)
  const { school } = Route.useParams()
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
  const years = Object.keys(data[school] ?? {}).map(Number)

  return clicked ? (
    <div className="w-full">
      <Spinner />
    </div>
  ) : (
    <Page>
      <PathBreadcrumb />
      <p className="w-full text-xl">Scegli un anno di immatricolazione</p>
      <ButtonGrid length={years.length}>
        {years
          .sort((a, b) => b - a)
          .map((year) => (
            <Link
              to="/$school/$year"
              params={{ school, year }}
              key={year}
              className="h-full"
              onClick={() => setClicked(true)}
            >
              <Button size="card" variant="secondary" className="h-full w-full">
                <span className="text-lg">{year}</span>
              </Button>
            </Link>
          ))}
      </ButtonGrid>
    </Page>
  )
}
