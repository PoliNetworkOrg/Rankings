import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { MdDownload } from "react-icons/md"
import { useNavigate, useParams } from "@tanstack/router"
import MobileContext from "@/contexts/MobileContext"
import DataContext from "@/contexts/DataContext.tsx"
import School from "@/utils/types/data/School.ts"
import Ranking from "@/utils/types/data/parsed/Ranking/index.ts"
import CourseTable from "@/utils/types/data/parsed/Ranking/CourseTable.ts"
import { PhaseLink } from "@/utils/types/data/parsed/Index/RankingFile.ts"
import { ABS_ORDER } from "@/utils/constants.ts"
import Store from "@/utils/data/store.ts"
import { Button } from "@/components/ui/button"
import Spinner from "@/components/custom-ui/Spinner.tsx"
import Page from "@/components/custom-ui/Page.tsx"
import Table from "./Table.tsx"
import ViewHeader from "./Header.tsx"
import PhaseSelect from "./PhaseSelect.tsx"
import { CourseCombobox } from "./CourseCombobox.tsx"
import LocationsSelect from "./LocationSelect.tsx"

export default function Viewer() {
  const { school, year, phase } = useParams()
  const { data } = useContext(DataContext)
  const [ranking, setRanking] = useState<Ranking | undefined>()

  const getRanking = useCallback(async () => {
    if (!school || !year || !phase) return undefined
    return await data.loadRanking(school as School, parseInt(year), phase)
  }, [data, phase, school, year])

  const navigate = useNavigate()
  useEffect(() => {
    getRanking().then(r => {
      if (r) setRanking(r)
      else {
        if (!school) navigate({ to: "/" })
        else if (school && !year)
          navigate({ to: "/view/$school", params: { school } })
        else if (school && year)
          navigate({ to: "/view/$school/$year", params: { school, year } })
      }
    })
  }, [getRanking, navigate, school, year])

  if (!year || !school || !phase) return <></>
  if (!ranking) return <Spinner />

  return <Outlet ranking={ranking} />
}

type OutletProps = {
  ranking: Ranking
}

function Outlet({ ranking }: OutletProps) {
  const { school, year, phase } = useParams()
  const { isMobile } = useContext(MobileContext)
  const { data } = useContext(DataContext)
  const navigate = useNavigate()

  const store = useMemo(() => new Store(ranking), [ranking])

  const courses = store.getCourses()
  const [selectedCourse, setSelectedCourse] = useState<string>(ABS_ORDER)

  const locations = useMemo(
    () => courses.get(selectedCourse)?.locations ?? [],
    [courses, selectedCourse]
  )
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>()
  useEffect(() => {
    if (locations[0] && !selectedLocation)
      setSelectedLocation(locations[0].value)
  }, [locations, selectedLocation])

  const [phasesLinks, setPhasesLinks] = useState<PhaseLink[] | undefined>()
  const currentPhase = useMemo(
    () => phasesLinks?.find(v => v.href === phase),
    [phase, phasesLinks]
  )
  const handleSwitchPhase = (href: string) => {
    const validHref = phasesLinks?.find(
      p => p.href.toLowerCase() === href.toLowerCase()
    )?.href

    if (validHref && school && year && phase)
      navigate({
        to: "/view/$school/$year/$phase",
        params: { school, year, phase }
      })
  }

  const table = useMemo(
    () => store.getTable(selectedCourse, selectedLocation),
    [selectedCourse, selectedLocation, store]
  )
  const csv = useMemo(() => (table ? Store.tableToCsv(table) : ""), [table])

  useEffect(() => {
    if (!table || !school || !year) return
    if (selectedCourse === ABS_ORDER) {
      const phasesLinks = data.getPhasesLinks(school as School, parseInt(year))
      setPhasesLinks(phasesLinks)
    } else {
      const phasesLinks = data.getCoursePhasesLinks(
        ranking,
        table as CourseTable
      )
      setPhasesLinks(phasesLinks)
    }
  }, [data, ranking, school, selectedCourse, table, year])

  return (
    school &&
    year &&
    phase && (
      <Page
        className={`flex gap-4 px-4 ${
          isMobile
            ? "flex-col overflow-y-auto overflow-x-hidden"
            : "max-h-[calc(100vh-97px)] overflow-hidden"
        }`}
        fullWidth
      >
        <ViewHeader ranking={ranking} />
        <div className="flex w-full max-sm:flex-col max-sm:gap-4">
          <PhaseSelect
            value={phase}
            onChange={handleSwitchPhase}
            phasesLinks={phasesLinks}
          />
        </div>
        <div className="flex w-full gap-4 max-sm:flex-col">
          <div className="flex flex-1 gap-8 max-sm:flex-col max-sm:gap-4">
            <CourseCombobox
              courses={courses}
              value={selectedCourse}
              onSelect={setSelectedCourse}
            />
            {selectedLocation && (
              <LocationsSelect
                value={selectedLocation}
                locations={locations}
                onChange={setSelectedLocation}
              />
            )}
          </div>
          <div>
            <Button
              variant="secondary"
              onClick={() =>
                downloadCsv(csv, `${selectedCourse}_${selectedLocation ?? "0"}`)
              }
            >
              <MdDownload size={20} />
              Download CSV
            </Button>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 overflow-x-auto">
          {currentPhase?.name === ranking.phase ? (
            <div className="col-start-1 col-end-3 row-start-1 row-end-2 overflow-y-auto scrollbar-thin">
              {table && table.rows.length > 0 ? (
                <Table school={school as School} rows={table.rows} />
              ) : (
                <p>Nessun dato disponibile</p>
              )}
            </div>
          ) : (
            <div className="col-start-1 col-end-3">
              <Spinner />
            </div>
          )}
        </div>
      </Page>
    )
  )
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = (filename ?? "data") + ".csv"
  a.click()

  a.remove()

  window.URL.revokeObjectURL(url)
}
