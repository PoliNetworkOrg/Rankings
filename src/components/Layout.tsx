import { Outlet, useRouterContext } from "@tanstack/router";
import Header from "./Header";
import Footer from "./Footer";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export default function Layout() {
  const { isDev } = useRouterContext().context;

  return (
    <div className="flex min-h-screen flex-col items-center justify-start text-black dark:text-white">
      <Header />
      <Outlet />
      {isDev && <TanStackRouterDevtools />}
      <Footer />
    </div>
  );
}
