import CustomMap from "@/utils/CustomMap";
import School from "../../School";
import { JsonRankingOrder } from "../../json/Ranking/JsonRanking";

type RankingFile = {
  link: string;
  name: string;
  basePath: string;
  school: School;
  year: number;
};

export type Phases = {
  groups: PhaseGroups;
  all: PhaseLink[];
};

export type PhaseGroups = CustomMap<string, PhaseGroupLabelValueNum>;
export type PhaseGroup = {
  label: string;
  value: string;
  phases: PhaseLink[];
};

type PhaseGroupLabelValueNum = {
  label: string;
  value: string;
  num?: number;
};

export type PhaseLink = {
  name: string;
  href: string;
  order: JsonRankingOrder;
  group: PhaseGroupLabelValueNum;
};

export default RankingFile;
