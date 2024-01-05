import {
  Navigate,
  Route,
  Router,
  createHashHistory,
} from "@tanstack/react-router";
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
import { chooseSchoolRoute } from "./routes/homepage/chooseSchool";
import { DATA_REF, LINKS } from "./utils/constants";
import { sourceRoute } from "./routes/source";
import { QueryClient } from "@tanstack/react-query";
import { queryClient } from "./query";

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
]);

export type RouterContext = {
  queryClient: QueryClient;
  data: Promise<Data>;
  isDev: boolean;
};

const history = createHashHistory();
export const router = new Router({
  routeTree,
  context: {
    queryClient,
    data: Data.init(DATA_REF.STABLE),
    isDev:
      new URL(window.location.href).hostname == LINKS.githubPreviewDomain ||
      process.env.NODE_ENV == "development",
  },
  history,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
