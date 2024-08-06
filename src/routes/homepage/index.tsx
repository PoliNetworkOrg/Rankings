import Page from "@/components/custom-ui/Page";
import { rootRoute } from "../root";
import PathBreadcrumb from "@/components/PathBreadcrumb";
 import { Outlet, Route } from "@tanstack/react-router";

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
    );
  },
});
