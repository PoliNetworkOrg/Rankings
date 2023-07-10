import { useContext } from "react"
import { Outlet } from "@tanstack/router"
import DataContext from "@/contexts/DataContext"
import Header from "./Header"
import Footer from "./Footer"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"

export default function Layout() {
  const { isLoading } = useContext(DataContext)

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-white text-black dark:bg-slate-900 dark:text-white">
      <Header />
      {!isLoading && <Outlet />}
      <TanStackRouterDevtools />
      <Footer />
    </div>
  )
}
