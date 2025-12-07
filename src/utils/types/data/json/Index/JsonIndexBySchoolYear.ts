import type RankingFile from "../../parsed/Index/RankingFile"
import type School from "../../School"

type JsonIndexBySchoolYear = {
  schools: {
    [key in School]: {
      [year: number]: RankingFile[]
    }
  }
}

export default JsonIndexBySchoolYear
