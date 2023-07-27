import { SingleCourseJson } from "../../parsed/Stats/CourseStats";
import JsonRankingSummary from "../Ranking/JsonRankingSummary";

type JsonCourseStats = {
  singleCourseJson: SingleCourseJson;
  stats: JsonRankingSummary;
};

export default JsonCourseStats;
