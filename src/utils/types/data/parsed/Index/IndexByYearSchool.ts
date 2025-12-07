import type CustomMap from "../../../../CustomMap"
import type { School } from "../../school"
import type RankingFile from "./RankingFile"

export type IndexByYearSchool = {
  years: IndexByYearSchool_YearsMap
}

export type IndexByYearSchool_YearsMap = CustomMap<
  number,
  IndexByYearSchool_SchoolsMap
>

export type IndexByYearSchool_SchoolsMap = CustomMap<School, RankingFile[]>
