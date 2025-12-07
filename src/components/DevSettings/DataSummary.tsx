import { useState } from "react"
import CustomMap from "@/utils/CustomMap"
import { SCHOOLS } from "@/utils/constants"
import type Data from "@/utils/data/data"
import type Ranking from "@/utils/types/data/parsed/Ranking"
import type { School } from "@/utils/types/data/school"
import Spinner from "../custom-ui/Spinner"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"

type DataSummaryProps = {
  main: Data
  stable: Data
}

type SchoolData = {
  main: Ranking[]
  stable: Ranking[]
  comparison: RefComparison
}

type SchoolRankingsMap = CustomMap<School, SchoolData>
type YearData = {
  comparison: RefComparison
  schools: SchoolRankingsMap
}
type YearSchoolsRankingsMap = CustomMap<number, YearData>

type RefComparison = {
  diffStableMain: number
  diffStableMainPercentage: number
}

export default function DataSummary({ main, stable }: DataSummaryProps) {
  const [currYear, setCurrYear] = useState<number>(new Date().getFullYear())
  const MAX_YEARS = 2
  const [yearsRankings, setYearsRankings] = useState<
    YearSchoolsRankingsMap | undefined
  >()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isClicked, setIsClicked] = useState<boolean>(false)
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true)
  const [yearsMaxRows, setYearsMaxRows] = useState<CustomMap<number, number>>(
    new CustomMap()
  )

  async function getYearData(year: number): Promise<YearData> {
    const schoolMap: SchoolRankingsMap = new CustomMap()
    let maxRows = 0
    let totalStableStudents = 0
    const mainComparison: RefComparison = {
      diffStableMain: 0,
      diffStableMainPercentage: 0,
    }
    for (const school of SCHOOLS) {
      const mainData = await main.getAllYearRankings(school, year)
      const stableData = await stable.getAllYearRankings(school, year)

      totalStableStudents += stableData
        .map((r) => r.rankingSummary.howManyStudents)
        .reduce((a, b) => a + b, 0)

      const comparison = getComparison(stableData, mainData)
      const schoolData: SchoolData = {
        main: mainData,
        stable: stableData,
        comparison,
      }

      mainComparison.diffStableMain += comparison.diffStableMain

      const innerMax = Math.max(mainData.length, stableData.length)
      maxRows = Math.max(maxRows, innerMax)
      schoolMap.set(school, schoolData)
    }

    yearsMaxRows.set(year, maxRows)
    setYearsMaxRows(yearsMaxRows)
    mainComparison.diffStableMainPercentage =
      (mainComparison.diffStableMain * 100) / totalStableStudents

    return {
      schools: schoolMap,
      comparison: mainComparison,
    }
  }

  async function load(): Promise<void> {
    setIsLoading(true)
    const map: YearSchoolsRankingsMap = yearsRankings ?? new CustomMap()
    let y = currYear
    for (let i = MAX_YEARS; i > 0; i--) {
      if (y <= 2021) setCanLoadMore(false)
      const yearData = await getYearData(y)
      map.set(y, yearData)
      y--
    }
    setCurrYear(y)
    setYearsRankings(map)
    setIsLoading(false)
    setIsClicked(true)
  }

  function getComparison(stable: Ranking[], main: Ranking[]): RefComparison {
    const mainStudents = main
      .map((r) => r.rankingSummary.howManyStudents)
      .reduce((a, b) => a + b, 0)
    const stableStudents = stable
      .map((r) => r.rankingSummary.howManyStudents)
      .reduce((a, b) => a + b, 0)

    const diffStableMain = stableStudents - mainStudents
    const diffStableMainPercentage = (diffStableMain * 100) / stableStudents

    return {
      diffStableMain,
      diffStableMainPercentage,
    }
  }

  return (
    <div className="flex w-full flex-col items-start gap-8">
      {!isLoading && !isClicked && (
        <Button variant="outline" onClick={load}>
          Load (potrebbe richiedere un po' di tempo)
        </Button>
      )}
      {yearsRankings && (
        <>
          {yearsRankings?.entriesArr().map(([year, yearData]) => (
            <div key={year} className="w-full dark:border-slate-600">
              <div className="flex items-center gap-4">
                <Badge>{year}</Badge>
                <p>Global Comparison (stable - main)</p>
                <p>{yearData.comparison.diffStableMain}</p> -
                <p>
                  {yearData.comparison.diffStableMainPercentage.toFixed(2)}%
                </p>
              </div>
              <div className="mt-2 grid w-full grid-cols-2 grid-rows-2 gap-4">
                {yearData.schools.entriesArr().map(([school, schoolData]) => {
                  const dataByPhase = schoolData.stable
                    .map((sr) => {
                      const mr = schoolData.main.find(
                        (rr) => rr.phase === sr.phase
                      )
                      if (!mr) return []

                      return [
                        sr.phase,
                        sr.rankingSummary.howManyStudents.toString(),
                        mr.rankingSummary.howManyStudents.toString(),
                      ]
                    })
                    .filter((arr) => arr.length === 3)

                  const voidRowsNum =
                    (yearsMaxRows.get(year) ?? 0) - dataByPhase.length
                  const voidRows: number[] = new Array(
                    Math.max(voidRowsNum, 0)
                  ).fill(0)
                  return (
                    <div
                      className="h-full basis-[calc(50%-1rem)] rounded-md border border-slate-300 **:border-slate-300 dark:border-slate-700 **:dark:border-slate-700"
                      key={school}
                    >
                      <Table className="h-full [&_tr:nth-child(odd):not(:hover)]:bg-inherit dark:[&_tr:nth-child(odd):not(:hover)]:bg-inherit">
                        <TableHeader>
                          <TableRow>
                            <TableHead>{school}</TableHead>
                            <TableHead>{stable.ref}</TableHead>
                            <TableHead>{main.ref}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dataByPhase.map((d) => {
                            return (
                              <TableRow key={d[0]}>
                                <TableCell className="w-3/5">{d[0]}</TableCell>
                                <TableCell className="w-1/5">{d[1]}</TableCell>
                                <TableCell className="w-1/5">{d[2]}</TableCell>
                              </TableRow>
                            )
                          })}
                          {voidRows.map((_, i) => (
                            <TableRow
                              // biome-ignore lint/suspicious/noArrayIndexKey: TODO we need it for now
                              key={`void-${year}-${school}-${i}`}
                            >
                              <TableCell colSpan={3}>&nbsp;</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="**:bg-slate-300 **:dark:bg-slate-800">
                            <TableCell>Comparison (stable - main)</TableCell>
                            <TableCell>
                              {schoolData.comparison.diffStableMain}
                            </TableCell>
                            <TableCell>
                              {schoolData.comparison.diffStableMainPercentage.toFixed(
                                2
                              )}
                              %
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          {canLoadMore && (
            <Button variant="outline" onClick={load}>
              Load more
            </Button>
          )}
        </>
      )}
      {isLoading && <Spinner className="grow-0" />}
    </div>
  )
}
