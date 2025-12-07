import type RankingFile from "../../parsed/Index/RankingFile"
import type { School } from "../../school"

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
