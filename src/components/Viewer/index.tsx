import { useCallback, useContext, useEffect, useState } from "react"
import {
  MdNavigateBefore as PrevIcon,
  MdNavigateNext as NextIcon,
  MdDownload
} from "react-icons/md"
import ReactPaginate from "react-paginate"
import MobileContext from "../../contexts/MobileContext"
import Page from "../ui/Page.tsx"
import DataContext from "../../contexts/DataContext.tsx"
import School from "../../utils/types/data/School.ts"
import Ranking from "../../utils/types/data/parsed/Ranking/index.ts"
import Spinner from "../ui/Spinner.tsx"
import Store from "../../utils/data/store.ts"
import DynamicSelect from "../ui/DynamicSelect.tsx"
import Table from "./Table.tsx"
import { ABS_ORDER } from "../../utils/constants.ts"
import usePaginate from "../../hooks/usePaginate.ts"
import StudentResult from "../../utils/types/data/parsed/Ranking/StudentResult.ts"
import MeritTable from "../../utils/types/data/parsed/Ranking/MeritTable.ts"
import CourseTable from "../../utils/types/data/parsed/Ranking/CourseTable.ts"
import ViewHeader from "./Header.tsx"
import Button from "../ui/Button.tsx"
import PhaseSelector from "./PhaseSelector.tsx"
import { PhaseLink } from "../../utils/types/data/parsed/Index/RankingFile.ts"
import { useNavigate, useParams } from "@tanstack/router"

export default function Viewer() {
  const { school, year, phase } = useParams()
  const { data } = useContext(DataContext)
  const [ranking, setRanking] = useState<Ranking | undefined>()
  const [selectedCourse, setSelectedCourse] = useState<string>(ABS_ORDER)

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

  const store = new Store(ranking)
  const coursesName = [ABS_ORDER, ...store.getCourseNames()]

  const handleCourseSwitch = (name: string) => setSelectedCourse(name)
  const table = store.getTable(selectedCourse)

  if (!table) return <Spinner />
  const csv = Store.tableToCsv(table)

  return (
    <Outlet
      ranking={ranking}
      school={school as School}
      year={parseInt(year)}
      phase={phase}
      table={table}
      coursesName={coursesName}
      selectedCourse={selectedCourse}
      handleCourseSwitch={handleCourseSwitch}
      csv={csv}
    />
  )
}

type OutletProps = {
  school: School
  year: number
  phase: string
  table: MeritTable | CourseTable
  handleCourseSwitch: (name: string) => void
  coursesName: string[]
  selectedCourse: string
  csv: string
  ranking: Ranking
}

function Outlet({
  school,
  year,
  table,
  handleCourseSwitch,
  coursesName,
  selectedCourse,
  csv,
  ranking
}: OutletProps) {
  const { isMobile } = useContext(MobileContext)
  const { data } = useContext(DataContext)
  const { rows, pageCount, handlePageClick } = usePaginate<StudentResult[]>({
    data: table.rows ?? [],
    itemsPerPage: 400
  })

  const [phasesLinks, setPhasesLinks] = useState<PhaseLink[] | undefined>()

  useEffect(() => {
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

  function handleCsvDownload() {
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = (selectedCourse ?? "data") + ".csv"
    a.click()

    a.remove()

    window.URL.revokeObjectURL(url)
  }

  return (
    <Page
      className={`flex gap-4 px-2 ${
        isMobile
          ? "flex-col overflow-y-auto overflow-x-hidden"
          : "max-h-[calc(100vh-97px)] overflow-hidden"
      }`}
      fullWidth
    >
      <ViewHeader />
      <div className="flex w-full justify-between max-sm:flex-col max-sm:gap-4">
        <PhaseSelector phasesLinks={phasesLinks} />
        <div className="pl-4">
          <Button circle onClick={handleCsvDownload}>
            <MdDownload size={20} />
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
        <div className="col-start-1 col-end-2 row-start-1 row-end-3">
          <DynamicSelect
            options={coursesName}
            onOptionSelect={handleCourseSwitch}
            value={selectedCourse}
            useColumn
          />
        </div>
        <div className="col-start-2 col-end-3 row-start-1 row-end-2 overflow-y-auto scrollbar-thin">
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
      </div>
    </Page>
  )
}
