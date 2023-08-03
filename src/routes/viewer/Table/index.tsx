import { useMemo, useState } from "react";
import {
  ColumnFiltersState,
  Row,
  Table as TableType,
} from "@tanstack/react-table";
import {
  MdOutlineKeyboardDoubleArrowLeft as DoubleArrowLeft,
  MdKeyboardDoubleArrowRight as DoubleArrowRight,
  MdKeyboardArrowLeft as ArrowLeft,
  MdKeyboardArrowRight as ArrowRight,
  MdDownload,
} from "react-icons/md";
import {
  CellContext,
  ColumnDef,
  Header,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import School from "@/utils/types/data/School";
import StudentResult from "@/utils/types/data/parsed/Ranking/StudentResult";
import { Input } from "@/components/ui/input";
import MeritTable from "@/utils/types/data/parsed/Ranking/MeritTable";
import CourseTable from "@/utils/types/data/parsed/Ranking/CourseTable";
import Store from "@/utils/data/store";
import { sha256 } from "@/utils/strings/crypto";
import { capitaliseWords } from "@/utils/strings/capitalisation";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  school: School;
  csvFilename: string;
  table: MeritTable | CourseTable;
  isGlobalRanking?: boolean;
}

type Cell = CellContext<StudentResult, unknown>;
class CellFns {
  static displayString({ getValue }: Cell): string {
    const value = getValue<string | undefined>();
    return value ?? "-";
  }

  static displayBool({ getValue }: Cell): string {
    const value = getValue<boolean | undefined>();
    if (value === undefined) return "-";
    return value ? "Si" : "No";
  }

  static displayScore({ getValue }: Cell): string {
    const value = getValue<number | undefined>();
    if (value === undefined) return "-";
    return value.toFixed(2);
  }

  static displayHash(cell: Cell): string {
    const value = CellFns.displayString(cell);
    const length = 10;
    return value.slice(0, length);
  }
}

function makeHas(rows: StudentResult[]): Record<StudentResultKeys, boolean> {
  const checkKey = (key: StudentResultKeys) => rows.some((r) => r[key]);

  const has: Record<StudentResultKeys, boolean> = {
    englishCorrectAnswers: checkKey("englishCorrectAnswers"),
    sectionsResults: checkKey("sectionsResults"),
    positionAbsolute: checkKey("positionAbsolute"),
    positionCourse: checkKey("positionCourse"),
    birthDate: checkKey("birthDate"),
    result: checkKey("result"),
    ofa: checkKey("ofa"),
    enroll: checkKey("enroll"),
    id: checkKey("id"),
  };
  return has;
}

type StudentResultKeys = keyof StudentResult;

type ColumnVisibility = {
  [key in StudentResultKeys]?: boolean;
};

const headerBorder = (
  header: Header<StudentResult, unknown>,
  headersLength: number,
) => {
  if (header.isPlaceholder || headersLength == 1) return "";
  if (header.index === 0) return "border-r";
  if (header.index === headersLength - 1) return "border-l";
  return "border-x";
};

export default function Table({ table: pTable, csvFilename }: TableProps) {
  const { rows } = pTable;
  const csv = useMemo(() => (pTable ? Store.tableToCsv(pTable) : ""), [pTable]);
  const has = makeHas(rows);
  const columns = getColumns(rows);
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibility>(has);
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 15,
    pageIndex: 0,
  });

  const [idFilter, setIdFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: "matricola-hash",
      value: idFilter,
    },
  ]);

  const handleIdFilterChange = async (v: string) => {
    setIdFilter(v);
    const hashed = v === "" ? "" : await sha256(v);
    setColumnFilters([
      {
        id: "matricola-hash",
        value: hashed,
      },
    ]);
  };

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      columnVisibility,
      pagination,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center justify-start gap-4">
          {has.id && (
            <Input
              placeholder="Filtra per matricola..."
              value={idFilter}
              onChange={(e) => handleIdFilterChange(e.target.value)}
            />
          )}
        </div>
        <Button
          variant="outline"
          className="whitespace-nowrap"
          onClick={() => downloadCsv(csv, csvFilename)}
        >
          <MdDownload size={20} />
          <span className="max-sm:hidden">Download CSV</span>
        </Button>
      </div>
      <div className="rounded-md border border-slate-300 dark:border-slate-700 [&_*]:border-slate-300 [&_*]:dark:border-slate-700">
        <TableComponent>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const rowSpan = calculateRowSpan(header);
                  return (
                    rowSpan > 0 && (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        rowSpan={rowSpan}
                        className={
                          "text-center " +
                          headerBorder(header, headerGroup.headers.length)
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    )
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
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
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getHeaderGroups()[1].headers.length}
                  className="h-24 text-center"
                >
                  {rows.length > 0
                    ? "Nessuna riga trovata"
                    : "Nessun dato disponibile"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableComponent>
      </div>
      <TablePagination table={table} />
    </div>
  );
}

