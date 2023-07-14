import CustomMap from "../../../../CustomMap";
import School from "../../School";
import RankingFile from "./RankingFile";

export type IndexBySchoolYear = {
  schools: IndexBySchoolYear_SchoolsMap;
};

export type IndexBySchoolYear_SchoolsMap = CustomMap<
  School,
  IndexBySchoolYear_YearsMap
>;

export type IndexBySchoolYear_YearsMap = CustomMap<number, RankingFile[]>;
