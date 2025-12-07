import type { NewRanking } from "../../json/new-ranking"
import type StudentResult from "./StudentResult"

type MeritTable = {
  headers: string[]
  rows: StudentResult[]
}

export type NewMeritTable = {
  headers: string[]
  rows: NewRanking["rows"]
}

export default MeritTable
