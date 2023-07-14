import urlJoin from "url-join";
import { LINKS } from "../constants";
import { IndexBySchoolYear } from "../types/data/parsed/Index/IndexBySchoolYear";
import { IndexBySchoolYearCourse } from "../types/data/parsed/Index/IndexBySchoolYearCourse";
import School from "../types/data/School";
import Ranking from "../types/data/parsed/Ranking";
import JsonParser from "./jsonParser";
import RankingFile, { PhaseLink } from "../types/data/parsed/Index/RankingFile";
import CourseTable from "../types/data/parsed/Ranking/CourseTable";
import CustomMap from "../CustomMap";
import { CourseSummary } from "../types/data/parsed/Ranking/RankingSummary";
import { IndexByYearSchool } from "../types/data/parsed/Index/IndexByYearSchool";
import StatsByYear, { SchoolStats } from "../types/data/parsed/Stats";

export default class Data {
  protected static readonly _u = LINKS.dataBasePath;
  protected static readonly indexBySchoolYearUrl: string = urlJoin(
    this._u,
    "bySchoolYear.json",
  );
  protected static readonly indexBySchoolYearCourseUrl: string = urlJoin(
    this._u,
    "bySchoolYearCourse.json",
  );
  protected static readonly indexByYearSchoolUrl: string = urlJoin(
    this._u,
    "byYearSchool.json",
  );
  protected static readonly baseStatsUrl: string = urlJoin(this._u, "stats");

  public indexBySchoolYear?: IndexBySchoolYear;
  public indexBySchoolYearCourse?: IndexBySchoolYearCourse;
  public indexByYearSchool?: IndexByYearSchool;
  public schools: School[] = [];
  public urls: string[] = [];

  private cache: CustomMap<string, Ranking> = new CustomMap();
  private statsByYear: CustomMap<number, StatsByYear> = new CustomMap();

  public static async init() {
    const data = new Data();
    data.indexBySchoolYear = await fetch(Data.indexBySchoolYearUrl)
      .then((res) => res.json())
      .then((json) => JsonParser.parseIndexBySchoolYear(json));

    data.indexBySchoolYearCourse = await fetch(Data.indexBySchoolYearCourseUrl)
      .then((res) => res.json())
      .then((json) => JsonParser.parseIndexBySchoolYearCourse(json));

    data.schools = data.indexBySchoolYear?.schools.keysArr() ?? [];

    data.indexBySchoolYear?.schools.forEach((years) =>
      years.forEach((files) =>
        files.forEach((file) => {
          const url = urlJoin(this._u, file.basePath, file.link);
          data.urls.push(url);
        }),
      ),
    );

    data.indexByYearSchool = await fetch(Data.indexByYearSchoolUrl)
      .then((res) => res.json())
      .then((json) => JsonParser.parseIndexByYearSchool(json));

    if (data.indexByYearSchool)
      for (const year of data.indexByYearSchool.years.keys()) {
        const stats = await data.fetchYearStats(year);
        data.statsByYear.set(year, stats);
      }

    return data;
  }

  private tryGetRankingFromCache(url: string): Ranking | undefined {
    return this.cache.get(url);
  }

  private async fetchAndCacheRanking(
    url: string,
  ): Promise<Ranking | undefined> {
    const ranking: Ranking | undefined = await fetch(url)
      .then((res) => res.json())
      .then((json) => JsonParser.parseRanking(json))
      .catch((err) => {
        console.error(err);
        return undefined;
      });

    if (ranking) this.cache.set(url, ranking);
    return ranking;
  }

  private async getRanking(url: string): Promise<Ranking | undefined> {
    const cached = this.tryGetRankingFromCache(url);

    const ranking = cached ?? (await this.fetchAndCacheRanking(url));

    return ranking;
  }

  public async loadRanking(
    school: School,
    year: number,
    phase: string,
  ): Promise<Ranking | undefined> {
    const files = this.getRankingFiles(school, year);
    if (!files) return;

    const lowerPhase = phase.toLowerCase();
    const fixedPhase = lowerPhase.endsWith(".json")
      ? lowerPhase
      : lowerPhase + ".json";

    const file = files.find((f) => f.link.toLowerCase() === fixedPhase);
    if (!file) return;

    const url = urlJoin(Data._u, school, year.toString(), file.link);
    const ranking = await this.getRanking(url);
    return ranking;
  }

  public getYears(school: School): number[] | undefined {
    const schoolMap = this.indexBySchoolYear?.schools.get(school);
    return schoolMap?.keysArr();
  }

  private getRankingFiles(
    school: School,
    year: number,
  ): RankingFile[] | undefined {
    const files = this.indexBySchoolYear?.schools.get(school)?.get(year);
    return files;
  }

  private getCoursePhasesFiles(
    ranking: Ranking,
    course: CourseTable,
  ): RankingFile[] | undefined {
    if (!this.indexBySchoolYearCourse) return;

    const { title, location } = course;

    // since we may have modified the title to display it in a nicer way
    // on the UI, we need to reset it to the json style (uppercase)
    const upperTitle = title.toUpperCase();

    // see: https://github.com/PoliNetworkOrg/GraduatorieScriptCSharp/pull/82
    const locationEmpty = !location || location === "";
    const fixedLocation = locationEmpty ? "0" : location.toUpperCase();

    const mainObj = this.indexBySchoolYearCourse.schools
      .get(ranking.school)
      ?.get(ranking.year);
    const phasesFiles = mainObj?.get(upperTitle)?.get(fixedLocation);

    return phasesFiles;
  }

  private convertRankingFileToPhaseLink(file: RankingFile): PhaseLink {
    return {
      name: file.name,
      href: file.link.replace(".json", "").toLowerCase(),
    };
  }

  public getPhasesLinks(school: School, year: number): PhaseLink[] | undefined {
    const files = this.getRankingFiles(school, year);
    if (!files) return;

    const phasesLinks = files.map((file) =>
      this.convertRankingFileToPhaseLink(file),
    );

    return phasesLinks;
  }

  public getCoursePhasesLinks(
    ranking: Ranking,
    course: CourseTable,
  ): PhaseLink[] | undefined {
    const phasesFiles = this.getCoursePhasesFiles(ranking, course);
    if (!phasesFiles) return;

    const phasesLinks = phasesFiles.map((file) =>
      this.convertRankingFileToPhaseLink(file),
    );

    return phasesLinks;
  }

  private getYearStatsUrl(year: number | string): string {
    return urlJoin(Data.baseStatsUrl, year.toString() + ".json");
  }

  private async fetchYearStats(year: number | string): Promise<StatsByYear> {
    const url = this.getYearStatsUrl(year);
    const stats: StatsByYear = await fetch(url)
      .then((res) => res.json())
      .then((json) => JsonParser.parseStatsByYear(json));

    return stats;
  }

  public getStats(school: School, year: number): SchoolStats | undefined {
    const stats = this.statsByYear.get(year);
    return stats?.schools.get(school);
  }

  public async getCourseStats(
    school: School,
    year: number,
    phaseName: string,
    course: CourseTable,
  ): Promise<CourseSummary | undefined> {
    try {
      const stats = this.getStats(school, year);
      const courseStats = stats?.list
        .find((s) => {
          const csPhaseName = s.singleCourseJson.name;
          return csPhaseName === phaseName;
        })
        ?.stats.courseSummarized.find((cs) => {
          return (
            cs.title === course.title.toUpperCase() &&
            cs.location === course.location?.toUpperCase()
          );
        });

      return courseStats;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }
}
