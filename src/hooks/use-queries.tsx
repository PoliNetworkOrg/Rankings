import { useSettingsStore } from "@/stores/settings-store"
import { getActiveQueries } from "@/utils/queries"

export function useQueries() {
  const settings = useSettingsStore()
  return getActiveQueries(settings)
}
