type RankingSummary = {
  courseSummarized: CourseSummary[]
  howManyCanEnroll: number
  howManyStudents: number
  resultsSummarized: ResultsSummary
}

type ResultsSummary = {
  // score = howManyGotThatScore
  [score: number]: number
}

export type CourseSummary = {
  averageBirthYear: number
  averageEnglishCorrectAnswers: number
  averageOfWhoPassed: number
  averageScoresOfAllStudents: number
  minScoreToEnroll: number
  location: string
  title: string
  averagePartialScores: AveragePartialScores
  howManyOfa: HowManyOfa
}

type AveragePartialScores = {
  [section: string]: number
}

type HowManyOfa = {
  [ofa: string]: number
}

export default RankingSummary
