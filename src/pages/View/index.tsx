import { Navigate, useParams } from "react-router-dom"
import School from "../../utils/types/data/School"
import ChooseYear from "./ChooseYear"
import ChoosePhase from "./ChoosePhase"
import Viewer from "../../components/Viewer"
import { containsOnlyNumbers } from "../../utils/strings"
import { SCHOOLS } from "../../utils/constants"

export default function View() {
  const params = useParams()

  const school = params.school ? (params.school as School) : undefined
  if (!school || !SCHOOLS.includes(school)) return <Navigate to="/" />

  if (!params.year) return <ChooseYear school={school} />

  const year = containsOnlyNumbers(params.year)
    ? parseInt(params.year)
    : undefined

  if (!year) return <Navigate to={`/view/${school}`} />

  if (!params.phase) return <ChoosePhase school={school} year={year} />
  const phase = params.phase

  return <Viewer school={school} year={year} phase={phase} />
}
