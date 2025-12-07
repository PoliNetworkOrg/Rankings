import type RankingFile from "../../parsed/Index/RankingFile"
import type School from "../../School"

type JsonIndexByYearSchool = {
  years: {
    [year: number]: {
      [key in School]: RankingFile[]
    }
  }
}

export default JsonIndexByYearSchool
