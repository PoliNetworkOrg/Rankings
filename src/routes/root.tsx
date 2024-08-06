import Layout from "@/components/Layout";
import { RouterContext } from "@/router";
import { ErrorComponent, RootRoute } from "@tanstack/react-router";

export const rootRoute = RootRoute.withRouterContext<RouterContext>()({
  component: Layout,
  errorComponent: ErrorComponent,
});
