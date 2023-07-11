import { ErrorComponent, Link, Navigate, Route } from "@tanstack/router"
import School from "@/utils/types/data/School"
import { Button } from "@/components/ui/button"
import Page from "@/components/custom-ui/Page"
import { NotFoundError } from "@/utils/errors"
import ViewHeader from "./viewer/Header"
import { rootRoute } from "../root"

export const chooseYearRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/view/$school",
  parseParams: ({ school }) => ({
    school: school as School
  }),
  loader: async ({ context, params }) => {
    const data = await context.data
    const variables = { ...params, data }

    const loader = context.loaderClient.loaders.chooseYear
    const result = await loader.load({ variables })

    return result
  },
  errorComponent: ({ error }) => {
    if (error instanceof NotFoundError) return <Navigate to="/" />

    return <ErrorComponent error={error} />
  },
  component: function ChooseYear({ useLoader, useParams }) {
    const { years } = useLoader()
    const { school } = useParams()

    return (
      <Page>
        <ViewHeader />
        <div className="grid w-full grid-cols-2 gap-4 py-4">
          {years
            .sort((a, b) => b - a)
            .map(year => (
              <Link
                to="/view/$school/$year"
                params={{ school, year }}
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
