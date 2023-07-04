import { useContext } from "react"
import School from "../../utils/types/data/School"
import DataContext from "../../contexts/DataContext"
import { Link, Navigate } from "react-router-dom"
import Button from "../../components/ui/Button"
import Page from "../../components/ui/Page"
import ViewHeader from "../../components/Viewer/Header"

type Props = React.HTMLAttributes<HTMLDivElement> & {
  school: School
}

export default function ChooseYear({ school, ...props }: Props) {
  const { data } = useContext(DataContext)

  const years = data.getYears(school)
  if (!years) return <Navigate to="/" />

  return (
    <Page>
      <ViewHeader />
      <div {...props} className="grid w-full grid-cols-2 gap-4 py-4">
        {years.map(year => (
          <Link to={year.toString()} key={year}>
            <Button className="w-full">{year}</Button>
          </Link>
        ))}
      </div>
    </Page>
  )
}
