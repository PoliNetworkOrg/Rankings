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
import { numberToOrdinalString, numberToRoman } from "../strings/numbers";
import { capitaliseWords } from "../strings/capitalisation";
import { sortDesUrbPhases, sortIngArcPhases } from "./sortPhases";

export default class Data {
  protected static readonly _u = LINKS.dataBasePath;
  protected static readonly indexUrl: string = urlJoin(
    this._u,
    "bySchoolYear.json",
  );
  protected static readonly coursePhasesUrl: string = urlJoin(
    this._u,
    "bySchoolYearCourse.json",
  );

  public indexBySchoolYear?: IndexBySchoolYear;
  public indexBySchoolYearCourse?: IndexBySchoolYearCourse;
  public schools: School[] = [];
  public urls: string[] = [];

  private cache: CustomMap<string, Ranking> = new CustomMap();

  public static async init() {
    const data = new Data();
    data.indexBySchoolYear = await fetch(Data.indexUrl)
      .then((res) => res.json())
      .then((json) => JsonParser.parseIndexBySchoolYear(json));

    data.indexBySchoolYearCourse = await fetch(Data.coursePhasesUrl)
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

    const label = order.primary
      ? `${name} di ${numberToRoman(order.primary)} fase`
      : name;

    return {
      label,
      name,
      href: file.link.replace(".json", "").toLowerCase(),
      order,
      groupNum: order.primary,
      group: phaseNum ? `${capitaliseWords(phaseNum)} fase` : undefined,
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

  public async getPhasesLinks(
    school: School,
    year: number,
    course?: CourseTable,
  ): Promise<PhaseLink[] | undefined> {
    const files = this.getRankingFiles(school, year);
    if (!files) return;

    const phases: PhaseLink[] = [];

    for (const file of files) {
      const ranking = await this.loadRanking(school, year, file.link);
      if (!ranking) continue;
      if (course && !this.isCourseInRanking(ranking, course)) continue;

      const phase = this.convertRankingToPhaseLink(file, ranking);
      phases.push(phase);
    }

    if (school === "Architettura" || school === "Ingegneria")
      return phases.sort((a, b) => sortIngArcPhases(a, b));

    if (school === "Urbanistica" || school === "Design")
      return phases.sort((a, b) => sortDesUrbPhases(a, b));
  }
}
