import type { Header } from "@tanstack/react-table"
import type { StudentTableRow } from "@/utils/types/data/ranking"

export function getHeaderBorder(
  header: Header<StudentTableRow, unknown>,
  headersLength: number
): string {
  if (header.isPlaceholder || headersLength === 1) return ""
  if (header.index === 0) return "border-r"
  if (header.index === headersLength - 1) return "border-l"
  return "border-x"
}

export function getRowSpan(header: Header<StudentTableRow, unknown>): number {
  if (header.isPlaceholder || !header.column.columnDef.header) return 0
  if (header.depth === 1 && header.subHeaders.length > 0) {
    if (!header.subHeaders[0].column.columnDef.header) return 2
  }

  return 1
}

export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = `${filename ?? "data"}.csv`
  a.click()

  a.remove()

  window.URL.revokeObjectURL(url)
}
