import { useContext } from "react"
import School from "../../utils/types/data/School"
import DataContext from "../../contexts/DataContext"
import { Link, Navigate } from "react-router-dom"
import Button from "../../components/ui/Button"

type Props = React.HTMLAttributes<HTMLDivElement> & {
  school: School
}

export default function ChooseYear({ school, ...props }: Props) {
  const { data } = useContext(DataContext)
  const schoolData = data?.index?.schools[school]
  if (!schoolData) return <Navigate to="/" />

  return (
    <div {...props}>
      {school}
      <div>
        {Object.keys(schoolData).map(year => (
          <Link to={year} key={year}>
            <Button>{year}</Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
