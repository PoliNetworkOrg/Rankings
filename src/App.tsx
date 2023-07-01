import {
  Navigate,
  Outlet,
  RouteObject,
  RouterProvider,
  createHashRouter
} from "react-router-dom"
import Footer from "./components/Footer"
import Header from "./components/Header"
import ContextProvider from "./contexts/ContextProvider"
import Homepage from "./pages/Homepage"
import About from "./pages/About"
import Privacy from "./pages/Privacy"
import { IconContext } from "react-icons"
import { useContext } from "react"
import DataContext from "./contexts/DataContext"
import View from "./pages/View"
import Test from "./pages/Test"

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Homepage />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/privacy",
        element: <Privacy />
      },
      {
        path: "/test",
        element: <Test />
      },
      {
        path: "/view/:school/:year?/:phase?",
        element: <View />
      },
      {
        path: "*",
        element: <Navigate to="/" />
      }
    ]
  }
]

const router = createHashRouter(routes)

function Layout() {
  const { isLoading } = useContext(DataContext)

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-white text-black dark:bg-slate-900 dark:text-white">
      <Header />
      {!isLoading && <Outlet />}
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ContextProvider>
      <IconContext.Provider value={{ size: "28px" }}>
        <RouterProvider router={router} />
      </IconContext.Provider>
    </ContextProvider>
  )
}
