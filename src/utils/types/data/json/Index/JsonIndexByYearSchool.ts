import RankingFile from "../../parsed/Index/RankingFile";
import School from "../../School";

type rankingFiles = RankingFile[];

type singleYear = {
  [key in School]: rankingFiles;
};

type years = {
  [year: number]: singleYear;
};

type JsonIndexByYearSchool = {
  years: years;
};

export default JsonIndexByYearSchool;
