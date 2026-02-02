import { useCallback, useEffect, useState } from "react"
import { LOCAL_STORAGE } from "@/utils/constants"

export function useStudentId() {
  const [currentId, setCurrentId] = useState<string | null>(null)

  useEffect(() => {
    setCurrentId(localStorage.getItem(LOCAL_STORAGE.searchedStudentId))
  }, [])

  const set = useCallback((id: string | null) => {
    if (id) {
      localStorage.setItem(LOCAL_STORAGE.searchedStudentId, id)
    } else {
      localStorage.removeItem(LOCAL_STORAGE.searchedStudentId)
    }
    setCurrentId(id)
  }, [])

  return [currentId, set] as const
}
