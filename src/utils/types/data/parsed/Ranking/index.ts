import School from "../../School";
import { JsonRankingOrder } from "../../json/Ranking/JsonRanking";
import CourseTable from "./CourseTable";
import MeritTable from "./MeritTable";
import RankingSummary from "./RankingSummary";

type Ranking = {
  byCourse: CourseTable[];
  byMerit: MeritTable;
  rankingOrder: RankingOrder;
  school: School;
  phase: string;
  extra: string;
  lastUpdate: string;
  year: number;
  rankingSummary: RankingSummary;
};

type RankingOrder = JsonRankingOrder;

export default Ranking;
