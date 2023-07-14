import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ErrorComponent, Navigate, Route, useNavigate } from "@tanstack/router";
import MobileContext from "@/contexts/MobileContext";
import School from "@/utils/types/data/School.ts";
import CourseTable from "@/utils/types/data/parsed/Ranking/CourseTable.ts";
import { PhaseLink } from "@/utils/types/data/parsed/Index/RankingFile.ts";
import { ABS_ORDER } from "@/utils/constants.ts";
import Store from "@/utils/data/store.ts";
import Spinner from "@/components/custom-ui/Spinner.tsx";
import Page from "@/components/custom-ui/Page.tsx";
import PathBreadcrumb from "@/components/PathBreadcrumb.tsx";
import { rootRoute } from "@/routes/root.tsx";
import Table from "./Table.tsx";
import PhaseSelect from "./PhaseSelect.tsx";
import { CourseCombobox } from "./CourseCombobox.tsx";
import LocationsSelect from "./LocationSelect.tsx";
import { NotFoundError } from "@/utils/errors.ts";
import MinScorePhases, {
  MinScorePhasesObj,
  MinScorePhasesObj_PhasesMap,
} from "@/components/charts/MinScorePhases.tsx";
import CustomMap from "@/utils/CustomMap.ts";
import VotoCandidatiChart from "@/components/charts/VotoCandidatiChart.tsx";
import Data from "@/utils/data/data.ts";

export const viewerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/view/$school/$year/$phase",
  parseParams: ({ school, year, phase }) => ({
    school: school as School,
    year: Number(year),
    phase: phase.toLowerCase(),
  }),
  loader: async ({ context, params }) => {
    const data = await context.data;
    const variables = { ...params, data };
    const rankingLoader = context.loaderClient.loaders.ranking;
    const result = await rankingLoader.load({ variables });

    return result;
  },
  errorComponent: ({ error }) => {
    if (error instanceof NotFoundError) return <Navigate to="/" />;

    return <ErrorComponent error={error} />;
  },
  component: function Viewer({ useLoader, useParams }) {
    const { ranking, data } = useLoader();
    const { school, year, phase } = useParams();
    const { isMobile } = useContext(MobileContext);
    const navigate = useNavigate({ from: viewerRoute.id });

    const store = useMemo(() => ranking && new Store(ranking), [ranking]);

    const courses = store?.getCourses();
    const [selectedCourse, setSelectedCourse] = useState<string>(ABS_ORDER);

    const locations = useMemo(
      () => courses?.get(selectedCourse)?.locations ?? [],
      [courses, selectedCourse],
    );
    const [selectedLocation, setSelectedLocation] = useState<
      string | undefined
    >();
    useEffect(() => {
      if (locations.length === 0) return;
      const findLocation = locations.find(
        (cil) => cil.value.toLowerCase() === selectedLocation?.toLowerCase(),
      );
      if (!findLocation) setSelectedLocation(locations[0].value);
    }, [locations, selectedLocation]);

    const [phasesLinks, setPhasesLinks] = useState<PhaseLink[]>([]);
    const [selectedPhase, setSelectedPhase] = useState<PhaseLink | undefined>();
    useEffect(() => {
      if (!selectedPhase)
        setSelectedPhase(phasesLinks.find((p) => p.href === phase));
    }, [phase, phasesLinks, selectedPhase]);

    const handleSwitchPhase = (href: string) => {
      const phaseLink = phasesLinks?.find(
        (p) => p.href.toLowerCase() === href.toLowerCase(),
      );
      if (!phaseLink) return;

      setSelectedPhase(phaseLink);
      navigate({
        to: "/view/$school/$year/$phase",
        params: { school, year, phase: phaseLink.href },
      });
    };

    const table = useMemo(
      () => store.getTable(selectedCourse, selectedLocation),
      [selectedCourse, selectedLocation, store],
    );

    /******* STATS start ********/
    const [courseStats, setCourseStats] = useState<
      MinScorePhasesObj | undefined
    >();

    const getStats = useCallback(async () => {
      const years = data.getYears(school);
      if (!years) return;

      const yearsStats: MinScorePhasesObj = await getMinScorePhasesObj(
        years,
        data,
        school,
        selectedCourse,
        selectedLocation,
      );
      setCourseStats(yearsStats);
      getStats(); // STATS call
    }, [data, school, selectedCourse, selectedLocation]);
    /******* STATS end ********/

    useEffect(() => {
      if (!table) return;
      if (selectedCourse === ABS_ORDER) {
        const phasesLinks = data.getPhasesLinks(school, year);
        setPhasesLinks(phasesLinks ?? []);
      } else {
        const phasesLinks = data.getCoursePhasesLinks(
          ranking,
          table as CourseTable,
        );
        setPhasesLinks(phasesLinks ?? []);
      }
    }, [data, ranking, school, selectedCourse, table, year]);

    return (
      <Page
        className={`flex gap-4 px-4 ${
          isMobile ? "flex-col overflow-y-auto overflow-x-hidden" : ""
        }`}
        fullWidth
      >
        <div
          className={`flex w-full max-w-7xl flex-col gap-4 px-4 ${
            isMobile ? "flex-col overflow-y-auto overflow-x-hidden" : ""
          }`}
        >
          <PathBreadcrumb />
          <div className="flex w-full max-sm:flex-col max-sm:gap-4">
            {selectedPhase && (
              <PhaseSelect
                value={selectedPhase.href}
                onChange={handleSwitchPhase}
                phasesLinks={phasesLinks}
              />
            )}
          </div>
          <div className="flex w-full gap-4 max-sm:flex-col sm:items-center">
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
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
          {selectedPhase?.name === ranking.phase ? (
            table ? (
              <Table
                school={school as School}
                table={table}
                csvFilename={`${selectedCourse}_${selectedLocation ?? "0"}`}
              />
            ) : (
              <p>Nessun dato disponibile</p>
            )
          ) : (
            <Spinner />
          )}
        </div>

        <VotoCandidatiChart ranking={ranking} />
        <div className="h-32"></div>
        {courseStats && <MinScorePhases stats={courseStats} />}
      </Page>
    );
  },
});

async function getMinScorePhasesObj(
  years: number[],
  data: Data,
  school: School,
  selectedCourse: string,
  selectedLocation?: string,
) {
  const yearsStats: MinScorePhasesObj = new CustomMap();
  for (const year of years) {
    const phases = data.getPhasesLinks(school, year);
    if (!phases) continue;

    const phasesMap: MinScorePhasesObj_PhasesMap = new CustomMap();
    for (const phase of phases) {
      const r = await data.loadRanking(school, year, phase.href);
      const localCourse =
        r && Store.getTable(r, selectedCourse, selectedLocation);
      if (!localCourse) continue;

      const phaseStats = await data.getCourseStats(
        school,
        year,
        phase.name,
        localCourse as CourseTable,
      );
      if (!phaseStats) continue;
      phasesMap.set(phase.name, phaseStats);
    }

    yearsStats.set(year, phasesMap);
  }
  return yearsStats;
}
