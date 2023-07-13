import { Outlet } from "@tanstack/router"
import Header from "./Header"
import Footer from "./Footer"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-white text-black dark:bg-slate-900 dark:text-white">
      <Header />
      <Outlet />
      {process.env.NODE_ENV === "development" && <TanStackRouterDevtools />}
      <Footer />
    </div>
  )
}
