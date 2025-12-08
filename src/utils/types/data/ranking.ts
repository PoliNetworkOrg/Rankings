import type { Phase } from "./phase"
import type { School } from "./school"

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
  phase: Phase
  courses: Record<string, string[]>
  rows: Array<NewStudentResult>
}

export type IndexEntry = {
  id: string
  school: School
  year: number
  phase: Phase
}

export type BySchoolYearIndex = Record<School, Record<number, IndexEntry[]>>
