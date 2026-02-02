import { createFileRoute } from "@tanstack/react-router"
import Alert from "@/components/custom-ui/Alert"
import Page from "@/components/custom-ui/Page"
import { ALERT_LEVELS } from "@/utils/constants"

export const Route = createFileRoute("/test")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Page>
      {" "}
      <div>
        {ALERT_LEVELS.map((l) => (
          <Alert level={l} key={l} className="mb-4">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.{" "}
            </p>
            <b>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.{" "}
            </b>
          </Alert>
        ))}
      </div>
    </Page>
  )
}
