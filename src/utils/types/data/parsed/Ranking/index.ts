import type { JsonRankingOrder } from "../../json/Ranking/JsonRanking"
import type School from "../../School"
import type CourseTable from "./CourseTable"
import type MeritTable from "./MeritTable"
import type RankingSummary from "./RankingSummary"

type Ranking = {
  byCourse: CourseTable[]
  byMerit: MeritTable
  rankingOrder: RankingOrder
  school: School
  phase: string
  extra: string
  lastUpdate: string
  year: number
  rankingSummary: RankingSummary
}

export type RankingOrder = JsonRankingOrder

export default Ranking
