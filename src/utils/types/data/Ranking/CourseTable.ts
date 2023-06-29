import BaseTable from "./BaseTable"

type CourseTable = BaseTable & {
  title: string
  location: string
  sections: string[]
}

export default CourseTable
