import type RankingFile from "../Index/RankingFile"
import type RankingSummary from "../Ranking/RankingSummary"

type CourseStats = {
  singleCourseJson: RankingFile
  stats: RankingSummary
}

export default CourseStats
