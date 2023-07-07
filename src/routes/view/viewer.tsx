import { Route } from "@tanstack/router"
import Viewer from "../../components/Viewer"
import { choosePhaseRoute } from "./ChoosePhase"

export const viewerRoute = new Route({
  getParentRoute: () => choosePhaseRoute,
  path: "$phase",
  component: Viewer
})
