import urlJoin from "url-join";
import { LINKS, NO_GROUP } from "../constants";
import { IndexBySchoolYear } from "../types/data/parsed/Index/IndexBySchoolYear";
import { IndexBySchoolYearCourse } from "../types/data/parsed/Index/IndexBySchoolYearCourse";
import School from "../types/data/School";
import Ranking from "../types/data/parsed/Ranking";
import JsonParser from "./jsonParser";
import RankingFile, {
  PhaseLink,
  Phases,
  PhaseGroups,
  PhaseGroup,
} from "../types/data/parsed/Index/RankingFile";
import CourseTable from "../types/data/parsed/Ranking/CourseTable";
import CustomMap from "../CustomMap";
import { CourseSummary } from "../types/data/parsed/Ranking/RankingSummary";
import { IndexByYearSchool } from "../types/data/parsed/Index/IndexByYearSchool";
import StatsByYear, { SchoolStats } from "../types/data/parsed/Stats";
import { numberToOrdinalString, numberToRoman } from "../strings/numbers";
import { capitaliseWords } from "../strings/capitalisation";
import { sortDesUrbPhases, sortIngArcPhases } from "./sortPhases";

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

  private convertRankingToPhaseLink(
    file: RankingFile,
    ranking: Ranking,
  ): PhaseLink {
    const order = ranking.rankingOrder;
    if (order.phase.toLowerCase() === "extra-ue") {
      order.phase = "Extra-UE";
    }
    if (ranking.school === "Architettura" || ranking.school === "Ingegneria") {
      if (order.extraEu && !order.secondary) {
        order.secondary = 1;
        if (ranking.school === "Ingegneria") {
          order.primary = 2;
        }
      }

      if (!order.secondary && order.primary === 3) {
        order.phase = "Unica graduatoria";
      }
    }
    const name = order.secondary
      ? `${numberToRoman(order.secondary || 1)} graduatoria ${
          order.extraEu ? "(Extra-UE)" : ""
        }`
      : order.phase;

    const phaseNum = order.primary
      ? numberToOrdinalString(order.primary, "a")
      : undefined;

    const groupLabel = phaseNum
      ? `${capitaliseWords(phaseNum)} fase`
      : NO_GROUP;

    const groupValue = groupLabel.toLowerCase();

    return {
      name,
      href: file.link.replace(".json", "").toLowerCase(),
      order,
      group: {
        label: groupLabel === NO_GROUP ? "Generale" : groupLabel,
        value: groupValue,
        num: order.primary,
      },
    };
  }

  private fixCourseLocationTitle(course: CourseTable): CourseTable {
    // since we may have modified the title to display it in a nicer way
    // on the UI, we need to reset it to the json style (uppercase)
    const title = course.title.toUpperCase();

    // see: https://github.com/PoliNetworkOrg/GraduatorieScriptCSharp/pull/82
    const location = course.location;
    const locationEmpty = !location || location === "";
    const fixedLocation = locationEmpty ? "0" : location.toUpperCase();

    const newCourse: CourseTable = {
      title,
      location: fixedLocation,
      sections: course.sections,
      headers: course.headers,
      rows: course.rows,
    };

    return newCourse;
  }

  private isCourseInRanking(ranking: Ranking, course: CourseTable): boolean {
    if (ranking.byCourse.length === 0) return false;

    const courses = ranking.byCourse.map((course) =>
      this.fixCourseLocationTitle(course),
    );
    const { title, location } = this.fixCourseLocationTitle(course);

    const found = courses.find(
      (a) => a.title === title && a.location === location,
    );

    return !!found;
  }

  private sortPhaseLinks(school: School, phases: PhaseLink[]): PhaseLink[] {
    if (school === "Architettura" || school === "Ingegneria")
      return phases.sort((a, b) => sortIngArcPhases(a, b));

    if (school === "Urbanistica" || school === "Design")
      return phases.sort((a, b) => sortDesUrbPhases(a, b));

    return phases;
  }

  private getPhaseGroups(phases: PhaseLink[]): PhaseGroups {
    const groups: PhaseGroups = new CustomMap();

    if (phases.every((p) => p.group))
      for (const phase of phases) {
        const group: PhaseGroup = groups.get(phase.group.value) ?? {
          label: phase.group.label,
          value: phase.group.value,
          phases: [],
        };
        group.phases.push(phase);
        groups.set(phase.group.value, group);
      }

    return groups;
  }

  public async getPhases(
    school: School,
    year: number,
    course?: CourseTable,
  ): Promise<Phases | undefined> {
    const files = this.getRankingFiles(school, year);
    if (!files) return;

    const phaseLinks: PhaseLink[] = [];

    for (const file of files) {
      const ranking = await this.loadRanking(school, year, file.link);
      if (!ranking) continue;
      if (course && !this.isCourseInRanking(ranking, course)) continue;

      const phase = this.convertRankingToPhaseLink(file, ranking);
      phaseLinks.push(phase);
    }

    const sorted = this.sortPhaseLinks(school, phaseLinks);
    const groups = this.getPhaseGroups(sorted);

    const phases: Phases = {
      groups,
      all: sorted,
    };

    return phases;
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
        .find(
          (s) =>
            phaseName === s.singleCourseJson.name &&
            s.singleCourseJson.location === course.location?.toUpperCase(),
        )
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
