import { capitaliseWords } from "@/utils/strings/capitalisation";
import CustomMap from "../CustomMap";
import { ABS_ORDER } from "../constants";
import Ranking from "../types/data/parsed/Ranking";
import CourseTable from "../types/data/parsed/Ranking/CourseTable";
import MeritTable from "../types/data/parsed/Ranking/MeritTable";
import StudentResult from "../types/data/parsed/Ranking/StudentResult";

export type CourseInfo = {
  label: string;
  value: string;
  locations: CourseInfoLocation[];
};

export type CourseInfoLocation = {
  value: string;
  label: string;
  numStudents: number;
};

export default class Store {
  _ranking: Ranking;
  constructor(ranking: Ranking) {
    this._ranking = ranking;
    if (ranking.byCourse) this.fixLetterCase();
  }

  get data() {
    return this._ranking;
  }

  public getCourses(): CustomMap<string, CourseInfo> {
    const map = new CustomMap<string, CourseInfo>();
    map.set(ABS_ORDER, {
      value: ABS_ORDER,
      label: "Tutti i corsi",
      locations: [],
    });

    const locationNumStudents =
      this._ranking.rankingSummary.courseSummarized.map(
        ({ title, location, howManyStudents }) => {
          return { title, location, howManyStudents };
        },
      );
    this._ranking.byCourse.forEach(({ title, location }) => {
      const value = title.toLowerCase();
      const info = map.get(value) ?? {
        label: title,
        value,
        locations: [],
      };
      if (location) {
        const foundSummary = locationNumStudents.find(
          (lns) =>
            lns.title.toUpperCase() === title.toUpperCase() &&
            lns.location.toUpperCase() === location.toUpperCase(),
        );
        const ns = foundSummary?.howManyStudents || 0;

        info.locations.push({
          value: location.toLowerCase(),
          label: location,
          numStudents: ns,
        });
      }

      info.locations.sort((a, b) => {
        if (a.value < b.value) return -1;
        if (b.value < a.value) return 1;
        return 0;
      });
      map.set(value, info);
    });

    return map;
  }

  public getTable(
    title: string,
    location?: string,
  ): MeritTable | CourseTable | undefined {
    if (title === ABS_ORDER) return this._ranking.byMerit;

    return this._ranking.byCourse.find((course) => {
      if (!course.location)
        return course.title.toUpperCase() === title.toUpperCase();
      if (!location) return false;

      return (
        course.title.toUpperCase() === title.toUpperCase() &&
        course.location.toUpperCase() === location.toUpperCase()
      );
    });
  }

  protected fixLetterCase(): void {
    this._ranking.phase = capitaliseWords(this._ranking.phase);
    this._ranking.byCourse.forEach((course) => {
      course.title = capitaliseWords(course.title ?? "");
      course.location = capitaliseWords(course.location ?? "");
    });
  }

  static displayBoolean(value?: boolean): string | null {
    if (value === null || value === undefined) return null;
    return value ? "Si" : "No";
  }

  static getRowsWithNull(rows: StudentResult[]): (string | null)[][] {
    if (rows.length === 0) return [];
    return rows.map((row) => {
      const a = [
        row.matricolaHash ?? null,
        row.birthDate ?? null,
        row.result ?? null,
        row.positionAbsolute ?? null,
        row.positionCourse ?? null,
        this.displayBoolean(row.enrollAllowed),
        row.enrollStatus ?? null,
        row.enrollCourse ?? null,
        row.englishCorrectAnswers ?? null,
      ];

      row.ofa?.forEach((v) => a.push(this.displayBoolean(v)));
      row.sectionsResults?.forEach((v) => a.push(v));

      const strA = a.map((x) => (x === null ? null : x.toString()));
      return strA;
    });
  }

  static getHeadersWithNull(rows: StudentResult[]): string[] {
    if (rows.length === 0) return [];
    const a = [
      "Matricola",
      "Data di nascita",
      "Voto test",
      "Posizione assoluta",
      "Posizione nel corso",
      "Immatricolazione (consentita)",
      "Immatricolazione (stato)",
      "Immatricolazione (corso)",
      "Risposte corrette inglese",
    ];

    const first = rows[0];
    if (first.ofa) first.ofa.keysArr().forEach((v) => a.push(v));
    if (first.sectionsResults)
      first.sectionsResults
        .keysArr()
        .forEach((v) => a.push("Punteggio sezione " + v));

    return a;
  }

  public static tableToCsv(table: MeritTable | CourseTable): string {
    let s = "";

    const headers = this.getHeadersWithNull(table.rows);
    s += headers.join(";").replaceAll(",", ".").replaceAll("\n", " ") + "\n";
    const rowWithNull = this.getRowsWithNull(table.rows);
    rowWithNull.forEach((row) => {
      s += row.join(";").replaceAll(",", ".").replaceAll("\n", " ") + "\n";
    });

    return s;
  }
}
