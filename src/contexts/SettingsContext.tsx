import { createContext, useState } from "react"
import type { DataSource } from "@/utils/queries"

export interface ISettingsContext {
  dataSource: DataSource
  localPort: number
  ref: string
  setDataSource: (ds: DataSource) => void
  changeLocalPort: (port: number) => void
  setRef: (ref: string) => void
}

export const SettingsContext = createContext<ISettingsContext>({
  dataSource: "github",
  localPort: 6767,
  ref: "main",
  setDataSource: () => {},
  changeLocalPort: () => {},
  setRef: () => {},
})

type Props = React.HTMLAttributes<React.ProviderProps<ISettingsContext>>
export function SettingsProvider({ ...p }: Props) {
  const [dataSource, setDataSource] = useState<"github" | "local">("github")
  const [localPort, setLocalPort] = useState<number>(6767)
  const [ref, setRef] = useState<string>("main")

  function changeLocalPort(port: number) {
    if (port < 1000 || port > 65535) return
    setLocalPort(port)
  }

  return (
    <SettingsContext.Provider
      value={{
        dataSource,
        setDataSource,
        localPort,
        changeLocalPort,
        ref,
        setRef,
      }}
      {...p}
    />
  )
}
