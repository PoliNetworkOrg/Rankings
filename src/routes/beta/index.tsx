import { useContext, useMemo, useState } from "react";
import { ErrorComponent, Navigate, Route } from "@tanstack/router";
import MobileContext from "@/contexts/MobileContext";
import Page from "@/components/custom-ui/Page.tsx";
import PathBreadcrumb from "@/components/PathBreadcrumb.tsx";
import { rootRoute } from "@/routes/root.tsx";
import Table from "./Table";
import { NotFoundError } from "@/utils/errors.ts";
import axios from "axios";
import {
  NewRanking,
  NewStudentResult,
} from "@/utils/types/data/json/new-ranking";
import { ABS_ORDER } from "@/utils/constants";
import { CourseInfo, CourseInfoLocation } from "@/utils/data/store";
import { CourseCombobox } from "../viewer/CourseCombobox";
import LocationsSelect from "../viewer/LocationSelect";
import CustomMap from "@/utils/CustomMap";
import { capitaliseWords } from "@/utils/strings/capitalisation";

function TEMP_getCoursesMap(
  ranking: NewRanking,
): CustomMap<string, CourseInfo> {
  const courses: CustomMap<string, CourseInfo> = new CustomMap();
  courses.set(ABS_ORDER, {
    value: ABS_ORDER,
    label: "Tutti i corsi",
    locations: [],
  });
  Object.entries(ranking.courses).forEach(([t, l]) => {
    const lowerTitle = t.toLowerCase();
    const title = capitaliseWords(t);

    const locations = l.map((cl) => ({
      value: cl.toLowerCase(),
      label: capitaliseWords(cl),
      numStudents: 0,
    }));
    courses.set(lowerTitle, {
      locations,
      label: title,
      value: lowerTitle,
    });
  });
  return courses;
}

function TEMP_filterByCourse(
  ranking: NewRanking,
  course: string,
  location?: string,
): NewStudentResult[] {
  const filtered = ranking.rows.filter((r) =>
    r.courses.find((c) =>
      c.title.toLowerCase() === course.toLowerCase() && location
        ? c.location.toLowerCase() === location.toLowerCase()
        : c.location === "",
    ),
  );
  return filtered;
}

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

export const betaRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/beta",
  loader: async () => {
    const res = await axios.get(
      "http://localhost:8120/2024_20064_3a62_html.json",
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
    const courses = TEMP_getCoursesMap(ranking);

    const [selectedCourse, setSelectedCourse] = useState<string>(ABS_ORDER);
    // const isAbsOrder = useMemo(
    //   () => selectedCourse === ABS_ORDER,
    //   [selectedCourse],
    // );
    //
    const [locations, setLocations] = useState<CourseInfoLocation[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<
      string | undefined
    >();
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
    function handleCourseChange(value: string): void {
      setSelectedCourse(value);
      const courseLocations = courses.get(value)?.locations;
      if (courseLocations) {
        setLocations(courseLocations);

        const fallback = fallbackSelectedLocation(
          courseLocations,
          selectedLocation,
        );
        if (fallback) setSelectedLocation(fallback.value);

        // updateAvailablePhases();
      }
    }

    function handleLocationChange(value: string): void {
      setSelectedLocation(value);
      const fallback = fallbackSelectedLocation(locations, value);
      if (fallback) setSelectedLocation(fallback.value);

      // updateAvailablePhases();
    }

    const table = useMemo(() => {
      if (selectedCourse === ABS_ORDER) return ranking.rows;
      return TEMP_filterByCourse(ranking, selectedCourse, selectedLocation);
    }, [ranking, selectedCourse, selectedLocation]);

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

        <Table
          school={ranking.school}
          table={table}
          // csvFilename={`${selectedCourse}_${selectedLocation ?? "0"}`}
          csvFilename={`beta`}
        />
      </Page>
    );
  },
});
