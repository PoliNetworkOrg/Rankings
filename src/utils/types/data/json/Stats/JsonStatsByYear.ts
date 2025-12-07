import type { School } from "../../school"
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
