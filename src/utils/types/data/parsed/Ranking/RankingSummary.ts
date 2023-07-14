import CustomMap from "../../../../CustomMap"

type RankingSummary = {
  courseSummarized: CourseSummary[]
  howManyCanEnroll: number
  howManyStudents: number
  resultsSummarized: ResultsSummary
}

// key = howManyGotThatScore
export type ResultsSummary = CustomMap<number, number>

export type CourseSummary = {
  averageBirthYear: number
  averageEnglishCorrectAnswers: number
  averageOfWhoPassed: number
  averageScoresOfAllStudents: number
  minScoreToEnroll: number
  location: string
  title: string
  averagePartialScores: AveragePartialScoresMap
  howManyOfa: HowManyOfaMap
  howManyCanEnroll: number
  howManyStudents: number
}

// key = section
export type AveragePartialScoresMap = CustomMap<string, number>

// key = ofa id
export type HowManyOfaMap = CustomMap<string, number>

export default RankingSummary
