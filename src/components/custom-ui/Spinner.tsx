import { useContext } from "react"
import DarkModeContext from "../../contexts/DarkModeContext"
import { PuffLoader } from "react-spinners"

interface Props {
  loading?: boolean
}
export default function Spinner({ loading = true }: Props) {
  const { isDarkMode } = useContext(DarkModeContext)
  return (
    <PuffLoader color={isDarkMode ? "#ffffff" : "#333333"} loading={loading} />
  )
}
