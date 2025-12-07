import type School from "../../School"
import type JsonCourseTable from "./JsonCourseTable"
import type JsonMeritTable from "./JsonMeritTable"
import type JsonRankingSummary from "./JsonRankingSummary"

type JsonRanking = {
  byCourse: JsonCourseTable[]
  byMerit: JsonMeritTable
  school: School
  rankingOrder: JsonRankingOrder
  extra: string
  lastUpdate: string
  year: number
  rankingSummary: JsonRankingSummary
}

export type JsonRankingOrder = {
  phase: string
  primary?: number
  secondary?: number
  isAnticipata: boolean
  isExtraEu: boolean
  isEnglish: boolean
}

export default JsonRanking
