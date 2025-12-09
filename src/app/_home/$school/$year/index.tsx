import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import Page from "@/components/custom-ui/Page"
import PhaseFlag from "@/components/custom-ui/PhaseFlag"
import { ButtonGrid } from "@/components/Homepage/ButtonGrid"
import PathBreadcrumb from "@/components/PathBreadcrumb"
import { Button } from "@/components/ui/button"
import { getPhaseGroups, phaseGroupLabel, phaseLinkLabel } from "@/utils/phase"
import type { PhaseLink } from "@/utils/types/data/phase"
import type { BySchoolYearIndex } from "@/utils/types/data/ranking"
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
  const yearData = data[school]?.[year] ?? []

  const groups = getPhaseGroups(yearData).entriesArr()

  return (
    <Page>
      <PathBreadcrumb />
      <p className="w-full text-xl">Scegli una graduatoria</p>
      {groups.map(([n, phases]) => (
        <Group
          key={`phasegroup-${n}`}
          primary={n}
          phases={phases}
          showGeneral={groups.length > 1}
        />
      ))}
    </Page>
  )
}

type GroupProps = {
  primary: number
  phases: PhaseLink[]
  showGeneral: boolean
}

function Group({ primary, phases, showGeneral }: GroupProps) {
  const { school, year } = Route.useParams()
  return (
    <>
      {(showGeneral || primary !== 0) && <p>{phaseGroupLabel(primary)}</p>}
      <ButtonGrid length={phases.length}>
        {phases.map((phase) => (
          <Link
            to="/$school/$year/$id"
            params={{ school, year, id: phase.id }}
            key={phase.id}
            className="h-full"
          >
            <Button
              size="card"
              variant="secondary"
              className="relative h-full w-full"
            >
              <span className="whitespace text-base">
                {phaseLinkLabel(phase)}
              </span>
              <div className="absolute right-0 bottom-0 flex overflow-hidden rounded-tl-lg">
                <div className="bg-slate-700 px-3 py-1">
                  <PhaseFlag phase={phase} />
                </div>
              </div>
            </Button>
          </Link>
        ))}
      </ButtonGrid>
    </>
  )
}
