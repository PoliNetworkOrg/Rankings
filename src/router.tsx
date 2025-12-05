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
import { DATA_REF, LINKS } from "./utils/constants";
import { sourceRoute } from "./routes/source";
import { betaRoute } from "./routes/beta";

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
  sourceRoute,
  notFoundRoute,
  betaRoute
]);

export type RouterContext = {
  loaderClient: typeof loaderClient;
  isDev: boolean;
  data: Promise<Data>;
  devData: Promise<Data>;
};

export const router = new TRouter({
  routeTree,
  context: {
    loaderClient,
    isDev:
      new URL(window.location.href).hostname == LINKS.githubPreviewDomain ||
      process.env.NODE_ENV == "development",
    data: Data.init(DATA_REF.STABLE),
    devData: Data.init(DATA_REF.MAIN),
  },
  history: createHashHistory(),
});

declare module "@tanstack/router" {
  interface Register {
    router: typeof router;
  }
}
