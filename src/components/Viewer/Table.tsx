import { useId } from "react"
import ReactPaginate from "react-paginate"
import {
  MdNavigateBefore as PrevIcon,
  MdNavigateNext as NextIcon
} from "react-icons/md"
import { School, TableData } from "../../utils/types"
import usePaginate from "../../hooks/usePaginate"

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
  data: TableData
  isGlobalRanking?: boolean
}
export default function Table({
  school,
  data,
  isGlobalRanking = false,
  ...p
}: TableProps) {
  const id = useId()

  return (
    <table className="mb-[1px] w-full border-collapse" {...p}>
      <TableHeader
        colNum={data[0].length || 0}
        school={school}
        isGlobalRanking={isGlobalRanking}
      />
      <tbody>
        {data.length ? (
          data.map((row, x) => (
            <tr key={`${id}-${x}`}>
              {row.map((value, y) => (
                <Td key={`${id}-${x}-${y}`}>{value}</Td>
              ))}
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

interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  school: School
  colNum: number
  isGlobalRanking?: boolean
}
function TableHeader({ isGlobalRanking, school, colNum }: TableHeaderProps) {
  return (
    <thead>
      {school === "Design" &&
        (isGlobalRanking ? (
          <tr>
            <Th>Test Score</Th>
            <Th>OFA TEST</Th>
            <Th>Overall Position</Th>
            <Th>Admitted enroll in (course)</Th>
          </tr>
        ) : (
          <>
            <tr>
              <Th rowSpan={2}>Position</Th>
              <Th rowSpan={2}>Birth Date</Th>
              <Th rowSpan={2}>Enroll allowed</Th>
              <Th rowSpan={2}>Test Score</Th>
              <Th colSpan={colNum > 11 ? 6 : 5}>Sections Score</Th>
              <Th rowSpan={2}>Correct ENG Answers</Th>
              <Th rowSpan={2}>Debit in ENG</Th>
            </tr>
            <tr>
              <Th>Geometry and Representation</Th>
              <Th>Verbal Comp.</Th>
              <Th>History of Design and Art</Th>
              <Th>Logic</Th>
              <Th>General Culture</Th>
              {colNum > 11 && <Th>English</Th>}
            </tr>
          </>
        ))}
      {school === "Ingegneria" &&
        (isGlobalRanking ? (
          <tr>
            <Th>Test Score</Th>
            <Th>OFA TEST</Th>
            <Th>OFA TENG</Th>
            <Th>Overall Position</Th>
            <Th>Admitted enroll in (course)</Th>
          </tr>
        ) : (
          <>
            <tr>
              <Th rowSpan={2}>Position</Th>
              <Th rowSpan={2}>Birth Date</Th>
              <Th rowSpan={2}>Enroll allowed</Th>
              <Th rowSpan={2}>Test Score</Th>
              <Th colSpan={4}>Sections Score</Th>
              <Th rowSpan={2}>Correct ENG Answers</Th>
              <Th rowSpan={2}>OFA TEST</Th>
              <Th rowSpan={2}>OFA TENG</Th>
            </tr>
            <tr>
              <Th>English</Th>
              <Th>Maths</Th>
              <Th>Verbal Comp.</Th>
              <Th>Physics</Th>
            </tr>
          </>
        ))}
      {school === "Architettura" &&
        (isGlobalRanking ? (
          <tr>
            <Th>Test Score</Th>
            <Th>OFA TENG</Th>
            <Th>Overall Position</Th>
            <Th>Status</Th>
          </tr>
        ) : (
          <>
            <tr>
              <Th rowSpan={2}>Position</Th>
              <Th rowSpan={2}>Birth Date</Th>
              <Th rowSpan={2}>Enroll allowed</Th>
              <Th rowSpan={2}>Test Score</Th>
              <Th colSpan={5}>Sections Score</Th>
              {colNum === 11 && (
                <>
                  <Th rowSpan={2}>Correct ENG Answers</Th>
                  <Th rowSpan={2}>OFA TENG</Th>
                </>
              )}
            </tr>
            <tr>
              <Th>General Culture</Th>
              <Th>Logic</Th>
              <Th>History</Th>
              <Th>Drawing and Representation</Th>
              <Th>Physics and Maths</Th>
            </tr>
          </>
        ))}
      {school === "Urbanistica" &&
        (isGlobalRanking ? (
          <tr>
            <Th>Test Score</Th>
            <Th>Overall Position</Th>
            <Th>Admitted enroll in (course)</Th>
          </tr>
        ) : (
          <>
            <tr>
              <Th rowSpan={2}>Position</Th>
              <Th rowSpan={2}>Birth Date</Th>
              <Th rowSpan={2}>Enroll allowed</Th>
              <Th rowSpan={2}>Test Score</Th>
              <Th colSpan={6}>Sections Score</Th>
            </tr>
            <tr>
              <Th>Interview</Th>
              <Th>Composition</Th>
              <Th>Motivational Letter</Th>
            </tr>
          </>
        ))}
    </thead>
  )
}
