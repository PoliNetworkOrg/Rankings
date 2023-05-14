import { useState, useEffect, useCallback } from "react"

type FilterFunction<T> = (items: T, filterValue: string) => T

interface Props<T> {
  data: T
  filterFunction: FilterFunction<T>
  delay?: number
}

function useFilter<T extends unknown[]>({
  data,
  filterFunction,
  delay = 300
}: Props<T>) {
  const [filterValue, setFilterValue] = useState<string>("")
  const [filtered, setFilteredItems] = useState<T>()

  const debouncedFilter = useCallback(
    (filterValue: string) => {
      const filteredItems: T = filterFunction(data, filterValue)
      setFilteredItems(filteredItems)
    },
    [data, filterFunction]
  )

  function updateFilter(value: string) {
    setFilterValue(value)
  }

  useEffect(() => {
    const timeoutId: number = setTimeout(() => {
      debouncedFilter(filterValue)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [filterValue, debouncedFilter, delay])

  return { filtered, filterValue, updateFilter } as const
}

export default useFilter
