import { useParams } from "react-router-dom"

export default function View() {
  const params = useParams()
  return <div>{params.school}</div>
}
