import RankingFile from "../Index/RankingFile";
import RankingSummary from "../Ranking/RankingSummary";

type SingleCourseJson = RankingFile & {
  location: string;
};

type CourseStats = {
  singleCourseJson: SingleCourseJson;
  stats: RankingSummary;
};

export default CourseStats;
