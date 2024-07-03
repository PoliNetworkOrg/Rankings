import { ErrorComponent, rootRouteWithContext } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RouterContext } from "@/router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const rootRoute = rootRouteWithContext<RouterContext>()({
  component: Layout,
  errorComponent: ErrorComponent,
});

function Layout() {
  const { isDev } = rootRoute.useRouteContext();
  return (
    <div className="flex min-h-screen flex-col items-center justify-start text-black dark:text-white">
      <Header />
      <Outlet />
      <Footer />
      {isDev && (
        <div className="max-xl:hidden">
          <TanStackRouterDevtools />
          <ReactQueryDevtools />
        </div>
      )}
    </div>
  );
}
