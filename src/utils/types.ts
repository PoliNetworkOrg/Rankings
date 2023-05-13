export type School = "Ingegneria" | "Architettura" | "Design" | "Urbanistica"

export type TableData = (string | number)[][]
export type Structure = {
  school: School
  years: {
    year: number
    phases: {
      phase: string
      global: TableData
      courses: {
        name: string
        table: TableData
      }[]
    }[]
  }[]
}[]
