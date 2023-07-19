import School from "../../School";
import JsonCourseTable from "./JsonCourseTable";
import JsonMeritTable from "./JsonMeritTable";
import JsonRankingSummary from "./JsonRankingSummary";

type JsonRanking = {
  byCourse: JsonCourseTable[];
  byMerit: JsonMeritTable;
  school: School;
  rankingOrder: JsonRankingOrder;
  extra: string;
  lastUpdate: string;
  year: number;
  rankingSummary: JsonRankingSummary;
};

export type JsonRankingOrder = {
  anticipata: boolean;
  extraEu: boolean;
  phase: string;
  primary: number;
  secondary: number;
};

export default JsonRanking;
