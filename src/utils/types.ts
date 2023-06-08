export type School = "Ingegneria" | "Architettura" | "Design" | "Urbanistica"

export type TableData = (string | number)[][]

export type Course = {
  name: string
  table: TableData
}

export type Phase = {
  phase: string
  global: TableData
  courses: Course[]
}

export type Structure = {
  school: School
  years: {
    year: number
    phases: Phase[]
  }[]
}[]

export type EnrollStats = {
  candidates: number
  allowed: number
  allowedPct: string
  minScoreToPass: number
} | null
