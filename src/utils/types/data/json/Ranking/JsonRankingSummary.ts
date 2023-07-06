type JsonRankingSummary = {
  courseSummarized: JsonCourseSummary[]
  howManyCanEnroll: number
  howManyStudents: number
  resultsSummarized: JsonResultsSummary
}

export type JsonCourseSummary = {
  averageBirthYear: number
  averageEnglishCorrectAnswers: number
  averageOfWhoPassed: number
  averageScoresOfAllStudents: number
  minScoreToEnroll: number
  location: string
  title: string
  averagePartialScores?: {
    [section: string]: number
  }
  howManyOfa?: {
    [ofa: string]: number
  }
}

export type JsonResultsSummary = {
  [score: number]: number
}

export default JsonRankingSummary
