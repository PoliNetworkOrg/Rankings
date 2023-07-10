import { Route } from "@tanstack/router"
import Viewer from "../../components/Viewer"
import { rootRoute } from "../root"

export const viewerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/view/$school/$year/$phase",
  component: Viewer
})
