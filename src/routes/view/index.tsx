import { Route } from "@tanstack/router"
import { rootRoute } from "../root"

export const viewRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "view"
})
