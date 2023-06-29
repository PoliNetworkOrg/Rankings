import School from "../School"
import RankingFile from "./RankingFile"

export type IndexByYear = {
  years: {
    [year: number]: Schools
  }
}

type Schools = {
  [key in School]: RankingFile[]
}
