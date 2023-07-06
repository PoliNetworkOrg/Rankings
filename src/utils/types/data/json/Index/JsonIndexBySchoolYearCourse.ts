import RankingFile from "../../parsed/Index/RankingFile"
import School from "../../School"

type JsonIndexBySchoolYearCourse = {
  schools: {
    [key in School]: {
      [year: number]: {
        [course: string]: {
          [location: string]: RankingFile[]
        }
      }
    }
  }
}

export default JsonIndexBySchoolYearCourse
