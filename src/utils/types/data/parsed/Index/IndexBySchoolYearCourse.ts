import type CustomMap from "../../../../CustomMap"
import type { School } from "../../school"
import type RankingFile from "./RankingFile"

export type IndexBySchoolYearCourse = {
  schools: IndexBySchoolYearCourse_SchoolsMap
}

export type IndexBySchoolYearCourse_SchoolsMap = CustomMap<
  School,
  IndexBySchoolYearCourse_YearsMap
>

// key = year
export type IndexBySchoolYearCourse_YearsMap = CustomMap<
  number,
  IndexBySchoolYearCourse_CoursesMap
>

// key = course title
export type IndexBySchoolYearCourse_CoursesMap = CustomMap<
  string,
  IndexBySchoolYearCourse_LocationsMap
>

// key = course location
export type IndexBySchoolYearCourse_LocationsMap = CustomMap<
  string,
  RankingFile[]
>
