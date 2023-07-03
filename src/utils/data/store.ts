import { ABS_ORDER } from "../constants"
import { capitalizeWords } from "../strings"
import Ranking from "../types/data/Ranking"
import CourseTable from "../types/data/Ranking/CourseTable"
import MeritTable from "../types/data/Ranking/MeritTable"
import StudentResult from "../types/data/Ranking/StudentResult"

export default class Store {
  _ranking: Ranking
  constructor(ranking: Ranking) {
    this._ranking = ranking
    if (ranking.byCourse) this.fixLetterCase()
  }

  get data() {
    return this._ranking
  }

  private nameSeparator = " | "
  public getCourseNames(): string[] {
    return this._ranking.byCourse.map(course =>
      course.location
        ? course.title + this.nameSeparator + course.location
        : course.title
    )
  }

  public getTable(name: string): MeritTable | CourseTable | undefined {
    if (name === ABS_ORDER) return this._ranking.byMerit
    return this._ranking.byCourse.find(course => {
      if (!course.location) return course.title === name
      const split = name.split(this.nameSeparator)
      return course.title === split[0] && course.location === split[1]
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

      row.ofa &&
        Object.values(row.ofa)
          .map(this.displayBoolean)
          .forEach(v => a.push(v))
      row.sectionsResults &&
        Object.values(row.sectionsResults).forEach(v => a.push(v))
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
    if (first.ofa) Object.keys(first.ofa).forEach(v => a.push(v))
    if (first.sectionsResults)
      Object.keys(first.sectionsResults)
        .map(name => "Punteggio sezione " + name)
        .forEach(v => a.push(v))

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
