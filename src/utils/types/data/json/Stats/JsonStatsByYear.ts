import type School from "../../School"
import type JsonCourseStats from "./JsonCourseStats"

type JsonStatsByYear = {
  lastUpdate: string
  stats: {
    numStudents: number
    schools: {
      [key in School]: {
        numStudents: number
        list: JsonCourseStats[]
      }
    }
  }
}

export default JsonStatsByYear
