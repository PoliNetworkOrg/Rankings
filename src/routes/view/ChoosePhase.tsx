import { useContext } from "react"
import { useParams, Link, Navigate, Route } from "@tanstack/router"
import DataContext from "../../contexts/DataContext"
import Button from "../../components/ui/Button"
import Page from "../../components/ui/Page"
import ViewHeader from "../../components/Viewer/Header"
import School from "../../utils/types/data/School"
import { chooseYearRoute } from "./ChooseYear"

export const choosePhaseRoute = new Route({
  getParentRoute: () => chooseYearRoute,
  path: "$year",
  component: function ChoosePhase() {
    const { data } = useContext(DataContext)
    const { school, year } = useParams()
    if (!school) return <Navigate to="/" />

    const yearInt = year ? parseInt(year) : NaN
    if (!year || isNaN(yearInt))
      return <Navigate to="/view/$school" params={{ school }} />

    const phases = data.getPhasesLinks(school as School, yearInt)
    if (!phases) return <Navigate to="/view/$school" params={{ school }} />

    return (
      <Page>
        <ViewHeader />
        <div className="grid w-full grid-cols-2 gap-4 py-4">
          {phases.map(phase => (
            <Link
              to="/view/$school/$year/$phase"
              params={{ school, year, phase: phase.href }}
              key={phase.href}
            >
              <Button className="h-full w-full">{phase.name}</Button>
            </Link>
          ))}
        </div>
      </Page>
    )
  }
})
