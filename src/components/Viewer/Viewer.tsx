/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useContext, useEffect, useId, useMemo, useState } from "react"
import ButtonSelect from "../ui/ButtonSelect"
import Select from "../ui/Select"
import Input from "../ui/Input"
import MobileContext from "../../contexts/MobileContext"

import DATA from "../../utils/data/data.json"

type School = "Ingegneria" | "Architettura" | "Design" | "Urbanistica"
const ABS_ORDER = "ABSOLUTE ORDER"

type TableData = (string | number)[][]
type Structure = {
  school: School
  years: {
    year: number
    phases: {
      phase: string
      global: TableData
      courses: {
        name: string
        table: TableData
      }[]
    }[]
  }[]
}[]

export default function Viewer() {
  const { isMobile } = useContext(MobileContext)

  const data: Structure = DATA as Structure
  const schools: string[] = data.map(v => v.school)
  const [activeSchool, setActiveSchool] = useState<string>(schools[0])
  const school = data.find(v => v.school === activeSchool)!

  const yearsList = school.years.map(y => y.year)
  const [activeYear, setActiveYear] = useState<number>(
    yearsList.length > 0 ? yearsList[0] : -1
  )

  useEffect(() => {
    if (yearsList.length && !yearsList.includes(activeYear)) {
      setActiveYear(yearsList[0])
    }
  }, [activeYear, yearsList])

  const yearData = school.years.find(y => y.year === activeYear)

  const phases = useMemo(() => (yearData ? yearData.phases : []), [yearData])
  const [activePhase, setActivePhase] = useState<string>(
    phases.length > 0 ? phases[0].phase : ""
  )
  useEffect(() => {
    if (phases.length && !phases.find(p => p.phase === activePhase)) {
      setActivePhase(phases[0].phase)
    }
  }, [activePhase, phases])

  const phaseData = phases.find(p => p.phase === activePhase)

  const global = useMemo(
    () => (phaseData ? phaseData.global : [[]]),
    [phaseData]
  )

  const courses = useMemo(() => {
    const list: { name: string; table: (string | number)[][] }[] = []
    if (global[0].length) list.push({ name: ABS_ORDER, table: global })

    const phasesCourses = phases
      ?.find(v => v.phase === activePhase)
      ?.courses.filter(c => c.table[0].length) // only course with data

    phasesCourses?.map(c => list.push(c))
    return list
  }, [activePhase, global, phases])

  const coursesList = useMemo(() => courses?.map(c => c.name), [courses])
  const [activeCourse, setActiveCourse] = useState<string>(
    coursesList.length ? coursesList[0] : ""
  )
  const courseData = courses?.find(c => c.name === activeCourse)?.table

  useEffect(() => {
    if (coursesList.length && !coursesList.includes(activeCourse)) {
      setActiveCourse(coursesList[0])
    }
  }, [activeCourse, coursesList])

  const [filter, setFilter] = useState<string>("")
  const filtered = courseData?.filter(
    a => a.filter(b => b.toString().includes(filter)).length
  )

  //debug
  // useEffect(() => {
  //   console.log({ school, yearsList, phases, courses, coursesList })
  // }, [coursesList, phases, school, courses, yearsList])

  return (
    <div
      className={`relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center ${
        isMobile ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden"
      } px-2`}
    >
      <ButtonSelect
        options={schools}
        active={activeSchool}
        onOptionSelect={o => setActiveSchool(o)}
        className="pt-4"
      />
      <Spacer addMargin />
      {yearsList.length && phases.length && coursesList.length ? (
        <>
          <ButtonSelect
            options={yearsList}
            active={activeYear}
            onOptionSelect={o => setActiveYear(o)}
          />
          <Spacer addMargin />
          <ButtonSelect
            options={phases.map(v => v.phase).sort()}
            active={activePhase}
            onOptionSelect={o => setActivePhase(o)}
          />
          <Spacer addMargin />
          <div
            className={`grid min-h-0 w-full flex-grow items-start ${
              isMobile
                ? "grid-cols-1 grid-rows-[auto_auto_1fr]"
                : "grid-cols-[1fr_4fr] grid-rows-[auto_1fr]"
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
                  className="h-full w-auto overflow-y-auto pb-4 pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600"
                />
              )}
            </div>
            <div
              className={`${
                isMobile
                  ? "row-start-3 row-end-4 w-full overflow-x-scroll"
                  : "row-start-2 row-end-3 overflow-scroll pl-4 pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600"
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
        <NoData />
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

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  school: School
  data: (string | number)[][]
  isGlobalRanking?: boolean
}
function Table({ school, data, isGlobalRanking = false, ...p }: TableProps) {
  const Th = ({
    children,
    ...p
  }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="max-w-[8rem] border border-slate-800/20 p-1 text-sm dark:border-slate-300/20"
      {...p}
    >
      {children}
    </th>
  )
  const Td = ({
    children,
    ...p
  }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="border border-slate-800/20 p-1 text-center text-sm font-normal dark:border-slate-300/20"
      {...p}
    >
      {children}
    </td>
  )

  const id = useId()

  return (
    <>
      <table className="mb-2 w-full border-collapse" {...p}>
        {school === "Design" &&
          (isGlobalRanking ? (
            <thead>
              <tr>
                <Th>Test Score</Th>
                <Th>OFA TEST</Th>
                <Th>Overall Position</Th>
                <Th>Admitted enroll in (course)</Th>
              </tr>
            </thead>
          ) : (
            <thead>
              <tr>
                <Th rowSpan={2}>Position</Th>
                <Th rowSpan={2}>Birth Date</Th>
                <Th rowSpan={2}>Enroll allowed</Th>
                <Th rowSpan={2}>Test Score</Th>
                <Th colSpan={6}>Sections Score</Th>
                <Th rowSpan={2}>Correct ENG Answers</Th>
                <Th rowSpan={2}>Debit in ENG</Th>
              </tr>
              <tr>
                <Th>Geometry and Representation</Th>
                <Th>Verbal Comp.</Th>
                <Th>History of Design and Art</Th>
                <Th>Logic</Th>
                <Th>General Culture</Th>
                <Th>English</Th>
              </tr>
            </thead>
          ))}
        {school === "Ingegneria" &&
          (isGlobalRanking ? (
            <thead>
              <tr>
                <Th>Test Score</Th>
                <Th>OFA TEST</Th>
                <Th>OFA TENG</Th>
                <Th>Overall Position</Th>
                <Th>Admitted enroll in (course)</Th>
              </tr>
            </thead>
          ) : (
            <thead>
              <tr>
                <Th rowSpan={2}>Position</Th>
                <Th rowSpan={2}>Birth Date</Th>
                <Th rowSpan={2}>Enroll allowed</Th>
                <Th rowSpan={2}>Test Score</Th>
                <Th colSpan={4}>Sections Score</Th>
                <Th rowSpan={2}>Correct ENG Answers</Th>
                <Th rowSpan={2}>OFA TEST</Th>
                <Th rowSpan={2}>OFA TENG</Th>
              </tr>
              <tr>
                <Th>English</Th>
                <Th>Maths</Th>
                <Th>Verbal Comp.</Th>
                <Th>Physics</Th>
              </tr>
            </thead>
          ))}
        {school === "Architettura" &&
          (isGlobalRanking ? (
            <thead>
              <tr>
                <Th>Test Score</Th>
                <Th>OFA TENG</Th>
                <Th>Overall Position</Th>
                <Th>Status</Th>
              </tr>
            </thead>
          ) : (
            <thead>
              <tr>
                <Th rowSpan={2}>Position</Th>
                <Th rowSpan={2}>Birth Date</Th>
                <Th rowSpan={2}>Enroll allowed</Th>
                <Th rowSpan={2}>Test Score</Th>
                <Th colSpan={5}>Sections Score</Th>
              </tr>
              <tr>
                <Th>General Culture</Th>
                <Th>Logic</Th>
                <Th>History</Th>
                <Th>Drawing and Representation</Th>
                <Th>Physics and Maths</Th>
              </tr>
            </thead>
          ))}
        {school === "Urbanistica" &&
          (isGlobalRanking ? (
            <thead>
              <tr>
                <Th>Test Score</Th>
                <Th>Overall Position</Th>
                <Th>Admitted enroll in (course)</Th>
              </tr>
            </thead>
          ) : (
            <thead>
              <tr>
                <Th rowSpan={2}>Position</Th>
                <Th rowSpan={2}>Birth Date</Th>
                <Th rowSpan={2}>Enroll allowed</Th>
                <Th rowSpan={2}>Test Score</Th>
                <Th colSpan={6}>Sections Score</Th>
              </tr>
              <tr>
                <Th>Interview</Th>
                <Th>Composition</Th>
                <Th>Motivational Letter</Th>
              </tr>
            </thead>
          ))}
        <tbody>
          {data.map((row, x) => (
            <tr key={`${id}-${x}`}>
              {row.map((value, y) => (
                <Td key={`${id}-${x}-${y}`}>{value}</Td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function NoData() {
  return <p>No data available</p>
}
