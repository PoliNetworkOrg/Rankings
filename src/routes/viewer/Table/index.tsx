import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  type PaginationState,
  useReactTable,
} from "@tanstack/react-table"
import { useMemo, useState } from "react"
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Store from "@/utils/data/store"
import type CourseTable from "@/utils/types/data/parsed/Ranking/CourseTable"
import type MeritTable from "@/utils/types/data/parsed/Ranking/MeritTable"
import type StudentResult from "@/utils/types/data/parsed/Ranking/StudentResult"
import type { School } from "@/utils/types/data/school"
import { getColumns } from "./columns"
import Pagination from "./Pagination"
import { Toolbar } from "./Toolbar"
import { downloadCsv, getHeaderBorder, getRowSpan } from "./utils"

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  school: School
  csvFilename: string
  table: MeritTable | CourseTable
  isGlobalRanking?: boolean
}

function makeHas(rows: StudentResult[]): Record<StudentResultKeys, boolean> {
  if (rows.length === 0)
    return {
      englishCorrectAnswers: true,
      sectionsResults: true,
      positionAbsolute: true,
      positionCourse: true,
      birthDate: true,
      result: true,
      ofa: true,
      enrollStatus: true,
      enrollAllowed: true,
      enrollCourse: true,
      matricolaHash: true,
    }

  function checkKey(key: StudentResultKeys): boolean {
    const isThereAny = rows.some((r) => r[key])
    if (!isThereAny) return false

    const areAllEmpty = rows.every((r) => {
      const v = r[key]
      if (!v) return true
      return [" ", "-", ""].includes(v.toString())
    })

    return !areAllEmpty
  }

  const has: Record<StudentResultKeys, boolean> = {
    englishCorrectAnswers: checkKey("englishCorrectAnswers"),
    sectionsResults: checkKey("sectionsResults"),
    positionAbsolute: checkKey("positionAbsolute"),
    positionCourse: checkKey("positionCourse"),
    birthDate: checkKey("birthDate"),
    result: checkKey("result"),
    ofa: checkKey("ofa"),
    enrollStatus: checkKey("enrollStatus"),
    enrollAllowed: checkKey("enrollAllowed"),
    enrollCourse: checkKey("enrollCourse"),
    matricolaHash: checkKey("matricolaHash"),
  }
  return has
}

export type StudentResultKeys = keyof StudentResult

type ColumnVisibility = {
  [key in StudentResultKeys]?: boolean
}

export default function Table({ table: _table, csvFilename }: TableProps) {
  const has = makeHas(_table.rows)
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibility>(has)
  const columns = getColumns(_table.rows)
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 15,
    pageIndex: 0,
  })

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const table = useReactTable({
    data: _table.rows,
    columns,
    state: {
      columnVisibility,
      pagination,
      columnFilters,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const csv = useMemo(() => (_table ? Store.tableToCsv(_table) : ""), [_table])
  function handleCsvDownload(): void {
    downloadCsv(csv, csvFilename)
  }

  return (
    <>
      <div className="w-full max-w-7xl px-4">
        <Toolbar onCsvClick={handleCsvDownload} has={has} table={table} />
      </div>
      <div className="flex w-full flex-col gap-4 px-4">
        <div className="rounded-md border border-slate-300 **:border-slate-300 dark:border-slate-700 **:dark:border-slate-700">
          <TableComponent>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const rowSpan = getRowSpan(header)
                    return (
                      rowSpan > 0 && (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          rowSpan={rowSpan}
                          className={
                            "text-center" +
                            getHeaderBorder(header, headerGroup.headers.length)
                          }
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody bg="odd">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="divide-x"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="whitespace-nowrap text-center"
                      >
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
                    colSpan={table.getHeaderGroups()[1]?.headers.length ?? 1}
                    className="h-24 text-center"
                  >
                    {_table.rows.length > 0
                      ? "La ricerca ha restituito nessun risultato"
                      : "La tabella di questo corso non contiene righe"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </TableComponent>
        </div>
        <Pagination table={table} />
      </div>
    </>
  )
}
