import { useContext } from "react"
import { useParams, Link, Navigate, Route } from "@tanstack/router"
import School from "@/utils/types/data/School"
import DataContext from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import Page from "@/components/custom-ui/Page"
import ViewHeader from "@/components/Viewer/Header"
import { rootRoute } from "../root"

export const chooseYearRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/view/$school",
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
              <Button variant="secondary" className="w-full">
                {year}
              </Button>
            </Link>
          ))}
        </div>
      </Page>
    )
  }
})
