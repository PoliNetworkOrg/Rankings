import School from "../School"
import RankingFile from "./RankingFile"

export type IndexBySchoolYearCourse = {
  schools: {
    [key in School]: Years
  }
}

type Years = {
  [year: number]: Courses
}

type Courses = {
  [course: string]: Locations
}

type Locations = {
  [location: string]: RankingFile[]
}
