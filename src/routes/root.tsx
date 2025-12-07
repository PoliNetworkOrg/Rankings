import { ErrorComponent, RootRoute } from "@tanstack/router"
import Layout from "@/components/Layout"
import type { RouterContext } from "@/router"

export const rootRoute = RootRoute.withRouterContext<RouterContext>()({
  component: Layout,
  errorComponent: ErrorComponent,
})
