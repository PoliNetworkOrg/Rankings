/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useContext, useEffect, useMemo, useState } from "react"
import ReactPaginate from "react-paginate"
import {
  MdNavigateBefore as PrevIcon,
  MdNavigateNext as NextIcon
} from "react-icons/md"
import DATA from "../../utils/data/data.json"
import Store from "../../utils/data/data.ts"
import { Course, Phase, School, Structure, TableData } from "../../utils/types"
import Table from "./Table"
import Spinner from "../ui/Spinner.tsx"
import Input from "../ui/Input"
import MobileContext from "../../contexts/MobileContext"
import useFilter from "../../hooks/useFilter.tsx"
import EnrollStats from "./EnrollStats.tsx"
import Page from "../ui/Page.tsx"
import usePaginate from "../../hooks/usePaginate.ts"
import DynamicSelect, { ButtonSelect } from "../ui/DynamicSelect.tsx"

const ABS_ORDER = "ABSOLUTE ORDER"

export default function Viewer() {
  const { isMobile } = useContext(MobileContext)
  const store = new Store(DATA as Structure)
  const data = store.data

  const schools: School[] = data.map(v => v.school)
  const [activeSchool, setActiveSchool] = useState<School>(schools[0])
  const school = data.find(v => v.school === activeSchool)!

  const yearsList = school.years.map(y => y.year).sort((a, b) => b - a)
  const [activeYear, setActiveYear] = useState<number>(
    yearsList.length > 0 ? yearsList[0] : -1
  )

  useEffect(() => {
    if (yearsList.length && !yearsList.includes(activeYear)) {
      setActiveYear(yearsList[0])
    }
  }, [activeYear, yearsList])

  const yearData = school.years.find(y => y.year === activeYear)

  const phases: Phase[] = useMemo(
    () => (yearData ? yearData.phases : []),
    [yearData]
  )
  const phasesList: string[] = phases.map(p => p.phase).sort()
  const [activePhase, setActivePhase] = useState<string>(
    phasesList.length > 0 ? phasesList[0] : ""
  )
  useEffect(() => {
    if (phases.length && !phases.find(p => p.phase === activePhase)) {
      setActivePhase(phasesList[0])
    }
  }, [activePhase, phases, phasesList])

  const phaseData: Phase | undefined = phases.find(p => p.phase === activePhase)

  const global = useMemo(
    () => (phaseData ? phaseData.global : [[]]),
    [phaseData]
  )

  const courses: Course[] = useMemo(() => {
    const courses: Course[] = []
    if (global[0].length) courses.push({ name: ABS_ORDER, table: global })

    // add courses from current phase
    phases
      ?.find(v => v.phase === activePhase)
      ?.courses.filter(c => c.table[0].length) // only course with data
      ?.map(c => courses.push(c))

    return courses
  }, [activePhase, global, phases])

  const coursesList: string[] = useMemo(
    () => courses.map(c => c.name),
    [courses]
  )
  const [activeCourse, setActiveCourse] = useState<string>(
    coursesList.length ? coursesList[0] : ""
  )
  const table: TableData =
    courses.find(c => c.name === activeCourse)?.table ?? []

  useEffect(() => {
    if (coursesList.length && !coursesList.includes(activeCourse)) {
      setActiveCourse(coursesList[0])
    }
  }, [activeCourse, coursesList])

  const { filterValue, filteredData, updateFilter } = useFilter<TableData>({
    data: table,
    delay: 200,
    filterFunction: (table, filter) =>
      table.filter(a =>
        a.join(" ").toLowerCase().includes(filter.toLowerCase())
      )
  })

  const [isLoading, setIsLoading] = useState<boolean>(true)
  useEffect(() => {
    if (!activeSchool) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [activeSchool])

  const { rows, pageCount, handlePageClick } = usePaginate<TableData>({
    data: filteredData,
    itemsPerPage: 400
  })

  // here starts data analysis
  const enrollStats = Store.enrollStats(table)

  return (
    <Page
      className={`px-2 ${
        isMobile
          ? "overflow-y-auto overflow-x-hidden"
          : "max-h-[calc(100vh-97px)] overflow-hidden"
      }`}
    >
      <ButtonSelect
        options={schools.sort()}
        value={activeSchool}
        onOptionSelect={o => setActiveSchool(o)}
      />
      <Spacer addMargin="y" />
      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : coursesList.length ? (
        <>
          <DynamicSelect
            options={yearsList.map(y => y.toString())}
            value={activeYear.toString()}
            onOptionSelect={o => setActiveYear(parseInt(o))}
          />
          <Spacer addMargin="y" />
          <DynamicSelect
            options={phasesList}
            value={activePhase}
            onOptionSelect={o => setActivePhase(o)}
          />
          <Spacer addMargin="y" />
          <div
            className={`grid w-full flex-grow items-start ${
              isMobile
                ? "grid-cols-1 grid-rows-[auto_auto_1fr]"
                : "min-h-0 grid-cols-[1fr_4fr] grid-rows-[auto_1fr_auto] "
            } `}
          >
            <div
              className={
                isMobile
                  ? "sticky top-[-1px] row-start-2 row-end-3 bg-white py-3 dark:bg-slate-900"
                  : "col-start-2 col-end-3 row-start-1 pb-4 pl-4"
              }
            >
              <EnrollStats stats={enrollStats} />
              <Input
                value={filterValue}
                onValue={updateFilter}
                placeholder="Filter..."
              />
            </div>
            <div
              className={`${
                isMobile
                  ? "row-start-1 row-end-2"
                  : "row-start-1 row-end-4 border-r border-slate-800/20 pr-2 dark:border-slate-300/20"
              } h-full w-auto`}
            >
              <DynamicSelect
                options={coursesList}
                value={activeCourse}
                onOptionSelect={setActiveCourse}
                useColumn
              />
              {isMobile && <Spacer addMargin="top" />}
            </div>
            <div
              className={`${
                isMobile
                  ? "row-start-3 row-end-4 w-full overflow-x-auto"
                  : "row-start-2 row-end-3 overflow-y-auto overflow-x-hidden pl-4 pr-2"
              } h-full scrollbar-thin`}
            >
              {filteredData ? (
                <Table
                  isGlobalRanking={activeCourse === ABS_ORDER}
                  school={activeSchool as School}
                  data={rows}
                />
              ) : (
                <p>Data not available for this year</p>
              )}
            </div>
            <div
              className={`${
                isMobile
                  ? "row-start-4 row-end-5 w-full"
                  : "row-start-3 row-end-4 overflow-y-auto overflow-x-hidden pl-4 pr-2"
              } h-full scrollbar-thin`}
            >
              {pageCount > 1 && (
                <ReactPaginate
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  renderOnZeroPageCount={null}
                  breakLabel="..."
                  pageRangeDisplayed={1}
                  marginPagesDisplayed={2}
                  className="react-paginate mx-auto my-4"
                  previousLabel={<PrevIcon className="inline-flex" size={24} />}
                  nextLabel={<NextIcon className="inline-flex" size={24} />}
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </Page>
  )
}

interface SpacerProps extends React.HTMLAttributes<HTMLHRElement> {
  addMargin?: "top" | "bottom" | "y" | "none"
}
function Spacer({ className = "", addMargin = "none", ...p }: SpacerProps) {
  const margin =
    (addMargin === "y" && "my-4 max-md:my-3") ||
    (addMargin === "top" && "mt-4 max-md:mt-3") ||
    (addMargin === "bottom" && "mb-4 max-md:mb-3") ||
    (addMargin === "none" && "")

  return (
    <hr
      className={`w-full border-slate-800/20 dark:border-slate-300/20 ${margin} ${className}`}
      {...p}
    />
  )
}
