/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useContext, useEffect, useMemo, useState } from "react"
import DATA from "../../utils/data/data.json"
import { Course, Phase, School, Structure, TableData } from "../../utils/types"
import Table from "./Table"
import Spinner from "../ui/Spinner.tsx"
import ButtonSelect from "../ui/ButtonSelect"
import Select from "../ui/Select"
import Input from "../ui/Input"
import MobileContext from "../../contexts/MobileContext"

const ABS_ORDER = "ABSOLUTE ORDER"

export default function Viewer() {
  const { isMobile } = useContext(MobileContext)

  const data: Structure = DATA as Structure
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

  const [filter, setFilter] = useState<string>("")
  const filtered: TableData =
    table.filter(a => a.join(" ").includes(filter)) ?? []

  const [isLoading, setIsLoading] = useState<boolean>(true)
  useEffect(() => {
    if (!activeSchool) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [activeSchool])

  return (
    <div
      className={`relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center ${
        isMobile ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden"
      } px-2`}
    >
      <ButtonSelect
        options={schools.sort()}
        active={activeSchool}
        onOptionSelect={o => setActiveSchool(o)}
        className="pt-4"
      />
      <Spacer addMargin />
      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : coursesList.length ? (
        <>
          <ButtonSelect
            options={yearsList}
            active={activeYear}
            onOptionSelect={o => setActiveYear(o)}
          />
          <Spacer addMargin />
          <ButtonSelect
            options={phasesList}
            active={activePhase}
            onOptionSelect={o => setActivePhase(o)}
          />
          <Spacer addMargin />
          <div
            className={`grid w-full flex-grow items-start ${
              isMobile
                ? "grid-cols-1 grid-rows-[auto_auto_1fr]"
                : "min-h-0 grid-cols-[1fr_4fr] grid-rows-[auto_1fr] "
            } `}
          >
            <div
              className={
                isMobile
                  ? "sticky top-[-1px] row-start-2 row-end-3 bg-white py-4 dark:bg-slate-900"
                  : "col-start-2 col-end-3 row-start-1 px-4 pb-4"
              }
            >
              <Input
                value={filter}
                onValue={v => setFilter(v)}
                placeholder="Filter..."
              />
            </div>
            <div
              className={`${
                isMobile
                  ? "row-start-1 row-end-2"
                  : "row-start-1 row-end-3 border-r border-slate-800/20 pr-1 dark:border-slate-300/20"
              } h-full w-auto`}
            >
              {isMobile ? (
                <>
                  <Select
                    options={coursesList}
                    value={activeCourse}
                    onChange={e => setActiveCourse(e.currentTarget.value)}
                    className="mb-4"
                  />
                  <Spacer />
                </>
              ) : (
                <ButtonSelect
                  options={coursesList}
                  active={activeCourse}
                  onOptionSelect={o => setActiveCourse(o)}
                  useColumn
                  className="h-full w-auto overflow-y-auto pb-4 pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-600"
                />
              )}
            </div>
            <div
              className={`${
                isMobile
                  ? "row-start-3 row-end-4 w-full overflow-y-visible overflow-x-scroll"
                  : "row-start-2 row-end-3 overflow-scroll pl-4 pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-600"
              } h-full`}
            >
              {filtered ? (
                <Table
                  isGlobalRanking={activeCourse === ABS_ORDER}
                  school={activeSchool as School}
                  data={filtered}
                />
              ) : (
                <p>Data not available for this year</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

interface SpacerProps extends React.HTMLAttributes<HTMLHRElement> {
  addMargin?: boolean
}
function Spacer({ className = "", addMargin = false, ...p }: SpacerProps) {
  return (
    <hr
      className={`w-full border-slate-800/20 dark:border-slate-300/20 ${
        addMargin ? "my-4" : ""
      } ${className}`}
      {...p}
    />
  )
}
