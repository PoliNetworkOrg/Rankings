import { SCHOOLS } from "../../constants"

export type School = (typeof SCHOOLS)[number]
export function isSchool(school: string): school is School {
  return SCHOOLS.includes(school as School)
}
