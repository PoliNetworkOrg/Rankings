import CustomMap from "../../../../CustomMap";
import School from "../../School";
import RankingFile from "./RankingFile";

export type IndexByYearSchool = {
  years: IndexByYearSchool_YearsMap;
};

export type IndexByYearSchool_YearsMap = CustomMap<
  number,
  IndexByYearSchool_SchoolsMap
>;

export type IndexByYearSchool_SchoolsMap = CustomMap<School, RankingFile[]>;
