import School from "../../School"
import JsonCourseTable from "./JsonCourseTable"
import JsonMeritTable from "./JsonMeritTable"
import JsonRankingSummary from "./JsonRankingSummary"

type JsonRanking = {
  byCourse: JsonCourseTable[]
  byMerit: JsonMeritTable
  school: School
  phase: string
  extra: string
  lastUpdate: string
  year: number
  rankingSummary: JsonRankingSummary
}

export default JsonRanking
