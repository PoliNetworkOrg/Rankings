import RankingFile from "../../parsed/Index/RankingFile";
import School from "../../School";

type rankingFiles = RankingFile[];

type singleSchool = {
  [year: number]: rankingFiles;
};

type schools = {
  [key in School]: singleSchool;
};

type JsonIndexBySchoolYear = {
  schools: schools;
};

export default JsonIndexBySchoolYear;
