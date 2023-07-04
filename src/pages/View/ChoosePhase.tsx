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

  const phases = data.getPhasesLinks(school, year)
  if (!phases) return <Navigate to=".." relative="path" />

  return (
    <Page>
      <ViewHeader />
      <div {...props} className="grid w-full grid-cols-2 gap-4 py-4">
        {phases.map(phase => (
          <Link to={phase.href} key={phase.href}>
            <Button className="h-full w-full">{phase.name}</Button>
          </Link>
        ))}
      </div>
    </Page>
  )
}