interface DataTablePaginationProps<TData> {
  table: TableType<TData>;
}

export function TablePagination<TData>({
  table,
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
          onValueChange={(value) => {
            table.setPageSize(Number(value));
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
  );
}

function getColumns(rows: StudentResult[]): ColumnDef<StudentResult>[] {
  return [
    {
      accessorKey: "positionCourse",
      header: "Posizione",
      columns: [
        {
          accessorKey: "positionAbsolute",
          header: "Merito",
          cell: CellFns.displayString,
        },
        {
          accessorKey: "positionCourse",
          header: "Corso",
          cell: CellFns.displayString,
        },
      ],
    },
    {
      header: "Punteggio",
      columns: [
        {
          accessorKey: "result",
          header: undefined,
          cell: CellFns.displayScore,
        },
      ],
    },
    {
      header: "Immatricolazione",
      columns: [
        {
          accessorKey: "enroll.allowed",
          header: "Consentita",
          cell: CellFns.displayBool,
        },
        {
          accessorKey: "enroll.status",
          header: "Stato",
          cell: CellFns.displayString,
        },
        {
          accessorKey: "enroll.course",
          header: "Corso",
          cell: (ctx) => {
            const str = CellFns.displayString(ctx);
            return capitaliseWords(str);
          },
        },
      ],
    },
    {
      id: "ofa",
      header: "Ofa",
      columns:
        rows
          .find((r) => r.ofa)
          ?.ofa?.keysArr()
          .map((ofaName) => ({
            header: ofaName,
            accessorFn: (row) => row.ofa?.get(ofaName),
            cell: CellFns.displayBool,
          })) ?? [],
    },
    {
      header: "Risultati singole sezioni",
      id: "sectionsResults",
      columns:
        rows
          .find((r) => r.sectionsResults)
          ?.sectionsResults?.keysArr()
          .map((sectionName) => ({
            header: sectionName,
            accessorFn: (row) => row.sectionsResults?.get(sectionName),
            cell: CellFns.displayScore,
          })) ?? [],
    },
    {
      header: "Risposte corrette",
      columns: [
        {
          accessorKey: "englishCorrectAnswers",
          header: "Inglese",
          cell: CellFns.displayString,
        },
      ],
    },
    {
      header: "Dati personali",
      columns: [
        {
          accessorKey: "id",
          header: "Matricola hash",
          id: "matricola-hash",
          cell: CellFns.displayHash,
          enableColumnFilter: true,
          enableGlobalFilter: true,
          filterFn: (
            row: Row<StudentResult>,
            _: string,
            filterValue: string,
          ): boolean => {
            if (!filterValue) return true;
            return (
              row.original.id?.slice(0, 10) === filterValue.slice(0, 10) ?? true
            );
          },
        },
        {
          accessorKey: "birthDate",
          header: "Data di nascita",
          cell: CellFns.displayString,
        },
      ],
    },
  ];
}

function calculateRowSpan(header: Header<StudentResult, unknown>): number {
  if (header.isPlaceholder || !header.column.columnDef.header) return 0;
  if (header.depth === 1 && header.subHeaders.length > 0) {
    if (!header.subHeaders[0].column.columnDef.header) return 2;
  }

  return 1;
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = (filename ?? "data") + ".csv";
  a.click();

  a.remove();

  window.URL.revokeObjectURL(url);
}
