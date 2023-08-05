import { useContext, useEffect, useMemo, useState } from "react";
import { ErrorComponent, Navigate, Route, useNavigate } from "@tanstack/router";
import MobileContext from "@/contexts/MobileContext";
import School from "@/utils/types/data/School.ts";
import CourseTable from "@/utils/types/data/parsed/Ranking/CourseTable.ts";
import {
  PhaseGroup,
  PhaseLink,
  Phases,
} from "@/utils/types/data/parsed/Index/RankingFile.ts";
import { ABS_ORDER } from "@/utils/constants.ts";
import Store from "@/utils/data/store.ts";
import Spinner from "@/components/custom-ui/Spinner.tsx";
import Page from "@/components/custom-ui/Page.tsx";
import PathBreadcrumb from "@/components/PathBreadcrumb.tsx";
import { rootRoute } from "@/routes/root.tsx";
import Table from "./Table";
import PhaseSelect from "./PhaseSelect";
import { CourseCombobox } from "./CourseCombobox.tsx";
import LocationsSelect from "./LocationSelect.tsx";
import { NotFoundError } from "@/utils/errors.ts";

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
    const { phases: _phases, ranking, data } = useLoader();
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
      if (!findLocation) {
        const sortedByNumStudents = Array.from(locations);
        sortedByNumStudents.sort((a, b) => b.numStudents - a.numStudents);
        const { value } = sortedByNumStudents[0];
        setSelectedLocation(value);
      }
    }, [locations, selectedLocation]);

    const [phases, setPhases] = useState<Phases>(_phases);
    const [selectedPhaseLink, setSelectedPhaseLink] = useState<
      PhaseLink | undefined
    >();
    const [selectedPhaseGroup, setSelectedPhaseGroup] = useState<
      PhaseGroup | undefined
    >();

    useEffect(() => {
      if (selectedPhaseLink) return;

      const link = phases.all.find((p) => p.href === phase);
      if (!link) return;

      setSelectedPhaseLink(link);

      const group = phases.groups.get(link.group.value);
      if (!group) return;

      setSelectedPhaseGroup(group);
    }, [phase, phases, selectedPhaseLink]);

    const handlePhaseChange = (link: PhaseLink, group: PhaseGroup) => {
      setSelectedPhaseLink(link);
      setSelectedPhaseGroup(group);
      navigate({
        to: "/view/$school/$year/$phase",
        params: { school, year, phase: link.href },
      });
    };

    const table = useMemo(
      () => store.getTable(selectedCourse, selectedLocation),
      [selectedCourse, selectedLocation, store],
    );

    useEffect(() => {
      if (!table) return;
      if (selectedCourse === ABS_ORDER) {
        setPhases(_phases);
      } else {
        data
          .getPhases(school, year, table as CourseTable)
          .then((links) => setPhases(links ?? _phases));
      }
    }, [data, _phases, ranking, school, selectedCourse, table, year]);

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
  },
});
