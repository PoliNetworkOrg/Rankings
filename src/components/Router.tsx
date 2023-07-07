import {
  Navigate,
  RouteObject,
  RouterProvider,
  createHashRouter
} from "react-router-dom"
import View from "../pages/View"
import Test from "../pages/Test"
import Homepage from "../pages/Homepage"
import About from "../pages/About"
import Privacy from "../pages/Privacy"
import Layout from "./Layout"

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
export default function Router() {
  return <RouterProvider router={router} />
}
