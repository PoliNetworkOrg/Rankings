import { useState, useEffect, useCallback } from "react"

interface Props<T> {
  data: T
  filterFunction: (data: T, filterValue: string) => T
  delay?: number
}

interface FilterResult<T> {
  filteredData: T
  filterValue: string
  updateFilter: (filterValue: string) => void
}

export default function useFilter<T extends unknown[]>({
  data,
  filterFunction,
  delay = 500
}: Props<T>): FilterResult<T> {
  const [filterValue, setFilterValue] = useState("")
  const [filteredData, setFilteredData] = useState<T>(data)
  const [timeoutId, setTimeoutId] = useState<number | null>(null)

  const updateFilter = useCallback(
    (filterValue: string) => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }

      const newTimeoutId = setTimeout(() => {
        const filteredData = filterFunction(data, filterValue)
        setFilteredData(filteredData)
      }, delay)

      setFilterValue(filterValue)
      setTimeoutId(newTimeoutId)
    },
    [data, filterFunction, delay, timeoutId]
  )

  useEffect(() => {
    setFilteredData(data)
    setFilterValue("")
  }, [data, delay])

  return { filteredData, filterValue, updateFilter }
}
