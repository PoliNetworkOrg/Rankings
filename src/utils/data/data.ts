import urlJoin from "url-join"
import { LINKS } from "../constants"
import { IndexBySchool } from "../types/data/Index/BySchool"
import School from "../types/data/School"
import Ranking from "../types/data/Ranking"

export class Data {
  protected static readonly _u = LINKS.dataBasePath
  protected static readonly indexUrl: string = urlJoin(
    this._u,
    "bySchoolYear.json"
  )

  public index?: IndexBySchool
  public schools: School[] = []
  public urls: string[] = []

  private cache: Map<string, Ranking> = new Map()

  public static async init() {
    const data = new Data()
    data.index = await fetch(Data.indexUrl).then(res => res.json())
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

  private getRankingFromCache(url: string): Ranking | undefined {
    return this.cache.get(url)
  }

  private async fetchAndCacheRanking(url: string): Promise<Ranking> {
    const ranking: Ranking = await fetch(url).then(res => res.json())
    this.cache.set(url, ranking)
    return ranking
  }

  public async loadRanking(
    school: School,
    year: number,
    phase: string
  ): Promise<Ranking> {
    const filename = phase.endsWith(".json") ? phase : phase + ".json"
    const url = urlJoin(Data._u, school, year.toString(), filename)

    const cached = this.getRankingFromCache(url)

    const ranking = cached ?? (await this.fetchAndCacheRanking(url))

    return ranking
  }
}
