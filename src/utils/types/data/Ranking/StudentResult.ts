type StudentResult = {
  birthDate?: string
  canEnroll?: boolean
  canEnrollInto?: string
  englishCorrectAnswers?: number
  id?: string
  positionAbsolute?: number
  positionCourse?: number
  result?: number
  ofa?: Ofas
  sectionsResults?: SectionsResults
}

type Ofas = {
  [name: string]: boolean
}

type SectionsResults = {
  [name: string]: number
}

export default StudentResult
