import { useContext } from "react"
import School from "../../utils/types/data/School"
import DataContext from "../../contexts/DataContext"
import { Link, Navigate } from "react-router-dom"
import Button from "../../components/ui/Button"
import Page from "../../components/ui/Page"
import ViewHeader from "../../components/Viewer/Header"

type Props = React.HTMLAttributes<HTMLDivElement> & {
  school: School
  year: number
}

export default function ChoosePhase({ school, year, ...props }: Props) {
  const { data } = useContext(DataContext)
  const schoolData = data?.index?.schools[school]
  if (!schoolData) return <Navigate to="/" />

  const yearData = schoolData[year]
  if (!yearData) return <Navigate to="/" />

  return (
    <Page>
      <ViewHeader />
      <div {...props} className="grid w-full grid-cols-2 gap-4 py-4">
        {yearData.map(file => (
          <Link to={file.link.replace(".json", "")} key={file.link}>
            <Button className="w-full">{file.name}</Button>
          </Link>
        ))}
      </div>
    </Page>
  )
}
