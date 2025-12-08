import type { Table } from "@tanstack/react-table"
import { useState } from "react"
import { LuCircleX } from "react-icons/lu"
import { Removable } from "@/components/custom-ui/Removable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { MdDownload } from "react-icons/md";
// import { FilterBtn } from "./FilterBtn";
// import { enrollStatusOpts, enrollAllowedOpts } from "./columns";
// import StudentResult from "@/utils/types/data/parsed/Ranking/StudentResult";
import { sha256 } from "@/utils/strings/crypto"
import type { StudentTableRow } from "@/utils/types/data/json/new-ranking"

type Props = {
  has: Record<keyof StudentTableRow, boolean>
  table: Table<StudentTableRow>
  onCsvClick: () => void
}

export function Toolbar({ has, onCsvClick: _, table }: Props) {
  const idCol = table.getColumn("id")
  // const enrollStatusCol = table.getColumn("enrollStatus");
  // const enrollAllowedCol = table.getColumn("enrollAllowed");

  const [matricolaFilter, setMatricolaFilter] = useState<string>("")
  const [matricolaFilterSubmitted, setMatricolaFilterSubmitted] =
    useState<boolean>(false)
  const { rows: filteredRows } = table.getFilteredRowModel()

  function filterTableMatricolaCol(value?: string) {
    idCol?.setFilterValue(value)
  }

  function handleClearMatricolaFilter() {
    setMatricolaFilter("")
    filterTableMatricolaCol()
    setMatricolaFilterSubmitted(false)
  }

  function handleMatricolaFilterChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (matricolaFilterSubmitted) filterTableMatricolaCol()
    const input = event.target.value
    setMatricolaFilter(input)
    setMatricolaFilterSubmitted(false)
  }

  async function handleMatricolaFilterSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    if (matricolaFilter.length === 0) handleClearMatricolaFilter()
    else {
      const hash = await sha256(matricolaFilter)
      filterTableMatricolaCol(hash)
      setMatricolaFilterSubmitted(true)
    }
  }

  return (
    <div className="flex w-full flex-wrap items-start justify-start gap-6 max-2xs:flex-col">
      {has.id && idCol && (
        <div className="grid grid-cols-[auto_220px] grid-rows-[auto_auto] gap-x-4 gap-y-1">
          <p className="self-center text-sm">Matricola</p>
          {filteredRows.length > 0 && matricolaFilterSubmitted ? (
            <Removable
              onRemove={handleClearMatricolaFilter}
              className="justify-between"
            >
              {matricolaFilter}
            </Removable>
          ) : (
            <>
              <form
                className="relative w-full"
                onSubmit={handleMatricolaFilterSubmit}
              >
                <Input
                  placeholder="Inserisci la matricola..."
                  value={matricolaFilter}
                  onChange={handleMatricolaFilterChange}
                />
                {matricolaFilter.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="-translate-y-1/2 absolute top-1/2 right-1 h-7 w-7 text-gray-500 hover:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:bg-transparent dark:hover:text-gray-100"
                    onClick={handleClearMatricolaFilter}
                  >
                    <LuCircleX className="h-5 w-5" />
                    <span className="sr-only">Clear</span>
                  </Button>
                )}
              </form>
              {matricolaFilterSubmitted && (
                <p className="col-start-2 text-red-600 text-sm dark:text-red-400">
                  Matricola non trovata, ricontrolla.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

// <div className="flex flex-1 justify-start gap-6 max-xs:flex-wrap">
//   {has.enrollAllowed && enrollAllowedCol && (
//     <FilterBtn
//       column={enrollAllowedCol}
//       title="Immatricolabile"
//       options={enrollAllowedOpts}
//     />
//   )}
//   {has.enrollStatus && enrollStatusCol && (
//     <FilterBtn
//       column={enrollStatusCol}
//       title="Stato"
//       options={enrollStatusOpts}
//     />
//   )}
// </div>
// <div className="flex justify-end">
//   <Button
//     variant="outline"
//     className="whitespace-nowrap"
//     onClick={onCsvClick}
//   >
//     <MdDownload size={20} />
//     <span className="max-sm:hidden">Download CSV</span>
//   </Button>
// </div>
