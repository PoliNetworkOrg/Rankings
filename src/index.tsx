import {
  createHashHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"
import ReactDOM from "react-dom/client"
import { routeTree } from "./routeTree.gen"
import "./index.css"

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  history: createHashHistory(), // gh pages
})

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

// biome-ignore lint/style/noNonNullAssertion: trust me
const rootElement = document.getElementById("root")!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<RouterProvider router={router} />)
}
