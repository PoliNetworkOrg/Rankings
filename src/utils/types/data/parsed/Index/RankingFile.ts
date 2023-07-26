import School from "../../School";
import { JsonRankingOrder } from "../../json/Ranking/JsonRanking";

type RankingFile = {
  link: string;
  name: string;
  basePath: string;
  school: School;
  year: number;
};

export type PhaseLink = {
  label: string;
  name: string;
  href: string;
  order: JsonRankingOrder;
  group?: string;
  groupNum?: number;
};

export default RankingFile;
