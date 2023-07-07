import { useContext } from "react"
import { useParams, Link, Navigate, Route } from "@tanstack/router"
import School from "../../utils/types/data/School"
import DataContext from "../../contexts/DataContext"
import Button from "../../components/ui/Button"
import Page from "../../components/ui/Page"
import ViewHeader from "../../components/Viewer/Header"
import { viewRoute } from "."

export const chooseYearRoute = new Route({
  getParentRoute: () => viewRoute,
  path: "$school",
  component: function ChooseYear() {
    const { data } = useContext(DataContext)
    const { school } = useParams()

    if (!school) return <Navigate to="/" />

    const years = data.getYears(school as School)
    if (!years) return <Navigate to="/" />

    return (
      <Page>
        <ViewHeader />
        <div className="grid w-full grid-cols-2 gap-4 py-4">
          {years.map(year => (
            <Link
              to="/view/$school/$year"
              params={{ school, year: year.toString() }}
              key={year}
            >
              <Button className="w-full">{year}</Button>
            </Link>
          ))}
        </div>
      </Page>
    )
  }
})
