import { Navigate, useParams } from "react-router-dom"
import School from "../../utils/types/data/School"
import ChooseYear from "./ChooseYear"
import ChoosePhase from "./ChoosePhase"
import Viewer from "../../components/Viewer/Viewer"

export default function View() {
  const params = useParams()
  const school = params.school ? (params.school as School) : undefined
  const year = params.year ? parseInt(params.year) : undefined
  const phase = params.phase

  if (!school) return <Navigate to="/" />
  if (school && year !== undefined && isNaN(year))
    return <Navigate to={`/view/${school}`} />

  return (
    <>
      {school && !year && !phase && <ChooseYear school={school} />}
      {school && year && !phase && <ChoosePhase school={school} year={year} />}
      {school && year && phase && (
        <Viewer school={school} year={year} phase={phase} />
      )}
    </>
  )
}
