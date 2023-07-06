import { ABS_ORDER } from "../constants"
import { capitalizeWords } from "../strings"
import Ranking from "../types/data/parsed/Ranking"
import CourseTable from "../types/data/parsed/Ranking/CourseTable"
import MeritTable from "../types/data/parsed/Ranking/MeritTable"
import StudentResult from "../types/data/parsed/Ranking/StudentResult"

export default class Store {
  _ranking: Ranking
  constructor(ranking: Ranking) {
    this._ranking = ranking
    if (ranking.byCourse) this.fixLetterCase()
  }

  get data() {
    return this._ranking
  }

  public static nameSeparator = " | "
  public getCourseNames(): string[] {
    return this._ranking.byCourse.map(course =>
      course.location
        ? course.title + Store.nameSeparator + course.location
        : course.title
    )
  }

  public getTable(name: string): MeritTable | CourseTable | undefined {
    if (name === ABS_ORDER) return this._ranking.byMerit
    return this._ranking.byCourse.find(course => {
      if (!course.location) return course.title === name
      const split = name.split(Store.nameSeparator)
      return course.title === split[0] && course.location === split[1]
    })
  }

  public static getTable(
    ranking: Ranking,
    name: string
  ): MeritTable | CourseTable | undefined {
    if (name === ABS_ORDER) return ranking.byMerit
    return ranking.byCourse.find(course => {
      if (!course.location)
        return course.title.toUpperCase() === name.toUpperCase()
      const split = name.split(Store.nameSeparator)
      return (
        course.title.toUpperCase() === split[0].toUpperCase() &&
        course.location.toUpperCase() === split[1].toUpperCase()
      )
    })
  }

  protected fixLetterCase(): void {
    this._ranking.byCourse.forEach(course => {
      course.title = capitalizeWords(course.title ?? "")
      course.location = capitalizeWords(course.location ?? "")
    })
  }

  static displayBoolean(value?: boolean): string | null {
    if (value === null || value === undefined) return null
    return value ? "Si" : "No"
  }

  static getRowsWithNull(rows: StudentResult[]): (string | null)[][] {
    if (rows.length === 0) return []
    return rows.map(row => {
      const a = [
        row.id ?? null,
        row.birthDate ?? null,
        row.result ?? null,
        row.positionAbsolute ?? null,
        row.positionCourse ?? null,
        this.displayBoolean(row.canEnroll),
        row.canEnrollInto ?? null,
        row.englishCorrectAnswers ?? null
      ]

      row.ofa?.forEach(v => a.push(this.displayBoolean(v)))
      row.sectionsResults?.forEach(v => a.push(v))

      const strA = a.map(x => (x === null ? null : x.toString()))
      return strA
    })
  }

  static getHeadersWithNull(rows: StudentResult[]): string[] {
    if (rows.length === 0) return []
    const a = [
      "Matricola",
      "Data di nascita",
      "Voto test",
      "Posizione assoluta",
      "Posizione nel corso",
      "Immatricolazione consentita",
      "Immatricolazione consentita nel corso",
      "Risposte corrette inglese"
    ]

    const first = rows[0]
    if (first.ofa) first.ofa.keysArr().forEach(v => a.push(v))
    if (first.sectionsResults)
      first.sectionsResults
        .keysArr()
        .forEach(v => a.push("Punteggio sezione " + v))

    return a
  }

  public static tableToCsv(table: MeritTable | CourseTable): string {
    let s = ""

    const headers = this.getHeadersWithNull(table.rows)
    s += headers.join(";").replaceAll(",", ".").replaceAll("\n", " ") + "\n"
    const rowWithNull = this.getRowsWithNull(table.rows)
    rowWithNull.forEach(row => {
      s += row.join(";").replaceAll(",", ".").replaceAll("\n", " ") + "\n"
    })

    return s
  }
}
