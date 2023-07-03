import urlJoin from "url-join"
import { LINKS } from "../constants"
import School from "../types/data/School"
import Ranking from "../types/data/Ranking"
import { IndexBySchool } from "../types/data/Index/BySchool"
import { IndexBySchoolYearCourse } from "../types/data/Index/BySchoolYearCourse"
import CourseTable from "../types/data/Ranking/CourseTable"

export class Data {
  protected static readonly _u = LINKS.dataBasePath
  protected static readonly indexUrl: string = urlJoin(
    this._u,
    "bySchoolYear.json"
  )
  protected static readonly coursePhasesUrl: string = urlJoin(
    this._u,
    "bySchoolYear.json"
  )

  public index?: IndexBySchool
  public coursesPhases?: IndexBySchoolYearCourse
  public schools: School[] = []
  public urls: string[] = []

  public static async init() {
    const data = new Data()
    data.index = await fetch(Data.indexUrl).then(res => res.json())
    data.coursesPhases = await fetch(Data.coursePhasesUrl).then(res =>
      res.json()
    )
    if (!data.index) return null

    for (const [school, years] of Object.entries(data.index.schools)) {
      data.schools.push(school as School)
      for (const files of Object.values(years)) {
        for (const file of files) {
          const url = urlJoin(this._u, file.basePath, file.link)
          data.urls.push(url)
        }
      }
    }
    return data
  }

  public async loadRanking(
    school: School,
    year: number,
    phase: string
  ): Promise<Ranking> {
    const filename = phase.endsWith(".json") ? phase : phase + ".json"
    const url = urlJoin(Data._u, school, year.toString(), filename)
    const json = await fetch(url).then(res => res.json())
    return json as Ranking
  }

  public getCoursePhases(ranking: Ranking, course: CourseTable): string[] {
    const { title, location } = course
    const files =
      this.coursesPhases?.schools[ranking.school][ranking.year][title][
        location
      ] ?? []

    const phases = files.map(file =>
      file.link.endsWith(".json") ? file.link.split(".json")[0] : file.link
    )

    return phases
  }
}
