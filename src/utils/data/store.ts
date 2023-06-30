import { ABS_ORDER } from "../constants"
import { capitalizeWords } from "../strings"
import Ranking from "../types/data/Ranking"
import CourseTable from "../types/data/Ranking/CourseTable"
import MeritTable from "../types/data/Ranking/MeritTable"

// function tableToFloat(v: string | number) {
//   const s = v.toString().replace(",", ".")
//   const parsed = parseFloat(s)
//   return parsed
// }

export default class Store {
  _ranking: Ranking
  constructor(ranking: Ranking) {
    this._ranking = ranking
    if (ranking.byCourse) this.fixLetterCase()
  }

  get data() {
    return this._ranking
  }

  public getCourseNames(): string[] {
    return this._ranking.byCourse.map(course => course.title)
  }

  public getTable(name: string): MeritTable | CourseTable | undefined {
    if (name === ABS_ORDER) return this._ranking.byMerit
    return this._ranking.byCourse.find(course => course.title === name)
  }

  protected fixLetterCase(): void {
    this._ranking.byCourse.forEach(course => {
      course.title = capitalizeWords(course.title)
    })
  }
  //
  // public static getEnrollStats(table: TableData): EnrollStats {
  //   // check if table is ABS_ORDER
  //   if (!table.length || table[0].length <= 5) return null
  //
  //   const candidates = table.length
  //   const firstNo = table.findIndex(row => row[2].toString().startsWith("No"))
  //   if (firstNo === 0) {
  //     // no candidates allowed
  //     return {
  //       candidates,
  //       allowed: 0,
  //       allowedPct: "0%",
  //       minScoreToPass: 0
  //     }
  //   } else if (firstNo === -1) {
  //     // all candidates allowed
  //     return {
  //       candidates,
  //       allowed: candidates,
  //       allowedPct: "100%",
  //       minScoreToPass: tableToFloat(table[candidates - 1][3])
  //     }
  //   } else {
  //     // some candidates allowed
  //     const lastYes = firstNo === -1 ? candidates - 1 : firstNo - 1
  //     const allowed = firstNo === -1 ? candidates : firstNo
  //     const allowedPct = firstNo === -1 ? 100 : (allowed * 100) / candidates
  //     const minScoreToPass =
  //       table[lastYes].length > 3 ? tableToFloat(table[lastYes][3]) : 0
  //
  //     return {
  //       candidates,
  //       allowed,
  //       allowedPct: allowedPct.toFixed(1) + "%",
  //       minScoreToPass
  //     }
  //   }
  // }

  // static tableToCsv(table: TableData, header?: string[]): string {
  //   let s = ""
  //   if (header) {
  //     for (let i = 0; i < header.length; i++) {
  //       s += header[i]
  //       s += ";"
  //     }
  //     s += "\n"
  //   }
  //   for (let i = 0; i < table.length; i++) {
  //     const row = table[i]
  //     for (let j = 0; j < row.length; j++) {
  //       s += row[j].toString().replace(",", ".")
  //       s += ";"
  //     }
  //     s += "\n"
  //   }
  //   return s
  // }
}
