import { useQuery } from "@tanstack/react-query"
import {
  createFileRoute,
  ErrorComponent,
  redirect,
} from "@tanstack/react-router"
import { useContext, useMemo, useState } from "react"
import { queryClient } from "@/app/__root"
import Alert from "@/components/custom-ui/Alert"
import Page from "@/components/custom-ui/Page.tsx"
import Spinner from "@/components/custom-ui/Spinner"
import PathBreadcrumb from "@/components/PathBreadcrumb.tsx"
import MobileContext from "@/contexts/MobileContext"
import { useQueries } from "@/hooks/use-queries"
import { useSettingsStore } from "@/stores/settings-store"
import CustomMap from "@/utils/CustomMap"
import { NotFoundError } from "@/utils/errors.ts"
import { getActiveQueries } from "@/utils/queries"
import type {
  NewRanking,
  NewStudentResultCourse,
  StudentTableRow,
} from "@/utils/types/data/ranking"
import { isSchool } from "@/utils/types/data/school"
import { CourseCombobox } from "./-course-combobox"
import LocationsSelect from "./-location-select"
import Table from "./-Table"

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

export const Route = createFileRoute("/_home/$school/$year/$id/")({
  params: {
    parse: ({ school, year, id }) => {
      if (isSchool(school)) return { school, year: parseInt(year, 10), id }
      else throw redirect({ to: "/" })
    },
  },
  loader: ({ params }) => {
    const state = useSettingsStore.getState()
    const queries = getActiveQueries(state)
    queryClient.prefetchQuery(queries.ranking(params.id))
  },
  errorComponent: ({ error }) => {
    if (error instanceof NotFoundError) return <p>Ranking not found</p>

    return <ErrorComponent error={error} />
  },
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const queries = useQueries()
  const {
    data: ranking,
    isPending,
    error,
  } = useQuery(queries.ranking(params.id))

  if (isPending) return <Spinner />
  if (error)
    return (
      <Page>
        <Alert level="error">{error.message}</Alert>
      </Page>
    )
  return <Component ranking={ranking} />
}

function Component({ ranking }: { ranking: NewRanking }) {
  const { isMobile } = useContext(MobileContext)

  const courses = getCoursesMap(ranking.courses)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  const courseLocations = selectedCourse ? courses.get(selectedCourse) : null
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  function handleCourseChange(value: string | null): void {
    setSelectedCourse(value)
    if (!value) {
      setSelectedLocation(null)
      return
    }

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
    if (!courseLocations || courseLocations.length === 0) {
      setSelectedLocation(null)
      return
    }

    setSelectedLocation(value)
    const fallback = fallbackSelectedLocation(courseLocations, value)
    if (fallback) setSelectedLocation(fallback)
  }

  const table: StudentTableRow[] = useMemo(() => {
    return filterByCourse(ranking, selectedCourse, selectedLocation)
  }, [ranking, selectedCourse, selectedLocation])

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
