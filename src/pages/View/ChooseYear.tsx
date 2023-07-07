import { HTMLAttributes, useContext } from "react"
import { useParams, Link, Navigate } from "@tanstack/router"
import School from "../../utils/types/data/School"
import DataContext from "../../contexts/DataContext"
import Button from "../../components/ui/Button"
import Page from "../../components/ui/Page"
import ViewHeader from "../../components/Viewer/Header"

type Props = HTMLAttributes<HTMLDivElement>
export default function ChooseYear(props: Props) {
  const { data } = useContext(DataContext)
  const { school } = useParams()

  if (!school) return <Navigate to="/" />

  const years = data.getYears(school as School)
  if (!years) return <Navigate to="/" />

  return (
    <Page>
      <ViewHeader />
      <div {...props} className="grid w-full grid-cols-2 gap-4 py-4">
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
