import { useContext, useMemo } from "react"
import { SettingsContext } from "@/contexts/SettingsContext"
import { queryFactory } from "@/utils/queries"

export function useQueries() {
  const { dataSource, ref, localPort } = useContext(SettingsContext)
  return useMemo(
    () =>
      dataSource === "github"
        ? queryFactory({ source: dataSource, ref })
        : queryFactory({ source: "local", port: localPort }),
    [dataSource, ref, localPort]
  )
}
