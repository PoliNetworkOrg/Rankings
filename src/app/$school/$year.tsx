import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import PhaseFlag from "@/components/custom-ui/PhaseFlag"
import { ButtonGrid } from "@/components/Homepage/ButtonGrid"
import { Button } from "@/components/ui/button"
import CustomMap from "@/utils/CustomMap"
import { NO_GROUP } from "@/utils/constants"
import { capitaliseWords } from "@/utils/strings/capitalisation"
import { numberToOrdinalString } from "@/utils/strings/numbers"
import type { BySchoolYearIndex } from "@/utils/types/data/json/new-ranking"
import type { PhaseGroup } from "@/utils/types/data/parsed/Index/RankingFile"
import { isSchool } from "@/utils/types/data/school"

export const Route = createFileRoute("/$school/$year")({
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

  const groupsMap = yearData.reduce<CustomMap<number, PhaseGroup>>(
    (acc, { phase }) => {
      const phaseIdx = phase.primary
      const g = acc.get(phaseIdx)
      if (g) {
        g.phases.push(phase)
      } else {
        const value = phaseIdx
          ? `${numberToOrdinalString(phaseIdx, "a")} fase`
          : NO_GROUP
        const label = capitaliseWords(value)
        acc.set(phaseIdx, { label, value, phases: [phase] })
      }
      return acc
    },
    new CustomMap()
  )

  const groupsArr = groupsMap.valuesArr()

  return (
    <>
      <p className="w-full text-xl">Scegli una graduatoria</p>
      {groupsArr
        .sort((a, b) => {
          if (a.value === NO_GROUP) return 1
          if (b.value === NO_GROUP) return -1
          return 0
        })
        .map((group) => (
          <Group
            key={group.value}
            group={group}
            showGeneral={groupsArr.length > 1}
          />
        ))}
    </>
  )
}

type GroupProps = {
  group: PhaseGroup
  showGeneral: boolean
}

function Group({ group, showGeneral }: GroupProps) {
  const { phases } = group

  return (
    <>
      {(group.value !== NO_GROUP ||
        (group.value === NO_GROUP && showGeneral)) && <p>{group.label}</p>}
      <ButtonGrid length={phases.length}>
        {phases.map((phase, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: defined in static JSON
          <Link to="/" key={i} className="h-full">
            <Button
              size="card"
              variant="secondary"
              className="relative h-full w-full"
            >
              <span className="whitespace text-base">
                {capitaliseWords(numberToOrdinalString(phase.secondary, "a"))}{" "}
                Graduatoria
                {phase.isExtraEu ? " (Extra-UE)" : ""}
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
