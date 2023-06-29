import School from "../School"
import RankingFile from "./RankingFile"

export type IndexBySchool = {
  schools: {
    [key in School]: Years
  }
}

type Years = {
  [year: number]: RankingFile[]
}
