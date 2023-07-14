import CustomMap from "../../../../CustomMap";
import School from "../../School";
import CourseStats from "./CourseStats";

type StatsByYear = {
  lastUpdate: string;
  stats: StatsBySchoolMap;
};

// key = school
type StatsBySchoolMap = CustomMap<
  School,
  {
    numStudents: number;
    list: CourseStats[];
  }
>;

export default StatsByYear;
