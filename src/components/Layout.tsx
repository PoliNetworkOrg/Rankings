import { Outlet, useRouterContext } from "@tanstack/router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import Footer from "./Footer"
import Header from "./Header"

export default function Layout() {
  const { isDev } = useRouterContext().context

  return (
    <div className="flex min-h-screen flex-col items-center justify-start font-openSans text-black dark:text-white">
      <Header />
      <Outlet />
      {isDev && <TanStackRouterDevtools />}
      <Footer />
    </div>
  )
}
