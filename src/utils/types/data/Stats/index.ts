import School from "../School"
import CourseStats from "./CourseStats"

type StatsByYear = {
  numStudents: number
  schools: StatsBySchool
}

type StatsBySchool = {
  [key in School]: SchoolStats
}

export type SchoolStats = {
  numStudents: number
  list: CourseStats[]
}

export default StatsByYear
