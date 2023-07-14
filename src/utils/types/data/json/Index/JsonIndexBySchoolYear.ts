import RankingFile from "../../parsed/Index/RankingFile";
import School from "../../School";

type JsonIndexBySchoolYear = {
  schools: {
    [key in School]: {
      [year: number]: RankingFile[];
    };
  };
};

export default JsonIndexBySchoolYear;
