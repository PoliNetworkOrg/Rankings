import { Link, Navigate, Route, ErrorComponent } from "@tanstack/router"
import { Button } from "@/components/ui/button"
import Page from "@/components/custom-ui/Page"
import School from "@/utils/types/data/School"
import { NotFoundError } from "@/utils/errors"
import ViewHeader from "./viewer/Header"
import { rootRoute } from "../root"

export const choosePhaseRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/view/$school/$year",
  parseParams: ({ school, year }) => ({
    school: school as School,
    year: Number(year)
  }),
  loader: async ({ context, params }) => {
    const data = await context.data
    const variables = { ...params, data }

    const { choosePhase } = context.loaderClient.loaders

    const result = await choosePhase.load({ variables })
    return result
  },
  errorComponent: ({ error }) => {
    if (error instanceof NotFoundError)
      return <Navigate from={choosePhaseRoute.id} to=".." />

    return <ErrorComponent error={error} />
  },
  component: function ChoosePhase({ useParams, useLoader }) {
    const { phases } = useLoader()
    const { school, year } = useParams()

    return (
      <Page>
        <ViewHeader />
        <div className="grid w-full grid-cols-2 gap-4 py-4 max-sm:grid-cols-1">
          {phases.map(phase => (
            <Link
              to="/view/$school/$year/$phase"
              params={{ school, year, phase: phase.href }}
              key={phase.href}
            >
              <Button variant="secondary" className="h-full w-full">
                {phase.name}
              </Button>
            </Link>
          ))}
        </div>
      </Page>
    )
  }
})
