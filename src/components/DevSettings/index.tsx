import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { DATA_REF, LINKS, SCHOOLS } from "@/utils/constants";
import Data from "@/utils/data/data";
import { useRouterContext } from "@tanstack/router";
import { LuSettings2, LuX } from "react-icons/lu";
import CustomMap from "@/utils/CustomMap";
import School from "@/utils/types/data/School";
import Ranking from "@/utils/types/data/parsed/Ranking";
import Spinner from "../custom-ui/Spinner";
import Page from "../custom-ui/Page";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type LocalData = {
  main?: Data;
  stable?: Data;
};

export default function DevSettings({ data }: { data?: Data }) {
  const [open, setOpen] = useState(false);
  const context = useRouterContext();

  function handleChangeRef(refStr: string): void {
    context.context.data = Data.init(refStr as DATA_REF);
    context.load();
  }

  const [{ stable, main }, setLocalData] = useState<LocalData>({});

  useEffect(() => {
    const mainData = Data.init(DATA_REF.MAIN);
    const stableData = Data.init(DATA_REF.STABLE);

    Promise.all([mainData, stableData]).then(([main, stable]) =>
      setLocalData({ main, stable }),
    );
  }, []);

  return (
    data && (
      <>
        <div
          className={`fixed left-0 top-0 flex h-screen w-full bg-white dark:bg-slate-950 ${
            open ? "" : "hidden"
          }`}
        >
          <Page className="gap-4" paddingTop={false}>
            <div className="flex w-full items-center justify-between border-b border-slate-600 py-4">
              <h3 className="text-2xl font-bold">Dev Settings</h3>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                <LuX />
              </Button>
            </div>

            <div className="flex h-full max-h-full w-full flex-col gap-4 overflow-y-scroll pb-12 pr-2 scrollbar-thin">
              <Section title="WebApp Info" showHr={false}>
                <p>Version: {APP_VERSION}</p>
              </Section>

              <Section title="Data info">
                {stable && main && <DataSummary stable={stable} main={main} />}
              </Section>

              <Section title="Settings">
                <div className="flex items-center gap-4">
                  <p>
                    Sorgente data{" "}
                    <a
                      href={LINKS.dataRepoUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      (repo)
                    </a>
                  </p>
                  <Tabs value={data.ref} onValueChange={handleChangeRef}>
                    <TabsList>
                      <TabsTrigger className="block" value={DATA_REF.STABLE}>
                        Stable
                      </TabsTrigger>
                      <TabsTrigger className="block" value={DATA_REF.MAIN}>
                        Main
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </Section>
            </div>
          </Page>
        </div>

        {!open && (
          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            size="icon"
            className="absolute right-0 top-0 m-2"
          >
            <LuSettings2 />
          </Button>
        )}
      </>
    )
  );
}

type SectionProps = {
  title: string;
  children: React.ReactNode;
  showHr?: boolean;
};
function Section({ title, children, showHr = true }: SectionProps) {
  return (
    <>
      {showHr && <hr className="w-full border-slate-600" />}
      <div className="flex w-full flex-col items-start gap-2">
        <h4 className="text-lg font-bold">{title}</h4>
        {children}
      </div>
    </>
  );
}

type DataSummaryProps = {
  main: Data;
  stable: Data;
};

type SchoolData = {
  main: Ranking[];
  stable: Ranking[];
  comparison: RefComparison;
};

type SchoolRankingsMap = CustomMap<School, SchoolData>;
type YearData = {
  comparison: RefComparison;
  schools: SchoolRankingsMap;
};
type YearSchoolsRankingsMap = CustomMap<number, YearData>;

type RefComparison = {
  diffStableMain: number;
  diffStableMainPercentage: number;
};

function DataSummary({ main, stable }: DataSummaryProps) {
  const [currYear, setCurrYear] = useState<number>(new Date().getFullYear());
  const MAX_YEARS = 2;
  const [yearsRankings, setYearsRankings] = useState<
    YearSchoolsRankingsMap | undefined
  >();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);
  const [yearsMaxRows, setYearsMaxRows] = useState<CustomMap<number, number>>(
    new CustomMap(),
  );

  async function getYearData(year: number): Promise<YearData> {
    const schoolMap: SchoolRankingsMap = new CustomMap();
    let maxRows = 0;
    let totalStableStudents = 0;
    const mainComparison: RefComparison = {
      diffStableMain: 0,
      diffStableMainPercentage: 0,
    };
    for (const school of SCHOOLS) {
      const mainData = await main.getAllYearRankings(school, year);
      const stableData = await stable.getAllYearRankings(school, year);

      totalStableStudents += stableData
        .map((r) => r.rankingSummary.howManyStudents)
        .reduce((a, b) => a + b);

      const comparison = getComparison(stableData, mainData);
      const schoolData: SchoolData = {
        main: mainData,
        stable: stableData,
        comparison,
      };

      mainComparison.diffStableMain += comparison.diffStableMain;

      const innerMax = Math.max(mainData.length, stableData.length);
      maxRows = Math.max(maxRows, innerMax);
      schoolMap.set(school, schoolData);
    }

    yearsMaxRows.set(year, maxRows);
    setYearsMaxRows(yearsMaxRows);
    mainComparison.diffStableMainPercentage =
      (mainComparison.diffStableMain * 100) / totalStableStudents;

    return {
      schools: schoolMap,
      comparison: mainComparison,
    };
  }

  async function load(): Promise<void> {
    setIsLoading(true);
    const map: YearSchoolsRankingsMap = yearsRankings ?? new CustomMap();
    let y = currYear;
    for (let i = MAX_YEARS; i > 0; i--) {
      if (y <= 2021) setCanLoadMore(false);
      const yearData = await getYearData(y);
      map.set(y, yearData);
      y--;
    }
    setCurrYear(y);
    setYearsRankings(map);
    setIsLoading(false);
    setIsClicked(true);
  }

  function getComparison(stable: Ranking[], main: Ranking[]): RefComparison {
    const mainStudents = main
      .map((r) => r.rankingSummary.howManyStudents)
      .reduce((a, b) => a + b);
    const stableStudents = stable
      .map((r) => r.rankingSummary.howManyStudents)
      .reduce((a, b) => a + b);

    const diffStableMain = stableStudents - mainStudents;
    const diffStableMainPercentage = (diffStableMain * 100) / stableStudents;

    return {
      diffStableMain,
      diffStableMainPercentage,
    };
  }

  return (
    <div className="flex w-full flex-col items-start gap-4">
      {!isLoading && !isClicked && (
        <Button variant="outline" onClick={load}>
          Load (potrebbe richiedere un po' di tempo)
        </Button>
      )}
      {yearsRankings && (
        <>
          {yearsRankings?.entriesArr().map(([year, yearData]) => (
            <div className="w-full p-2 dark:border-slate-600">
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
                        (rr) => rr.phase === sr.phase,
                      );
                      if (!mr) return [];

                      return [
                        sr.phase,
                        sr.rankingSummary.howManyStudents.toString(),
                        mr.rankingSummary.howManyStudents.toString(),
                      ];
                    })
                    .filter((arr) => arr.length === 3);

                  console.log(yearsMaxRows.get(year));
                  const voidRowsNum =
                    (yearsMaxRows.get(year) ?? 0) - dataByPhase.length;
                  const voidRows: number[] = new Array(
                    Math.max(voidRowsNum, 0),
                  ).fill(0);
                  return (
                    <div className="h-full basis-[calc(50%-1rem)] rounded-md border border-slate-300 dark:border-slate-700 [&_*]:border-slate-300 [&_*]:dark:border-slate-700">
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
                            );
                          })}
                          {voidRows.map((_, i) => (
                            <TableRow key={`void-${year}-${school}-${i}`}>
                              <TableCell colSpan={3}>&nbsp;</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="[&_*]:bg-slate-800">
                            <TableCell>Comparison (stable - main)</TableCell>
                            <TableCell>
                              {schoolData.comparison.diffStableMain}
                            </TableCell>
                            <TableCell>
                              {schoolData.comparison.diffStableMainPercentage.toFixed(
                                2,
                              )}
                              %
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  );
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
      {isLoading && <Spinner className="flex-grow-0" />}
    </div>
  );
}
