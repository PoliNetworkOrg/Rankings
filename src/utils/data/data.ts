import { LINKS } from "../constants"
import Path from "../path"
import { IndexBySchool } from "../types/data/Index/BySchool"
import School from "../types/data/School"

export class Data {
  protected static readonly _u = LINKS.dataBasePath
  protected static readonly indexUrl: string = Path.join(
    this._u,
    "bySchoolYear.json"
  )

  private index?: IndexBySchool
  public schools: School[] = []
  public years: Set<number> = new Set()
  public urls: string[] = []

  public static async init() {
    const data = new Data()
    console.log(Data.indexUrl)
    data.index = await fetch(Data.indexUrl).then(res => res.json())
    if (!data.index) return null

    for (const [school, years] of Object.entries(data.index.schools)) {
      data.schools.push(school as School)
      for (const [year, files] of Object.entries(years)) {
        data.years.add(parseInt(year))
        for (const file of files) {
          const url = Path.join(this._u, file.basePath, file.link)
          data.urls.push(url)
        }
      }
    }
    return data
  }
}
