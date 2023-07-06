import School from "../../School"
import CourseTable from "./CourseTable"
import MeritTable from "./MeritTable"
import RankingSummary from "./RankingSummary"

type Ranking = {
  byCourse: CourseTable[]
  byMerit: MeritTable
  school: School
  phase: string
  extra: string
  lastUpdate: string
  year: number
  rankingSummary: RankingSummary
}

export default Ranking
