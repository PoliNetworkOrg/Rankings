import {
  RouterProvider,
  Router as TRouter,
  Route,
  RootRoute,
  createHashHistory,
  Navigate
} from "@tanstack/router"
import Test from "../pages/Test"
import Homepage from "../pages/Homepage"
import About from "../pages/About"
import Privacy from "../pages/Privacy"
import Layout from "./Layout"
import ChooseYear from "../pages/View/ChooseYear"

/* route def starts */

const rootRoute = new RootRoute({
  component: Layout
})

const homepageRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Homepage
})

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "about",
  component: About
})

const privacyRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "privacy",
  component: Privacy
})

const testRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "test",
  component: Test
})

const viewRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "view"
})

const chooseYearRoute = new Route({
  getParentRoute: () => viewRoute,
  path: "$school",
  component: ChooseYear
})

const choosePhaseRoute = new Route({
  getParentRoute: () => chooseYearRoute,
  path: "$year"
})

const viewerRoute = new Route({
  getParentRoute: () => choosePhaseRoute,
  path: "$phase"
})

const notFoundRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "*",
  component: () => <Navigate to="/" />
})

/* routes def ends */

const routeTree = rootRoute.addChildren([
  homepageRoute,
  aboutRoute,
  privacyRoute,
  testRoute,
  viewRoute.addChildren([
    chooseYearRoute.addChildren([choosePhaseRoute.addChildren([viewerRoute])])
  ]),
  notFoundRoute
])

const router = new TRouter({
  routeTree,
  history: createHashHistory()
})

declare module "@tanstack/router" {
  interface Register {
    router: typeof router
  }
}

export default function Router() {
  return <RouterProvider router={router} />
}
