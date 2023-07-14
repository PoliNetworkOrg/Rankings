import CustomMap from "../../../../CustomMap";
import School from "../../School";
import CourseStats from "./CourseStats";

type StatsByYear = {
  numStudents: number;
  schools: StatsBySchoolMap;
};

// key = school
export type StatsBySchoolMap = CustomMap<School, SchoolStats>;

export type SchoolStats = {
  numStudents: number;
  list: CourseStats[];
};

export default StatsByYear;
