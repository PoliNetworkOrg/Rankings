import urlJoin from "url-join";
import { DATA_REF, LINKS, NO_GROUP } from "../constants";
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
import { numberToOrdinalString, numberToRoman } from "../strings/numbers";
import { capitaliseWords } from "../strings/capitalisation";
import { sortDesUrbPhases, sortIngArcPhases } from "./sortPhases";

export default class Data {
  public readonly ref: DATA_REF;
  protected readonly _outUrl: string;
  protected readonly _indexUrl: string;
  protected readonly _coursePhasesUrl: string;

  public indexBySchoolYear?: IndexBySchoolYear;
  public indexBySchoolYearCourse?: IndexBySchoolYearCourse;
  public schools: School[] = [];
  public urls: string[] = [];

  private cache: CustomMap<string, Ranking> = new CustomMap();

  private static buildUrl(ref: DATA_REF): string {
    return urlJoin(LINKS.dataRepoUrlRaw, ref, "/data/output");
  }

  private constructor(ref: DATA_REF) {
    this._outUrl = Data.buildUrl(ref);
    this._indexUrl = urlJoin(this._outUrl, "bySchoolYear.json");
    this._coursePhasesUrl = urlJoin(this._outUrl, "bySchoolYearCourse.json");
    this.ref = ref;
  }

  public static async init(ref: DATA_REF) {
    const data = new Data(ref);
    data.indexBySchoolYear = await fetch(data._indexUrl)
      .then((res) => res.json())
      .then((json) => JsonParser.parseIndexBySchoolYear(json));

    data.indexBySchoolYearCourse = await fetch(data._coursePhasesUrl)
      .then((res) => res.json())
      .then((json) => JsonParser.parseIndexBySchoolYearCourse(json));

    data.schools = data.indexBySchoolYear?.schools.keysArr() ?? [];

    data.indexBySchoolYear?.schools.forEach((years) =>
      years.forEach((files) =>
        files.forEach((file) => {
          const url = urlJoin(data._outUrl, file.basePath, file.link);
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

    const url = urlJoin(this._outUrl, school, year.toString(), file.link);
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

  private convertRankingFileToPhaseLink(file: RankingFile): PhaseLink {
    const order = file.rankingOrder;
    const name = order.secondary
      ? `${numberToRoman(order.secondary || 1)} graduatoria ${
          order.isExtraEu ? "(Extra-UE)" : ""
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

  // private fixCourseLocationTitle(course: CourseTable): CourseTable {
  //   // since we may have modified the title to display it in a nicer way
  //   // on the UI, we need to reset it to the json style (uppercase)
  //   const title = course.title.toUpperCase();
  //
  //   // see: https://github.com/PoliNetworkOrg/GraduatorieScriptCSharp/pull/82
  //   const location = course.location;
  //   const locationEmpty = !location || location === "";
  //   const fixedLocation = locationEmpty ? "0" : location.toUpperCase();
  //
  //   const newCourse: CourseTable = {
  //     title,
  //     location: fixedLocation,
  //     sections: course.sections,
  //     headers: course.headers,
  //     rows: course.rows,
  //   };
  //
  //   return newCourse;
  // }

  // private isCourseInRanking(ranking: Ranking, course: CourseTable): boolean {
  //   if (ranking.byCourse.length === 0) return false;
  //
  //   const courses = ranking.byCourse.map((course) =>
  //     this.fixCourseLocationTitle(course),
  //   );
  //   const { title, location } = this.fixCourseLocationTitle(course);
  //
  //   const found = courses.find(
  //     (a) => a.title === title && a.location === location,
  //   );
  //
  //   return !!found;
  // }

  private sortPhaseLinks(
    school: School,
    year: number,
    phases: PhaseLink[],
  ): PhaseLink[] {
    if (year <= 2023) {
      if (school === "Architettura" || school === "Ingegneria")
        return phases.sort(sortIngArcPhases);

      if (school === "Urbanistica" || school === "Design")
        return phases.sort(sortDesUrbPhases);
    } else {
      return phases.sort(sortIngArcPhases);
    }

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
      // this is not needed anymore, kept it as a backup for the course code below
      // const ranking = await this.loadRanking(school, year, file.link);
      // if (!ranking) continue;

      if (course) console.log("Should I do something with this?");
      // if (course && !this.isCourseInRanking(ranking, course)) continue;

      const phase = this.convertRankingFileToPhaseLink(file);
      phaseLinks.push(phase);
    }

    const sorted = this.sortPhaseLinks(school, year, phaseLinks);
    const groups = this.getPhaseGroups(sorted);

    const phases: Phases = {
      groups,
      all: sorted,
    };

    return phases;
  }

  public async getAllYearRankings(
    school: School,
    year: number,
  ): Promise<Ranking[]> {
    const r: Ranking[] = [];
    const phases = await this.getPhases(school, year);

    if (!phases) return r;

    const hrefs = phases.all.map((pl) => pl.href);

    for (const href of hrefs) {
      const ranking = await this.loadRanking(school, year, href);
      if (ranking) r.push(ranking);
    }

    return r;
  }
}
