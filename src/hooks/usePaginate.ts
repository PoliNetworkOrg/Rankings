import { useState } from "react"

interface Props<T> {
  itemsPerPage: number
  data: T
}
export default function usePaginate<T extends unknown[]>({
  data,
  itemsPerPage
}: Props<T>) {
  const [offset, setOffset] = useState(0)
  const endOffset = offset + itemsPerPage
  const rows: T = data.slice(offset, endOffset) as T
  const pageCount = Math.ceil(data.length / itemsPerPage)
  const handlePageClick = ({ selected }: { selected: number }) => {
    const newOffset = (selected * itemsPerPage) % data.length
    setOffset(newOffset)
  }

  return { handlePageClick, rows, pageCount }
}
