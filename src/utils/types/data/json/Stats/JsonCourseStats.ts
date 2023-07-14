import RankingFile from "../../parsed/Index/RankingFile";
import JsonRankingSummary from "../Ranking/JsonRankingSummary";

type JsonCourseStats = {
  singleCourseJson: RankingFile;
  stats: JsonRankingSummary;
};

export default JsonCourseStats;
