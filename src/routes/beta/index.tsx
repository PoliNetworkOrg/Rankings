import { useContext } from "react";
import { ErrorComponent, Navigate, Route, useNavigate } from "@tanstack/router";
import MobileContext from "@/contexts/MobileContext";
import Page from "@/components/custom-ui/Page.tsx";
import PathBreadcrumb from "@/components/PathBreadcrumb.tsx";
import { rootRoute } from "@/routes/root.tsx";
import Table from "./Table";
import { NotFoundError } from "@/utils/errors.ts";
import axios from "axios";
import { NewRanking } from "@/utils/types/data/json/new-ranking";

export const betaRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/beta",
  loader: async () => {
    const res = await axios.get(
      "http://localhost:8120/2024_20002_3795_html.json",
    );
    const ranking: NewRanking = res.data;
    return { ranking };
  },
  errorComponent: ({ error }) => {
    if (error instanceof NotFoundError) return <Navigate to="/" />;

    return <ErrorComponent error={error} />;
  },
  component: function Viewer({ useLoader }) {
    const { ranking } = useLoader();
    const { isMobile } = useContext(MobileContext);

    // const courses = store?.getCourses();
    // const [selectedCourse, setSelectedCourse] = useState<string>(ABS_ORDER);
    // const isAbsOrder = useMemo(
    //   () => selectedCourse === ABS_ORDER,
    //   [selectedCourse],
    // );
    //
    // const [locations, setLocations] = useState<CourseInfoLocation[]>([]);
    // const [selectedLocation, setSelectedLocation] = useState<
    //   string | undefined
    // >();
    //
    // const [phases, setPhases] = useState<Phases>(_phases);
    // const [selectedPhaseLink, setSelectedPhaseLink] = useState<
    //   PhaseLink | undefined
    // >(initialPhaseLink);
    // const [selectedPhaseGroup, setSelectedPhaseGroup] = useState<
    //   PhaseGroup | undefined
    // >(initialPhaseGroup);
    //
    // function handlePhaseChange(link: PhaseLink, group: PhaseGroup): void {
    //   setSelectedPhaseLink(link);
    //   setSelectedPhaseGroup(group);
    //   navigate({
    //     to: "/view/$school/$year/$phase",
    //     params: { school, year, phase: link.href },
    //   });
    // }
    //
    // async function updateAvailablePhases(): Promise<void> {
    //   // check if this needs a useCallback to update
    //   // isAbsOrder value between re-renders
    //   if (isAbsOrder) return setPhases(_phases);
    //
    //   // check if this needs a useCallback to update
    //   // school year and table
    //   const coursePhases = await data.getPhases(
    //     school,
    //     year,
    //     table as CourseTable,
    //   );
    //   const phases = coursePhases ?? _phases;
    //   setPhases(phases);
    // }
    //
    // function handleCourseChange(value: string): void {
    //   setSelectedCourse(value);
    //   const courseLocations = courses?.get(value)?.locations;
    //   if (courseLocations) {
    //     setLocations(courseLocations);
    //     const fallback = fallbackSelectedLocation(
    //       courseLocations,
    //       selectedLocation,
    //     );
    //     if (fallback) setSelectedLocation(fallback.value);
    //
    //     updateAvailablePhases();
    //   }
    // }
    //
    // function handleLocationChange(value: string): void {
    //   setSelectedLocation(value);
    //   const fallback = fallbackSelectedLocation(locations, value);
    //   if (fallback) setSelectedLocation(fallback.value);
    //
    //   updateAvailablePhases();
    // }

    const table = ranking.rows;

    return (
      <Page
        className={`flex gap-4 px-0 ${isMobile ? "flex-col overflow-y-auto overflow-x-hidden" : ""
          }`}
        fullWidth
      >
        <div
          className={`flex w-full max-w-7xl flex-col gap-4 px-4 ${isMobile ? "flex-col overflow-y-auto overflow-x-hidden" : ""
            }`}
        >
          <PathBreadcrumb />
          <div className="flex w-full gap-4 max-sm:flex-col sm:items-center">
            <div className="flex flex-1 gap-8 max-md:flex-col max-md:gap-4"></div>
          </div>
        </div>

        <Table
          school={ranking.school}
          table={table}
        // csvFilename={`${selectedCourse}_${selectedLocation ?? "0"}`}
        />
      </Page>
    );
  },
});
