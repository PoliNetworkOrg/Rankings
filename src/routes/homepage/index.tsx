import { Outlet, Route } from "@tanstack/router"
import Page from "@/components/custom-ui/Page"
import { rootRoute } from "../root"
import PathBreadcrumb from "@/components/PathBreadcrumb"

export const homepageRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: function Homepage() {
    return (
      <Page>
        <PathBreadcrumb />
        <div className="flex w-full flex-1 flex-col items-center gap-4 py-4 md:text-center">
          <Outlet />
        </div>
      </Page>
    )
  }
})
