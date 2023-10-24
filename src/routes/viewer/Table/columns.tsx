import { ColumnDef, Row } from "@tanstack/react-table";
import { capitaliseWords } from "@/utils/strings/capitalisation";
import StudentResult from "@/utils/types/data/parsed/Ranking/StudentResult";
import { FilterOption } from "./FilterBtn";

export const enrollAllowedOpts: FilterOption<boolean>[] = [
  {
    originalValue: true,
    value: "si",
    label: "Si",
  },
  {
    originalValue: false,
    value: "no",
    label: "No",
  },
];

export const enrollStatusOpts: FilterOption<string>[] = [
  {
    originalValue: "assegnato",
    value: "assegnato",
    label: "Assegnato",
  },
  {
    originalValue: "prenotato",
    value: "prenotato",
    label: "Prenotato",
  },
];

class Formatter {
  static displayString(value?: string): string {
    if (value === undefined) return "-";
    return value;
  }

  static displayBool(value?: boolean): string {
    if (value === undefined) return "-";
    return value ? "Si" : "No";
  }

  static displayScore(value?: number): string {
    if (value === undefined) return "-";
    return value.toFixed(2);
  }

  static displayHash(value?: string): string {
    if (value === undefined) return "-";
    return value.slice(0, 10);
  }

  static displayOption<T>(value: string, options: FilterOption<T>[]) {
    if (value === "-") return "-";

    const option = options.find(
      (opt) => opt.value.toLowerCase() === value.toLowerCase(),
    );
    if (!option) return "-";

    return (
      <div className="flex items-center justify-center">
        {option.icon && (
          <option.icon className="text-muted-foreground mr-2 h-4 w-4" />
        )}
        <span>{option.label}</span>
      </div>
    );
  }
}

export function getColumns(rows: StudentResult[]): ColumnDef<StudentResult>[] {
  return [
    {
      accessorKey: "positionCourse",
      header: "Posizione",
      columns: [
        {
          accessorKey: "positionAbsolute",
          header: "Merito",
          cell: ({ getValue }) => {
            const value = getValue();
            return Formatter.displayString(value);
          },
        },
        {
          accessorKey: "positionCourse",
          header: "Corso",
          cell: ({ getValue }) => {
            const value = getValue();
            return Formatter.displayString(value);
          },
        },
      ],
    },
    {
      header: "Punteggio",
      columns: [
        {
          accessorKey: "result",
          header: undefined,
          cell: ({ getValue }) => {
            const value = getValue();
            return Formatter.displayScore(value);
          },
        },
      ],
    },
    {
      header: "Immatricolazione",
      columns: [
        {
          accessorKey: "enrollAllowed",
          header: "Consentita",
          id: "enrollAllowed",
          cell: ({ getValue }) => {
            const value = getValue();
            const str = Formatter.displayBool(value);
            return Formatter.displayOption(str, enrollAllowedOpts);
          },
          filterFn: (row, id, filter) => {
            const boolVal: boolean | undefined = row.getValue(id);
            if (!filter) return true;
            if (boolVal === undefined) return false;
            const value = Formatter.displayBool(boolVal).toLowerCase();
            return filter.includes(value.toLowerCase());
          },
        },
        {
          accessorKey: "enrollStatus",
          header: "Stato",
          id: "enrollStatus",
          cell: ({ getValue }) => {
            const value = getValue();
            const str = Formatter.displayString(value);
            return Formatter.displayOption(str, enrollStatusOpts);
          },
          filterFn: (row, id, filter) => {
            const value: string | undefined = row.getValue(id);
            if (!filter) return true;
            if (!value) return false;
            return filter.includes(value.toLowerCase());
          },
        },
        {
          accessorKey: "enrollCourse",
          header: "Corso",
          cell: ({ getValue }) => {
            const value = getValue();
            const str = Formatter.displayString(value);
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
            cell: ({ getValue }) => {
              const value = getValue();
              return Formatter.displayBool(value);
            },
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
            cell: ({ getValue }) => {
              const value = getValue();
              return Formatter.displayScore(value);
            },
          })) ?? [],
    },
    {
      header: "Risposte corrette",
      columns: [
        {
          accessorKey: "englishCorrectAnswers",
          header: "Inglese",
          cell: ({ getValue }) => {
            const value = getValue();
            return Formatter.displayString(value);
          },
        },
      ],
    },
    {
      header: "Dati personali",
      columns: [
        {
          accessorKey: "id",
          header: "Matricola hash",
          id: "id",
          cell: ({ getValue }) => {
            const value = getValue();
            return Formatter.displayHash(value);
          },
          enableColumnFilter: true,
          enableGlobalFilter: true,
          filterFn: (
            row: Row<StudentResult>,
            id: string,
            filterValue: string,
          ): boolean => {
            const value: string | undefined = row.getValue(id);
            if (!filterValue || !value) return true;
            return value.slice(0, 10) === filterValue.slice(0, 10);
          },
        },
        {
          accessorKey: "birthDate",
          header: "Data di nascita",
          cell: ({ getValue }) => {
            const value = getValue();
            return Formatter.displayString(value);
          },
        },
      ],
    },
  ];
}
