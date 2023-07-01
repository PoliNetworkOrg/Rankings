import { useId } from "react"
import School from "../../utils/types/data/School"
import StudentResult from "../../utils/types/data/Ranking/StudentResult"

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Table({ school, rows, ...p }: TableProps) {
  const id = useId()

  return (
    <table className="relative mb-[1px] w-full border-collapse" {...p}>
      <TableHeader row={rows[0]} />
      <tbody>
        {rows.length ? (
          rows.map((student, x) => (
            <tr
              key={`${id}-${x}`}
              className="even:bg-slate-100 dark:even:bg-slate-800"
            >
              {rows[0].birthDate && <Td>{student.birthDate}</Td>}
              {rows[0].result && <Td>{student.result}</Td>}
              {rows[0].positionAbsolute && <Td>{student.positionAbsolute}</Td>}
              {rows[0].positionCourse && <Td>{student.positionCourse}</Td>}
              {displayBool(student.canEnroll) && (
                <Td>{displayBool(student.canEnroll)}</Td>
              )}
              {rows[0].canEnrollInto && <Td>{student.canEnrollInto || "-"}</Td>}
              {rows[0].englishCorrectAnswers && (
                <Td>{rows[0].englishCorrectAnswers}</Td>
              )}
              {rows[0].ofa &&
                Object.keys(rows[0].ofa).map(ofaName => (
                  <Td key={`${id}-${x}-${ofaName}`}>
                    {displayBool(student.ofa?.[ofaName])}
                  </Td>
                ))}
              {rows[0].sectionsResults &&
                Object.keys(rows[0].sectionsResults).map(section => (
                  <Td key={`${id}-${x}-${section}`}>
                    {rows[0].sectionsResults?.[section]}
                  </Td>
                ))}
              {rows[0].id && <Td>{student.id}</Td>}
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
  row: StudentResult
}
function TableHeader({ row }: TableHeaderProps) {
  return (
    <thead className="sticky top-[-1px] z-10 bg-slate-200 dark:bg-slate-800">
      <tr>
        {row.birthDate && <Th rowSpan={2}>Data di nascita</Th>}
        {row.result && <Th rowSpan={2}>Voto test</Th>}
        {row.positionAbsolute && <Th rowSpan={2}>Posizione assoluta</Th>}
        {row.positionCourse && <Th rowSpan={2}>Posizione nel corso</Th>}
        {displayBool(row.canEnroll) && <Th rowSpan={2}>Immat. consentita</Th>}
        {row.canEnrollInto && <Th rowSpan={2}>Immat. nel corso</Th>}
        {row.englishCorrectAnswers && (
          <Th rowSpan={2}>Risposte corrette inglese</Th>
        )}
        {row.ofa &&
          Object.keys(row.ofa).map(name => (
            <Th key={`header-${name}`} rowSpan={2}>
              OFA {name}
            </Th>
          ))}
        {row.sectionsResults && (
          <Th rowSpan={1} colSpan={Object.keys(row.sectionsResults).length}>
            Punteggio singole sezioni
          </Th>
        )}
        {row.id && <Th rowSpan={2}>Matricola</Th>}
      </tr>
      {row.sectionsResults && (
        <tr>
          {Object.keys(row.sectionsResults).map(name => (
            <Th key={`header-section-${name}`}>{name}</Th>
          ))}
        </tr>
      )}
    </thead>
  )
}
