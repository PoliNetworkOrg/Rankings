import { useContext } from "react"
import DataContext from "../contexts/DataContext"
import Header from "./Header"
import { Outlet } from "react-router-dom"
import Footer from "./Footer"

export default function Layout() {
  const { isLoading } = useContext(DataContext)

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-white text-black dark:bg-slate-900 dark:text-white">
      <Header />
      {!isLoading && <Outlet />}
      <Footer />
    </div>
  )
}
