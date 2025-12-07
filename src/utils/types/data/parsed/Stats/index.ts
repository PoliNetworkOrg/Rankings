import type CustomMap from "../../../../CustomMap"
import type School from "../../School"
import type CourseStats from "./CourseStats"

type StatsByYear = {
  lastUpdate: string
  stats: StatsBySchoolMap
}

// key = school
type StatsBySchoolMap = CustomMap<School, SchoolStats>

type SchoolStats = {
  numStudents: number
  list: CourseStats[]
}

export default StatsByYear
