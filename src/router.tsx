import {
  Navigate,
  Route,
  Router as TRouter,
  createHashHistory,
} from "@tanstack/router";
import { rootRoute } from "./routes/root";
import { homepageRoute } from "./routes/homepage";
import { aboutRoute } from "./routes/about";
import { privacyRoute } from "./routes/privacy";
import { testRoute } from "./routes/test";
import { chooseYearRoute } from "./routes/homepage/chooseYear";
import { choosePhaseRoute } from "./routes/homepage/choosePhase";
import { viewerRoute } from "./routes/viewer";
import { notFoundRoute } from "./routes/notFound";
import Data from "./utils/data/data";
import { loaderClient } from "./utils/loaders";
import { chooseSchoolRoute } from "./routes/homepage/chooseSchool";

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Navigate to="/home" replace />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  homepageRoute.addChildren([
    chooseSchoolRoute,
    chooseYearRoute,
    choosePhaseRoute,
  ]),
  aboutRoute,
  privacyRoute,
  testRoute,
  viewerRoute,
  notFoundRoute,
]);

export type RouterContext = {
  loaderClient: typeof loaderClient;
  data: Promise<Data>;
};

export const router = new TRouter({
  routeTree,
  context: {
    loaderClient,
    data: Data.init(),
  },
  history: createHashHistory(),
});

declare module "@tanstack/router" {
  interface Register {
    router: typeof router;
  }
}
