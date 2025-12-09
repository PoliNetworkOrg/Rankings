import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import {
  createFileRoute,
  ErrorComponent,
  redirect,
} from "@tanstack/react-router"
import { useContext, useMemo, useState } from "react"
import { queryClient } from "@/app/__root"
import Page from "@/components/custom-ui/Page.tsx"
import PathBreadcrumb from "@/components/PathBreadcrumb.tsx"
import MobileContext from "@/contexts/MobileContext"
import { NotFoundError } from "@/utils/errors.ts"
import type {
  NewRanking,
  NewStudentResultCourse,
  StudentTableRow,
} from "@/utils/types/data/ranking"
import { isSchool } from "@/utils/types/data/school"
import { CourseCombobox } from "./-course-combobox"
import LocationsSelect from "./-location-select"
import Table from "./-Table"
import CustomMap from "@/utils/CustomMap"

// function TEMP_getCoursesMap(
//   ranking: NewRanking
// ): CustomMap<string, CourseInfo> {
//   const courses: CustomMap<string, CourseInfo> = new CustomMap()
//   courses.set(ABS_ORDER, {
//     value: ABS_ORDER,
//     label: "Tutti i corsi",
//     locations: [],
//   })
//   Object.entries(ranking.courses).forEach(([t, l]) => {
//     const lowerTitle = t.toLowerCase()
//     const title = capitaliseWords(t)
//
//     const locations = l.map((cl) => ({
//       value: cl.toLowerCase(),
//       label: capitaliseWords(cl),
//       numStudents: 0,
//     }))
//     courses.set(lowerTitle, {
//       locations,
//       label: title,
//       value: lowerTitle,
//     })
//   })
//   return courses
// }

function getBestCourse(
  courses: NewStudentResultCourse[]
): NewStudentResultCourse | null {
  if (courses.length === 0) return null
  const sortByPos = courses.sort((a, b) => {
    return a.position - b.position
  })

  if (courses.every((a) => a.canEnroll) || courses.every((a) => !a.canEnroll))
    return sortByPos[0]

  return sortByPos.filter((a) => a.canEnroll)[0]
}

function filterByCourse(
  ranking: NewRanking,
  courseTitle: string | null,
  courseLocation: string | null
): StudentTableRow[] {
  if (!courseTitle)
    return ranking.rows.map<StudentTableRow>((r) => {
      const bestCourse = getBestCourse(r.courses)
      return { ...r, course: bestCourse }
    })

  return ranking.rows
    .map<StudentTableRow>((r) => {
      const course =
        r.courses.find(
          (c) =>
            c.title.toLowerCase() === courseTitle.toLowerCase() &&
            (courseLocation
              ? c.location.toLowerCase() === courseLocation.toLowerCase()
              : c.location === "")
        ) ?? null
      return { ...r, course }
    })
    .filter(
      (
        r
      ): r is StudentTableRow & {
        course: NonNullable<StudentTableRow["course"]>
      } => r.course !== null
    )
    .sort((a, b) => a.course.position - b.course.position)
}

function isSelectedLocationValid(
  locations: string[],
  selectedLocation: string
): boolean {
  if (locations.length === 0) return false
  const foundLocation = locations.find(
    (cil) => cil.toLowerCase() === selectedLocation.toLowerCase()
  )

  return !!foundLocation
}

function fallbackSelectedLocation(
  locations: string[],
  selectedLocation: string | null
): string | null {
  if (selectedLocation) {
    const valid = isSelectedLocationValid(locations, selectedLocation)
    if (valid) return null
  }

  return locations[0]
}

function rankingOptions(id: string) {
  return queryOptions({
    queryKey: ["ranking", id],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:6767/output/rankings/${id}.json`
      )
      if (res.status === 404) throw new NotFoundError()
      return res.json() as Promise<NewRanking>
    },
    staleTime: 5 * 1000,
  })
}

function getCoursesMap(
  courses: NewRanking["courses"]
): CustomMap<string, string[]> {
  const map: CustomMap<string, string[]> = new CustomMap()
  for (const [course, locations] of Object.entries(courses)) {
    map.set(
      course.toLowerCase(),
      locations.map((l) => l.toLowerCase())
    )
  }

  return map
}

export const Route = createFileRoute("/$school/$year/$id/")({
  // loader: async () => {
  //   const res = await axios.get(
  //     "http://localhost:8120/2024_20102_491d_html.json"
  //   )
  //   const ranking: NewRanking = res.data
  //   return { ranking }
  // },
  params: {
    parse: ({ school, year, id }) => {
      if (isSchool(school)) return { school, year: parseInt(year, 10), id }
      else throw redirect({ to: "/" })
    },
  },
  loader: ({ params }) =>
    queryClient.ensureQueryData(rankingOptions(params.id)),
  errorComponent: ({ error }) => {
    if (error instanceof NotFoundError) return <p>Ranking not found</p>

    return <ErrorComponent error={error} />
  },
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const { data: ranking } = useSuspenseQuery(rankingOptions(params.id))

  //   const res = await axios.get(
  //     "http://localhost:8120/2024_20102_491d_html.json"
  //   )
  const { isMobile } = useContext(MobileContext)

  // const isAbsOrder = useMemo(
  //   () => selectedCourse === ABS_ORDER,
  //   [selectedCourse],
  // );
  //

  const courses = getCoursesMap(ranking.courses)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  const courseLocations = selectedCourse ? courses.get(selectedCourse) : null
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
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
  function handleCourseChange(value: string | null): void {
    setSelectedCourse(value)
    if (!value) return

    const courseLocations = courses.get(value)
    if (courseLocations) {
      const fallback = fallbackSelectedLocation(
        courseLocations,
        selectedLocation
      )
      if (fallback) setSelectedLocation(fallback)
      // updateAvailablePhases()
    }
  }
  //
  function handleLocationChange(value: string): void {
    if (!courseLocations) return
    setSelectedLocation(value)
    const fallback = fallbackSelectedLocation(courseLocations, value)
    if (fallback) setSelectedLocation(fallback)

    // updateAvailablePhases();
  }

  const table: StudentTableRow[] = useMemo(() => {
    return filterByCourse(ranking, selectedCourse, selectedLocation)
  }, [ranking, selectedCourse, selectedLocation])

  // const table: StudentTableRow[] = ranking.rows.map((r) => ({
  //   ...r,
  //   course: null,
  // }))

  return (
    <Page
      className={`flex items-center gap-4 px-0 ${isMobile ? "flex-col overflow-y-auto overflow-x-hidden" : ""
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
              options={courses.keysArr()}
              value={selectedCourse}
              onChange={handleCourseChange}
            />
            {courseLocations && selectedLocation && (
              <LocationsSelect
                value={selectedLocation}
                locations={courseLocations}
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
  )
}
