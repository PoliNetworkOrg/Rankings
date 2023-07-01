import School from "../School"
import CourseStats from "./CourseStats"

type Stats = {
  lastUpdate: string
  stats: StatsByYear
}

type StatsByYear = {
  [year: number]: {
    numStudents: number
    schools: StatsBySchool
  }
}

type StatsBySchool = {
  [key in School]: {
    numStudents: number
    list: CourseStats[]
  }
}

export default Stats
