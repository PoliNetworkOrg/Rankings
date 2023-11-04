import { Outlet, Route } from "@tanstack/react-router";
import Page from "@/components/custom-ui/Page";
import { rootRoute } from "../root";
import PathBreadcrumb from "@/components/PathBreadcrumb";
import { choosePhaseRoute } from "./choosePhase";

export const homepageRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: function Homepage() {
    const { school, year } = choosePhaseRoute.useParams();

    return (
      <Page>
        <PathBreadcrumb school={school} year={year} />
        <div className="flex w-full flex-1 flex-col items-start gap-4 py-4">
          <Outlet />
        </div>
      </Page>
    );
  },
});
