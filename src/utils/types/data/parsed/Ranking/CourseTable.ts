import MeritTable from "./MeritTable"

type CourseTable = MeritTable & {
  title: string
  location?: string
  sections: string[]
}

export default CourseTable
