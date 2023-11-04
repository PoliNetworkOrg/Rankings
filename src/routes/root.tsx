import { ErrorComponent, RouterContext } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RouterContext as TRouterContext } from "@/router";

const routerContext = new RouterContext<TRouterContext>();

export const rootRoute = routerContext.createRootRoute({
  component: function Layout() {
    return (
      <div className="flex min-h-screen flex-col items-center justify-start text-black dark:text-white">
        <Header />
        <Outlet />
        <Footer />
      </div>
    );
  },
  errorComponent: ErrorComponent,
});
