import type CustomMap from "@/utils/CustomMap"
import type { JsonRankingOrder } from "../../json/Ranking/JsonRanking"
import type School from "../../School"

type RankingFile = {
  link: string
  name: string
  basePath: string
  school: School
  year: number
  rankingOrder: JsonRankingOrder
}

export type Phases = {
  groups: PhaseGroups
  all: PhaseLink[]
}

export type PhaseGroups = CustomMap<string, PhaseGroup>

export type PhaseGroup = {
  label: string
  value: string
  phases: PhaseLink[]
}

export type PhaseLink = {
  name: string
  href: string
  order: JsonRankingOrder
  group: PhaseLinkGroup
}

export type PhaseLinkGroup = {
  label: string
  value: string
  num?: number
}

export default RankingFile
