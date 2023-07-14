import School from "../../School";
import JsonCourseStats from "./JsonCourseStats";

type JsonStatsByYear = {
  numStudents: number;
  schools: {
    [key in School]: {
      numStudents: number;
      list: JsonCourseStats[];
    };
  };
};

export default JsonStatsByYear;
