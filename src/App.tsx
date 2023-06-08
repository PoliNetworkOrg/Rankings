import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"
import Footer from "./components/Footer"
import Header from "./components/Header"
import ContextProvider from "./contexts/ContextProvider"
import Homepage from "./pages/Homepage"
import About from "./pages/About"
import Privacy from "./pages/Privacy"

const routes =  [
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Homepage />
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "privacy",
        element: <Privacy />
      }
    ]
  }
]

const router = createBrowserRouter(routes, {basename: "/beta"})

function Layout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-white text-black dark:bg-slate-900 dark:text-white">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  )
}
