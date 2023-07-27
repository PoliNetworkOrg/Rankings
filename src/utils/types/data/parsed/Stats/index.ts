import CustomMap from "../../../../CustomMap";
import School from "../../School";
import CourseStats from "./CourseStats";

type StatsByYear = {
  lastUpdate: string;
  stats: StatsBySchoolMap;
};

type SchoolStatsWithCourses = {
  numStudents: number;
  list: CourseStats[];
};

// key = school
type StatsBySchoolMap = CustomMap<
  School,
  SchoolStatsWithCourses
>;

export default StatsByYear;
