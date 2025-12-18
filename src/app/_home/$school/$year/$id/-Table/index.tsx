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
import { useState } from "react"
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { StudentTableRow } from "@/utils/types/data/ranking"
import type { School } from "@/utils/types/data/school"
import { getColumns } from "./columns"
import Pagination from "./Pagination"
import { Toolbar } from "./Toolbar"
import { getHeaderBorder, getRowSpan } from "./utils"

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  school: School
  csvFilename: string
  table: StudentTableRow[]
  isGlobalRanking?: boolean
}

function makeHas(
  rows: StudentTableRow[]
): Record<keyof StudentTableRow, boolean> {
  return {
    id: rows.some((r) => r.id.length > 0),
    birthDate: rows.some((r) => r.birthDate),
    englishResult: rows.some((r) => r.englishResult),
    position: rows.some((r) => r.position > 0),
    canEnroll: true,
    ofa: rows.some((r) => Object.keys(r.ofa).length > 0),
    result: true,
    course: rows.some((r) => r.course),
    sectionsResults: rows.some(
      (r) => r.sectionsResults && Object.keys(r.sectionsResults).length > 0
    ),
  }
}

type ColumnVisibility = {
  [key in keyof StudentTableRow]?: boolean
}

export default function Table({ table: _table, csvFilename: _ }: TableProps) {
  const has = makeHas(_table)
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibility>(has)
  const columns = getColumns(_table)
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 15,
    pageIndex: 0,
  })

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const table = useReactTable({
    data: _table,
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

  // const csv = useMemo(() => (_table ? Store.tableToCsv(_table) : ""), [_table]);
  function handleCsvDownload(): void {
    // downloadCsv(csv, csvFilename);
  }
  //

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
                          className={`text-center ${getHeaderBorder(header, headerGroup.headers.length)}`}
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
                    {_table.length > 0
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
