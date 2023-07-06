import { useId } from "react"
import School from "../../utils/types/data/School"
import StudentResult from "../../utils/types/data/parsed/Ranking/StudentResult"

const Th = ({
  children,
  ...p
}: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className="max-w-[8rem] border border-slate-800/20 p-1 text-sm dark:border-slate-300/20"
    {...p}
  >
    {children}
  </th>
)

const Td = ({
  children,
  ...p
}: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td
    className="border border-slate-800/20 p-1 text-center text-sm font-normal dark:border-slate-300/20"
    {...p}
  >
    {children}
  </td>
)
interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  school: School
  rows: StudentResult[]
  isGlobalRanking?: boolean
}

function displayBool(value?: boolean): string | null {
  if (value === undefined || value === null) return null
  return value ? "Si" : "No"
}

type Has = {
  [key in keyof StudentResult]: boolean
}

function makeHas(rows: StudentResult[]): Has {
  const has: Has = {}
  for (const key in rows[0]) {
    has[key as keyof StudentResult] = rows.some(
      r => r[key as keyof StudentResult]
    )
  }
  return has
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Table({ school, rows, ...p }: TableProps) {
  const id = useId()
  const has = makeHas(rows)

  return (
    <table className="relative mb-[1px] w-full border-collapse" {...p}>
      <TableHeader has={has} rows={rows} />
      <tbody>
        {rows.length ? (
          rows.map((student, x) => (
            <tr
              key={`${id}-${x}`}
              className="even:bg-slate-100 dark:even:bg-slate-800"
            >
              {has.birthDate && <Td>{student.birthDate}</Td>}
              {has.result && <Td>{student.result}</Td>}
              {has.positionAbsolute && <Td>{student.positionAbsolute}</Td>}
              {has.positionCourse && <Td>{student.positionCourse}</Td>}
              {displayBool(student.canEnroll) && (
                <Td>{displayBool(student.canEnroll)}</Td>
              )}
              {has.canEnrollInto && <Td>{student.canEnrollInto || "-"}</Td>}
              {has.englishCorrectAnswers && (
                <Td>{student.englishCorrectAnswers}</Td>
              )}
              {has.ofa &&
                student.ofa &&
                student.ofa
                  .entriesArr()
                  .map(([name, value]) => (
                    <Td key={`${id}-${x}-${name}`}>{displayBool(value)}</Td>
                  ))}

              {has.sectionsResults &&
                student.sectionsResults &&
                student.sectionsResults
                  .entriesArr()
                  .map(([section, value]) => (
                    <Td key={`${id}-${x}-${section}`}>{value}</Td>
                  ))}

              {has.id && <Td>{student.id}</Td>}
            </tr>
          ))
        ) : (
          <tr>
            <Td colSpan={20}>No data found</Td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement> & {
  has: Has
  rows: StudentResult[]
}
function TableHeader({ has, rows }: TableHeaderProps) {
  const firstOfa = rows.find(r => r.ofa)?.ofa
  const firstSectionResults = rows.find(r => r.sectionsResults)?.sectionsResults

  return (
    <thead className="sticky top-[-1px] z-10 bg-slate-200 dark:bg-slate-800">
      <tr>
        {has.birthDate && <Th rowSpan={2}>Data di nascita</Th>}
        {has.result && <Th rowSpan={2}>Voto test</Th>}
        {has.positionAbsolute && <Th rowSpan={2}>Posizione assoluta</Th>}
        {has.positionCourse && <Th rowSpan={2}>Posizione nel corso</Th>}
        {displayBool(has.canEnroll) && <Th rowSpan={2}>Immat. consentita</Th>}
        {has.canEnrollInto && <Th rowSpan={2}>Immat. nel corso</Th>}
        {has.englishCorrectAnswers && (
          <Th rowSpan={2}>Risposte corrette inglese</Th>
        )}
        {has.ofa &&
          firstOfa &&
          firstOfa.keysArr().map(name => (
            <Th key={`header-${name}`} rowSpan={2}>
              OFA {name}
            </Th>
          ))}
        {has.sectionsResults && firstSectionResults && (
          <Th rowSpan={1} colSpan={firstSectionResults.keysArr().length}>
            Punteggio singole sezioni
          </Th>
        )}
        {has.id && <Th rowSpan={2}>Matricola</Th>}
      </tr>
      {has.sectionsResults && firstSectionResults && (
        <tr>
          {firstSectionResults.keysArr().map(name => (
            <Th key={`header-section-${name}`}>{name}</Th>
          ))}
        </tr>
      )}
    </thead>
  )
}
