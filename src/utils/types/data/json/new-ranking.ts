import type School from "../School"

export type NewPhase = {
  raw: string
  stripped: string
  primary: number
  secondary: number
  language: "IT" | "EN"
  isExtraEu: boolean
}

export type NewStudentResultCourse = {
  title: string
  location: string
  position: number
  canEnroll: boolean
}

export type NewStudentResult = {
  id: string
  position: number
  canEnroll: boolean
  result: number
  sectionsResults: Record<string, number>
  ofa: Record<string, boolean>

  birthDate?: string
  englishResult?: number
  courses: Array<NewStudentResultCourse>
}

export type StudentTableRow = Omit<NewStudentResult, "courses"> & {
  course: NewStudentResultCourse | null
}

export type NewRanking = {
  id: string
  school: School
  year: number
  phase: NewPhase
  courses: Record<string, string[]>
  rows: Array<NewStudentResult>
}
