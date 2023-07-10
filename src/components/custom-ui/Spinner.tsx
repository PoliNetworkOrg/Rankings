import { useContext } from "react"
import { PuffLoader } from "react-spinners"
import DarkModeContext from "@/contexts/DarkModeContext"

interface Props {
  loading?: boolean
}
export default function Spinner({ loading = true }: Props) {
  const { isDarkMode } = useContext(DarkModeContext)
  return (
    <div className="flex flex-1 items-center justify-center">
      <PuffLoader
        color={isDarkMode ? "#ffffff" : "#333333"}
        loading={loading}
      />
    </div>
  )
}
