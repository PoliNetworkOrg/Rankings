import {
  RouterProvider,
  Router as TRouter,
  createHashHistory
} from "@tanstack/router"
import { rootRoute } from "./routes/root"
import { homepageRoute } from "./routes/homepage"
import { aboutRoute } from "./routes/about"
import { privacyRoute } from "./routes/privacy"
import { testRoute } from "./routes/test"
import { viewRoute } from "./routes/view"
import { chooseYearRoute } from "./routes/view/ChooseYear"
import { choosePhaseRoute } from "./routes/view/ChoosePhase"
import { viewerRoute } from "./routes/view/viewer"
import { notFoundRoute } from "./routes/notFound"

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

export const router = new TRouter({
  routeTree,
  history: createHashHistory()
})

declare module "@tanstack/router" {
  interface Register {
    router: typeof router
  }
}
