import RankingFile from "../../parsed/Index/RankingFile";
import School from "../../School";

type JsonIndexByYearSchool = {
  years: {
    [year: number]: {
      [key in School]: RankingFile[];
    };
  };
};

export default JsonIndexByYearSchool;
