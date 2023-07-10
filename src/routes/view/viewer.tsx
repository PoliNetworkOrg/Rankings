import { Route } from "@tanstack/router"
import Viewer from "./viewer/index.tsx"
import { rootRoute } from "../root"

export const viewerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/view/$school/$year/$phase",
  component: Viewer
})
