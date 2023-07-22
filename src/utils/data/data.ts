import urlJoin from "url-join";
import { capitaliseWords } from "@/utils/strings/capitalisation";
import { LINKS } from "../constants";
import { IndexBySchoolYear } from "../types/data/parsed/Index/IndexBySchoolYear";
import { IndexBySchoolYearCourse } from "../types/data/parsed/Index/IndexBySchoolYearCourse";
import School from "../types/data/School";
import Ranking from "../types/data/parsed/Ranking";
import JsonParser from "./jsonParser";
import RankingFile, { PhaseLink } from "../types/data/parsed/Index/RankingFile";
import CourseTable from "../types/data/parsed/Ranking/CourseTable";
import CustomMap from "../CustomMap";

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
      name: capitaliseWords(file.name),
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
}
