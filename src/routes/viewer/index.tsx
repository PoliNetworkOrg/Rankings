import { useContext, useMemo, useState } from "react";
import {
  ErrorComponent,
  Navigate,
  Route,
  useNavigate,
} from "@tanstack/react-router";
import MobileContext from "@/contexts/MobileContext";
import School from "@/utils/types/data/School.ts";
import CourseTable from "@/utils/types/data/parsed/Ranking/CourseTable.ts";
import {
  PhaseGroup,
  PhaseLink,
  Phases,
} from "@/utils/types/data/parsed/Index/RankingFile.ts";
import { ABS_ORDER } from "@/utils/constants.ts";
import Store, { CourseInfoLocation } from "@/utils/data/store.ts";
import Spinner from "@/components/custom-ui/Spinner.tsx";
import Page from "@/components/custom-ui/Page.tsx";
import PathBreadcrumb from "@/components/PathBreadcrumb.tsx";
import { rootRoute } from "@/routes/root.tsx";
import Table from "./Table";
import PhaseSelect from "./PhaseSelect";
import { CourseCombobox } from "./CourseCombobox.tsx";
import LocationsSelect from "./LocationSelect.tsx";
import { NotFoundError } from "@/utils/errors.ts";
import Data from "@/utils/data/data.ts";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

function isSelectedLocationValid(
  locations: CourseInfoLocation[],
  selectedLocation: string,
): boolean {
  if (locations.length === 0) return false;
  const foundLocation = locations.find(
    (cil) => cil.value.toLowerCase() === selectedLocation?.toLowerCase(),
  );

  return !!foundLocation;
}

function getLocationsByNumStudents(
  locations: CourseInfoLocation[],
): CourseInfoLocation[] {
  const sortedByNumStudents = Array.from(locations);
  sortedByNumStudents.sort((a, b) => b.numStudents - a.numStudents);
  return sortedByNumStudents;
}

function fallbackSelectedLocation(
  locations: CourseInfoLocation[],
  selectedLocation?: string,
): CourseInfoLocation | undefined {
  if (selectedLocation) {
    const valid = isSelectedLocationValid(locations, selectedLocation);
    if (valid) return undefined;
  }

  const sortedLocations = getLocationsByNumStudents(locations);
  return sortedLocations[0];
}

const STALE_TIME = 60_000; // 1 minute

const rankingQueryOptions = (
  pData: Promise<Data>,
  school: School,
  year: number,
  phase: string,
) =>
  queryOptions({
    queryKey: ["ranking", school, year, phase],
    queryFn: async () => {
      const data = await pData;
      const phases = await data.getPhases(school, year);
      const ranking = await data.loadRanking(school, year, phase);

      const phaseLink = phases?.all.find((p) => p.href === phase);
      const phaseGroup = phaseLink && phases?.groups.get(phaseLink.group.value);

      if (!ranking || !phases) throw new NotFoundError();
      return { ranking, phases, data, phaseLink, phaseGroup };
    },
    staleTime: STALE_TIME,
  });

export const viewerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/view/$school/$year/$phase",
  parseParams: ({ school, year, phase }) => ({
    school: school as School,
    year: Number(year),
    phase: phase.toLowerCase(),
  }),
  loader: async ({
    context: { queryClient, data },
    params: { school, year, phase },
  }) =>
    queryClient.ensureQueryData(rankingQueryOptions(data, school, year, phase)),
  errorComponent: ({ error }) => {
    if (error instanceof NotFoundError) return <Navigate to="/" />;
    return <ErrorComponent error={error} />;
  },
  component: Viewer,
});

function Viewer() {
  const { school, year, phase } = viewerRoute.useParams();
  const { data: pData } = viewerRoute.useRouteContext();

  const {
    phases: _phases,
    ranking,
    data,
    phaseLink: initialPhaseLink,
    phaseGroup: initialPhaseGroup,
  } = useSuspenseQuery(rankingQueryOptions(pData, school, year, phase)).data;

  const { isMobile } = useContext(MobileContext);
  const navigate = useNavigate({ from: viewerRoute.id });
  const store = useMemo(() => ranking && new Store(ranking), [ranking]);

  const courses = store?.getCourses();
  const [selectedCourse, setSelectedCourse] = useState<string>(ABS_ORDER);
  const isAbsOrder = useMemo(
    () => selectedCourse === ABS_ORDER,
    [selectedCourse],
  );

  const [locations, setLocations] = useState<CourseInfoLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<
    string | undefined
  >();

  const [phases, setPhases] = useState<Phases>(_phases);
  const [selectedPhaseLink, setSelectedPhaseLink] = useState<
    PhaseLink | undefined
  >(initialPhaseLink);
  const [selectedPhaseGroup, setSelectedPhaseGroup] = useState<
    PhaseGroup | undefined
  >(initialPhaseGroup);

  function handlePhaseChange(link: PhaseLink, group: PhaseGroup): void {
    setSelectedPhaseLink(link);
    setSelectedPhaseGroup(group);
    navigate({
      to: "/view/$school/$year/$phase",
      params: { school, year, phase: link.href },
    });
  }

  async function updateAvailablePhases(): Promise<void> {
    // check if this needs a useCallback to update
    // isAbsOrder value between re-renders
    if (isAbsOrder) return setPhases(_phases);

    // check if this needs a useCallback to update
    // school year and table
    const coursePhases = await data.getPhases(
      school,
      year,
      table as CourseTable,
    );
    const phases = coursePhases ?? _phases;
    setPhases(phases);
  }

  function handleCourseChange(value: string): void {
    setSelectedCourse(value);
    const courseLocations = courses?.get(value)?.locations;
    if (courseLocations) {
      setLocations(courseLocations);
      const fallback = fallbackSelectedLocation(
        courseLocations,
        selectedLocation,
      );
      if (fallback) setSelectedLocation(fallback.value);

      updateAvailablePhases();
    }
  }

  function handleLocationChange(value: string): void {
    setSelectedLocation(value);
    const fallback = fallbackSelectedLocation(locations, value);
    if (fallback) setSelectedLocation(fallback.value);

    updateAvailablePhases();
  }

  const table = useMemo(
    () => store.getTable(selectedCourse, selectedLocation),
    [selectedCourse, selectedLocation, store],
  );

  return (
    <Page
      className={`flex gap-4 px-0 ${
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
        {selectedPhaseGroup && selectedPhaseLink && (
          <PhaseSelect
            selectedPhase={selectedPhaseLink}
            selectedGroup={selectedPhaseGroup}
            onChange={handlePhaseChange}
            phases={phases}
          />
        )}
        <div className="flex w-full gap-4 max-sm:flex-col sm:items-center">
          <div className="flex flex-1 gap-8 max-md:flex-col max-md:gap-4">
            <CourseCombobox
              courses={courses}
              value={selectedCourse}
              onSelect={handleCourseChange}
            />
            {selectedLocation && (
              <LocationsSelect
                value={selectedLocation}
                locations={locations}
                onChange={handleLocationChange}
              />
            )}
          </div>
        </div>
      </div>

      {selectedPhaseLink?.order.phase.toLowerCase() ===
      ranking.rankingOrder.phase.toLowerCase() ? (
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
    </Page>
  );
}
