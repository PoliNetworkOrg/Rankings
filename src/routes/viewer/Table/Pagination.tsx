import type { Table as TableType } from "@tanstack/react-table"
import {
  MdKeyboardArrowLeft as ArrowLeft,
  MdKeyboardArrowRight as ArrowRight,
  MdOutlineKeyboardDoubleArrowLeft as DoubleArrowLeft,
  MdKeyboardDoubleArrowRight as DoubleArrowRight,
} from "react-icons/md"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
  table: TableType<TData>
}

export default function Pagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="my-2 flex items-center justify-end max-sm:flex-col max-sm:items-start max-sm:gap-2 sm:space-x-6">
      <div className="sm:flex-1">
        <p className="font-medium text-sm">
          Totale righe: {table.getFilteredRowModel().rows.length}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <p className="font-medium text-sm">Righe per pagina</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value))
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[15, 30, 50, 100].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex max-sm:w-full max-sm:justify-between">
        <div className="mr-2 flex items-center font-medium text-sm">
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
