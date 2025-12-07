import { Outlet, Route } from "@tanstack/router"
import Page from "@/components/custom-ui/Page"
import PathBreadcrumb from "@/components/PathBreadcrumb"
import { rootRoute } from "../root"

export const homepageRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: function Homepage() {
    return (
      <Page>
        <PathBreadcrumb />
        <div className="flex w-full flex-1 flex-col items-start gap-4 py-4">
          <Outlet />
        </div>
      </Page>
    )
  },
})
