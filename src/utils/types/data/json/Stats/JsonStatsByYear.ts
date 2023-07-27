import School from "../../School";
import JsonCourseStats from "./JsonCourseStats";

type Schools = {
  [key in School]: {
    numStudents: number;
    list: JsonCourseStats[];
  };
};

type JsonStatsByYearMultiple = {
  numStudents: number;
  schools: Schools;
};

type JsonStatsByYear = {
  lastUpdate: string;
  stats: JsonStatsByYearMultiple;
};

export default JsonStatsByYear;
