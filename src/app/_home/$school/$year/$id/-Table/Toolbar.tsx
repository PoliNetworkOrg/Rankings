import type { Table } from "@tanstack/react-table"
import { useState } from "react"
import { LuCircleX } from "react-icons/lu"
import { Removable } from "@/components/custom-ui/Removable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStudentId } from "@/hooks/use-student-id"
// import { MdDownload } from "react-icons/md";
// import { FilterBtn } from "./FilterBtn";
// import { enrollStatusOpts, enrollAllowedOpts } from "./columns";
// import StudentResult from "@/utils/types/data/parsed/Ranking/StudentResult";
import { sha256 } from "@/utils/strings/crypto"
import type { StudentTableRow } from "@/utils/types/data/ranking"

type Props = {
  has: Record<keyof StudentTableRow, boolean>
  table: Table<StudentTableRow>
  onCsvClick: () => void
}

export function Toolbar({ has, onCsvClick: _, table }: Props) {
  const idCol = table.getColumn("id")
  // const enrollStatusCol = table.getColumn("enrollStatus");
  // const enrollAllowedCol = table.getColumn("enrollAllowed");

  const [savedId] = useStudentId()
  const [matricolaFilter, setMatricolaFilter] = useState<string>("")
  const [matricolaFilterSubmitted, setMatricolaFilterSubmitted] =
    useState<boolean>(false)

  function reset() {
    setMatricolaFilter("")
    idCol?.setFilterValue(undefined)
    setMatricolaFilterSubmitted(false)
  }

  async function submit(matricola: string) {
    if (matricola.length === 0) {
      reset()
      return
    }

    const hash = await sha256(matricola)
    idCol?.setFilterValue(hash)
    setMatricolaFilterSubmitted(true)
  }

  return (
    <div className="flex w-full flex-wrap items-start justify-start gap-6 max-2xs:flex-col">
      {has.id && idCol && (
        <div className="flex flex-row items-center gap-x-4 gap-y-1">
          <p className="self-center text-sm">Matricola</p>
          {matricolaFilterSubmitted &&
          table.getFilteredRowModel().rows.length !== 0 ? (
            <Removable onRemove={reset} className="justify-between">
              {matricolaFilter}
            </Removable>
          ) : (
            <>
              <form
                className="relative w-full"
                onSubmit={async (e) => {
                  e.preventDefault()
                  await submit(matricolaFilter)
                }}
              >
                <Input
                  className={
                    matricolaFilterSubmitted
                      ? "border-red-600 dark:border-red-800"
                      : ""
                  }
                  placeholder="AX1234"
                  value={matricolaFilter}
                  onChange={(e) => {
                    setMatricolaFilterSubmitted(false)
                    setMatricolaFilter(e.target.value)
                  }}
                />
                {matricolaFilter.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-7 w-7 text-gray-500 hover:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:bg-transparent dark:hover:text-gray-100"
                    onClick={reset}
                  >
                    <LuCircleX className="h-5 w-5" />
                    <span className="sr-only">Clear</span>
                  </Button>
                )}
              </form>
              {savedId && (
                <Button
                  aria-label="Seleziona ricerca recente"
                  variant="outline"
                  className="whitespace-nowrap text-center"
                  onClick={async () => {
                    await submit(savedId)
                    setMatricolaFilter(savedId)
                  }}
                >
                  📋 {savedId}
                </Button>
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
