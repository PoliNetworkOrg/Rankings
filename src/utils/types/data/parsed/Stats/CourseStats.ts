import RankingFile from "../Index/RankingFile";
import RankingSummary from "../Ranking/RankingSummary";

export type SingleCourseJson = RankingFile & {
  location: string;
};

type CourseStats = {
  singleCourseJson: SingleCourseJson;
  stats: RankingSummary;
};

export default CourseStats;
