import { useState } from "react"
import { Table as TableType } from "@tanstack/react-table"
import {
  MdOutlineKeyboardDoubleArrowLeft as DoubleArrowLeft,
  MdKeyboardDoubleArrowRight as DoubleArrowRight,
  MdKeyboardArrowLeft as ArrowLeft,
  MdKeyboardArrowRight as ArrowRight
} from "react-icons/md"
import {
  CellContext,
  ColumnDef,
  Header,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import School from "../../utils/types/data/School"
import StudentResult from "../../utils/types/data/parsed/Ranking/StudentResult"

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  school: School
  rows: StudentResult[]
  isGlobalRanking?: boolean
}

function displayBool({
  getValue
}: CellContext<StudentResult, unknown>): string | null {
  const value = getValue<boolean | undefined>()
  if (value === undefined) return "-"
  return value ? "Si" : "No"
}

function makeHas(rows: StudentResult[]): Record<StudentResultKeys, boolean> {
  const checkKey = (key: StudentResultKeys) => rows.some(r => r[key])

  const has: Record<StudentResultKeys, boolean> = {
    englishCorrectAnswers: checkKey("englishCorrectAnswers"),
    sectionsResults: checkKey("sectionsResults"),
    positionAbsolute: checkKey("positionAbsolute"),
    positionCourse: checkKey("positionCourse"),
    birthDate: checkKey("birthDate"),
    result: checkKey("result"),
    ofa: checkKey("ofa"),
    canEnroll: checkKey("canEnroll"),
    canEnrollInto: checkKey("canEnrollInto"),
    id: checkKey("id")
  }
  return has
}

type StudentResultKeys = keyof StudentResult

type ColumnVisibility = {
  [key in StudentResultKeys]?: boolean
}

const headerBorder = (
  header: Header<StudentResult, unknown>,
  headersLength: number
) => {
  if (header.isPlaceholder || headersLength == 1) return ""
  if (header.index === 0) return "border-r"
  if (header.index === headersLength - 1) return "border-l"
  return "border-x"
}

export default function Table({ rows }: TableProps) {
  const has = makeHas(rows)
  const columns = getColumns(rows)
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibility>(has)
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 15,
    pageIndex: 0
  })

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      columnVisibility,
      pagination
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination
  })

  return (
    <div className="w-full">
      <div className="rounded-md border border-slate-400 dark:border-slate-500 [&_*]:border-slate-400 [&_*]:dark:border-slate-500">
        <TableComponent>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={headerBorder(
                        header,
                        headerGroup.headers.length
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="divide-x"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableComponent>
      </div>
      <TablePagination table={table} />
    </div>
  )
}

interface DataTablePaginationProps<TData> {
  table: TableType<TData>
}

export function TablePagination<TData>({
  table
}: DataTablePaginationProps<TData>) {
  return (
    <div className="my-2 flex items-center justify-end max-sm:flex-col max-sm:items-start max-sm:gap-2 sm:space-x-6">
      <div className="sm:flex-1">
        <p className="text-sm font-medium">
          Totale righe: {table.getCoreRowModel().rows.length}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Righe per pagina</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={value => {
            table.setPageSize(Number(value))
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[15, 30, 50, 100].map(pageSize => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex max-sm:w-full max-sm:justify-between">
        <div className="mr-2 flex items-center text-sm font-medium">
          <p>
            Pagina {table.getState().pagination.pageIndex + 1} di{" "}
            {table.getPageCount()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 text-sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 text-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ArrowLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 text-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ArrowRight />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 text-sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

function getColumns(rows: StudentResult[]): ColumnDef<StudentResult>[] {
  return [
    {
      accessorKey: "positionCourse",
      header: "Posizione",
      columns: [
        {
          accessorKey: "positionAbsolute",
          header: "Merito"
        },
        {
          accessorKey: "positionCourse",
          header: "Corso"
        }
      ]
    },
    {
      accessorKey: "result",
      header: "Punteggio",
      cell: ({ getValue }) => {
        const value = getValue<number | undefined>()
        return value ? value.toFixed(2) : "-"
      }
    },
    {
      header: "Immatricolazione",
      columns: [
        {
          accessorKey: "canEnroll",
          header: "Consentita",
          cell: displayBool
        },
        {
          accessorKey: "canEnrollInto",
          header: "Corso",
          cell: ({ getValue }) => getValue() ?? "-"
        }
      ]
    },
    {
      id: "ofa",
      header: "Ofa",
      columns:
        rows
          .find(r => r.ofa)
          ?.ofa?.keysArr()
          .map(ofaName => ({
            header: ofaName,
            accessorFn: row => row.ofa?.get(ofaName),
            cell: displayBool
          })) ?? []
    },
    {
      header: "Risultati singole sezioni",
      id: "sectionsResults",
      columns:
        rows
          .find(r => r.sectionsResults)
          ?.sectionsResults?.keysArr()
          .map(sectionName => ({
            header: sectionName,
            accessorFn: row => row.sectionsResults?.get(sectionName),
            cell: ({ getValue }) => {
              const value = getValue<number | undefined>()
              return value ? value.toFixed(2) : "-"
            }
          })) ?? []
    },
    {
      header: "Risposte corrette",
      columns: [
        {
          accessorKey: "englishCorrectAnswers",
          header: "Inglese"
        }
      ]
    },
    {
      header: "Dati personali",
      columns: [
        {
          accessorKey: "id",
          header: "Matricola (hash)",
          cell: ({ getValue }) => getValue().slice(0, 10)
        },
        {
          accessorKey: "birthDate",
          header: "Data di nascita"
        }
      ]
    }
  ]
}
