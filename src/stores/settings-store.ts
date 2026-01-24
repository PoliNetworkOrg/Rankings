import { create } from "zustand"
import type { DataSource } from "@/utils/queries"

export interface SettingsState {
  dataSource: DataSource
  localPort: number
  ref: string
  // Actions
  setDataSource: (dataSource: DataSource) => void
  changeLocalPort: (port: number) => void
  setRef: (ref: string) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  // Initial State
  dataSource: "github",
  localPort: 6767,
  ref: "main",

  // Actions
  setDataSource: (dataSource) => set({ dataSource }),

  changeLocalPort: (port) => {
    if (port < 1000 || port > 65535) return
    set({ localPort: port })
  },

  setRef: (ref) => set({ ref }),
}))
