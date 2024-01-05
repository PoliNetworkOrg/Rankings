import { Navigate, Route } from "@tanstack/react-router";
import { rootRoute } from "../root";

export const notFoundRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "*",
  component: () => <Navigate to="/home" replace />,
});
