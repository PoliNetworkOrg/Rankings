import RankingFile from "../../parsed/Index/RankingFile";
import School from "../../School";

type rankingFiles = RankingFile[];

type singleCourse = {
  [location: string]: rankingFiles;
};

type courses = {
  [course: string]: singleCourse;
};

type singleSchool = {
  [year: number]: courses;
};

type schools = {
  [key in School]: singleSchool;
};

type JsonIndexBySchoolYearCourse = {
  schools: schools;
};

export default JsonIndexBySchoolYearCourse;
