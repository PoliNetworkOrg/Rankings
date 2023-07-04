import School from "../School"

type RankingFile = {
  link: string
  name: string
  basePath: string
  school: School
  year: number
}

export type PhaseLink = {
  name: string
  href: string
}

export default RankingFile
