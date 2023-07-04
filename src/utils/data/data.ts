import urlJoin from "url-join"
import { LINKS } from "../constants"
import School from "../types/data/School"
import Ranking from "../types/data/Ranking"
import { IndexBySchool } from "../types/data/Index/BySchool"
import { IndexBySchoolYearCourse } from "../types/data/Index/BySchoolYearCourse"
import CourseTable from "../types/data/Ranking/CourseTable"
import RankingFile, { PhaseLink } from "../types/data/Index/RankingFile"

export class Data {
  protected static readonly _u = LINKS.dataBasePath
  protected static readonly indexUrl: string = urlJoin(
    this._u,
    "bySchoolYear.json"
  )
  protected static readonly coursePhasesUrl: string = urlJoin(
    this._u,
    "bySchoolYearCourse.json"
  )

  public index?: IndexBySchool
  public coursesPhases?: IndexBySchoolYearCourse
  public schools: School[] = []
  public urls: string[] = []

  private cache: Map<string, Ranking> = new Map()

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

  public getYears(school: School): number[] | undefined {
    const obj = this.index?.schools[school]
    if (!obj) return

    const keys = Object.keys(obj)
    const years = keys.map(y => parseInt(y))
    return years
  }

  private getRankingFiles(
    school: School,
    year: number
  ): RankingFile[] | undefined {
    if (!this.index) return
    const files = this.index.schools[school][year]
    return files
  }

  private getCoursePhasesFiles(
    ranking: Ranking,
    course: CourseTable
  ): RankingFile[] | undefined {
    if (!this.coursesPhases) return

    const { title, location } = course

    // since we may have modified the title to display it in a nicer way
    // on the UI, we need to reset it to the json style (uppercase)
    const upperTitle = title.toUpperCase()

    // see: https://github.com/PoliNetworkOrg/GraduatorieScriptCSharp/pull/82
    const locationEmpty = !location || location === ""
    const fixedLocation = locationEmpty ? "0" : location.toUpperCase()

    const mainObj = this.coursesPhases.schools[ranking.school][ranking.year]
    const phasesFiles = mainObj[upperTitle][fixedLocation]

    return phasesFiles
  }

  private convertRankingFileToPhaseLink(file: RankingFile): PhaseLink {
    return {
      name: file.name,
      href: file.link.replace(".json", "")
    }
  }

  public getPhasesLinks(school: School, year: number): PhaseLink[] | undefined {
    const files = this.getRankingFiles(school, year)
    if (!files) return

    const phasesLinks = files.map(file =>
      this.convertRankingFileToPhaseLink(file)
    )

    return phasesLinks
  }

  public getCoursePhasesLinks(
    ranking: Ranking,
    course: CourseTable
  ): PhaseLink[] | undefined {
    const phasesFiles = this.getCoursePhasesFiles(ranking, course)
    if (!phasesFiles) return

    const phasesLinks = phasesFiles.map(file =>
      this.convertRankingFileToPhaseLink(file)
    )

    return phasesLinks
  }
}
