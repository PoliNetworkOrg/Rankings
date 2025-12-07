import type CustomMap from "../../../../CustomMap"
import type School from "../../School"
import type RankingFile from "./RankingFile"

export type IndexBySchoolYear = {
  schools: IndexBySchoolYear_SchoolsMap
}

export type IndexBySchoolYear_SchoolsMap = CustomMap<
  School,
  IndexBySchoolYear_YearsMap
>

export type IndexBySchoolYear_YearsMap = CustomMap<number, RankingFile[]>
