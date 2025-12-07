import type RankingFile from "../../parsed/Index/RankingFile"
import type JsonRankingSummary from "../Ranking/JsonRankingSummary"

type JsonCourseStats = {
  singleCourseJson: RankingFile
  stats: JsonRankingSummary
}

export default JsonCourseStats
