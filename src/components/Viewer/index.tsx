import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  MdNavigateBefore as PrevIcon,
  MdNavigateNext as NextIcon,
  MdDownload
} from "react-icons/md"
import ReactPaginate from "react-paginate"
import { useNavigate } from "react-router-dom"
import MobileContext from "../../contexts/MobileContext"
import Page from "../custom-ui/Page.tsx"
import DataContext from "../../contexts/DataContext.tsx"
import School from "../../utils/types/data/School.ts"
import Ranking from "../../utils/types/data/parsed/Ranking/index.ts"
import Spinner from "../custom-ui/Spinner.tsx"
import Table from "./Table.tsx"
import { ABS_ORDER } from "../../utils/constants.ts"
import usePaginate from "../../hooks/usePaginate.ts"
import StudentResult from "../../utils/types/data/parsed/Ranking/StudentResult.ts"
import CourseTable from "../../utils/types/data/parsed/Ranking/CourseTable.ts"
import ViewHeader from "./Header.tsx"
import { Button } from "@/components/ui/button"
import PhaseSelect from "./PhaseSelect.tsx"
import { PhaseLink } from "../../utils/types/data/parsed/Index/RankingFile.ts"
import { CourseCombobox } from "./CourseCombobox.tsx"
import LocationsSelect from "./LocationSelect.tsx"
import Store from "@/utils/data/store.ts"

type Props = {
  school: School
  year: number
  phase: string
}

export default function Viewer({ school, year, phase }: Props) {
  const { data } = useContext(DataContext)
  const [ranking, setRanking] = useState<Ranking | undefined>()

  const getRanking = useCallback(async () => {
    return await data.loadRanking(school, year, phase)
  }, [data, phase, school, year])

  const navigate = useNavigate()
  useEffect(() => {
    getRanking()
      .then(r => setRanking(r))
      .catch(err => {
        console.error(err)
        navigate("..", { relative: "path" })
      })
  }, [getRanking, navigate])

  if (!ranking) return <Spinner />

  return <Outlet ranking={ranking} school={school} year={year} phase={phase} />
}

type OutletProps = Props & {
  ranking: Ranking
}

function Outlet({ school, year, ranking, phase }: OutletProps) {
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

    if (validHref) navigate(`../${validHref}`, { relative: "path" })
  }

  const table = useMemo(
    () => store.getTable(selectedCourse, selectedLocation),
    [selectedCourse, selectedLocation, store]
  )
  const csv = useMemo(() => (table ? Store.tableToCsv(table) : ""), [table])

  const { rows, pageCount, handlePageClick } = usePaginate<StudentResult[]>({
    data: table?.rows ?? [],
    itemsPerPage: 400
  })

  useEffect(() => {
    if (!table) return
    if (selectedCourse === ABS_ORDER) {
      const phasesLinks = data.getPhasesLinks(school, year)
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

      <div
        className={
          isMobile
            ? "flex w-full flex-col gap-4 overflow-x-auto"
            : "grid w-full grid-cols-[20%_auto] grid-rows-[1fr_auto] gap-4 overflow-y-hidden"
        }
      >
        {currentPhase?.name === ranking.phase ? (
          <>
            <div className="col-start-1 col-end-3 row-start-1 row-end-2 overflow-y-auto scrollbar-thin">
              {table && table.rows.length > 0 ? (
                <Table school={school} rows={rows} />
              ) : (
                <p>Nessun dato disponibile</p>
              )}
            </div>
            <div className="col-start-2 col-end-3 row-start-2 row-end-3">
              {pageCount > 1 && (
                <ReactPaginate
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  renderOnZeroPageCount={null}
                  breakLabel="..."
                  pageRangeDisplayed={1}
                  marginPagesDisplayed={2}
                  className="react-paginate mx-auto my-2"
                  previousLabel={<PrevIcon className="inline-flex" size={24} />}
                  nextLabel={<NextIcon className="inline-flex" size={24} />}
                />
              )}
            </div>
          </>
        ) : (
          <div className="col-start-1 col-end-3">
            <Spinner />
          </div>
        )}
      </div>
    </Page>
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
