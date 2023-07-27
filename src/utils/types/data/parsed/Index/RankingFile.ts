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

export type PhaseGroups = CustomMap<string, PhaseGroup>;
export type PhaseGroup = {
  label: string;
  value: string;
  phases: PhaseLink[];
};

export type PhaseLink = {
  name: string;
  href: string;
  order: JsonRankingOrder;
  group: {
    label: string;
    value: string;
    num?: number;
  };
};

export default RankingFile;
