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
  phase: string;
  primary?: number;
  secondary?: number;
  isAnticipata: boolean;
  isExtraEu: boolean;
  isEnglish: boolean;
};

export default JsonRanking;
