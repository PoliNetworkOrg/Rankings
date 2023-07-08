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
  const [timeoutState, setTimeoutState] = useState<NodeJS.Timeout | null>(null)

  const updateFilter = useCallback(
    (filterValue: string) => {
      if (timeoutState !== null) {
        clearTimeout(timeoutState)
      }

      const newTimeout = setTimeout(() => {
        const filteredData = filterFunction(data, filterValue)
        setFilteredData(filteredData)
      }, delay)

      setFilterValue(filterValue)
      setTimeoutState(newTimeout)
    },
    [data, filterFunction, delay, timeoutState]
  )

  useEffect(() => {
    setFilteredData(data)
    setFilterValue("")
  }, [data, delay])

  return { filteredData, filterValue, updateFilter }
}
