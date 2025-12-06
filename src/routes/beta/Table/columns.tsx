import { ColumnDef, Row } from "@tanstack/react-table";
import { FilterOption } from "./FilterBtn";
import { NewStudentResult } from "@/utils/types/data/json/new-ranking";
import { capitaliseWords } from "@/utils/strings/capitalisation";

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
        {option.icon && <option.icon className="mr-2 h-4 w-4" />}
        <span>{option.label}</span>
      </div>
    );
  }
}

export function getColumns(
  rows: NewStudentResult[],
): ColumnDef<NewStudentResult>[] {
  return [
    {
      header: "Posizione",
      columns: [
        {
          accessorKey: "position",
          header: "Merito",
          cell: ({ getValue }) => {
            const value = getValue();
            return Formatter.displayString(value);
          },
        },
        {
          header: "Corso",
          accessorFn: ({ courses }) => {
            if (courses.length === 0) return "-";
            const sortByPos = courses.sort((a, b) => {
              return a.position - b.position;
            });

            if (
              courses.every((a) => a.canEnroll) ||
              courses.every((a) => !a.canEnroll)
            )
              return sortByPos[0].position;
            return sortByPos.filter((a) => a.canEnroll)[0].position;
          },
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
          accessorKey: "canEnroll",
          header: "Consentita",
          id: "canEnroll",
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
        // {
        //   accessorKey: "enrollStatus",
        //   header: "Stato",
        //   id: "enrollStatus",
        //   cell: ({ getValue }) => {
        //     const value = getValue();
        //     const str = Formatter.displayString(value);
        //     return Formatter.displayOption(str, enrollStatusOpts);
        //   },
        //   filterFn: (row, id, filter) => {
        //     const value: string | undefined = row.getValue(id);
        //     if (!filter) return true;
        //     if (!value) return false;
        //     return filter.includes(value.toLowerCase());
        //   },
        // },
        {
          id: "canEnrollCourse",
          header: "Corso",
          accessorFn: (row) => {
            if (!row.canEnroll) return "-";
            const found = row.courses.find((c) => c.canEnroll);
            if (!found) return "-";
            return found.location
              ? `${found.title} (${found.location})`
              : found.title;
          },
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
      columns: Object.keys(rows[0].ofa).map((k) => ({
        header: k,
        accessorFn: (row) => row.ofa[k],
        cell: ({ getValue }) => {
          const value = getValue();
          return Formatter.displayBool(value);
        },
      })),
    },
    {
      header: "Risultati singole sezioni",
      id: "sectionsResults",
      columns: Object.keys(rows[0].sectionsResults).map((k) => ({
        header: k,
        accessorFn: (row) => row.sectionsResults[k],
        cell: ({ getValue }) => {
          const value = getValue();
          return Formatter.displayScore(value);
        },
      })),
    },
    {
      header: "Risposte corrette",
      columns: [
        {
          accessorKey: "englishResult",
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
          header: "Matricola",
          id: "id",
          cell: ({ getValue }) => {
            const value = getValue();
            return Formatter.displayHash(value);
          },
          enableColumnFilter: true,
          enableGlobalFilter: true,
          filterFn: (
            row: Row<NewStudentResult>,
            id: string,
            filterValue: string,
          ): boolean => {
            const value: string | undefined = row.getValue(id);
            if (!filterValue || !value) return true;
            return value.slice(0, 10) === filterValue.slice(0, 10);
          },
        },
        {
          id: "birthDate",
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
