import ContextProvider from "./contexts/ContextProvider";
import { IconContext } from "react-icons";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export default function App() {
  return (
    <ContextProvider>
      <IconContext.Provider
        value={{ style: { verticalAlign: "middle", fontSize: "26px" } }}
      >
        <RouterProvider router={router} />
        {process.env.NODE_ENV === "development" && (
          <TanStackRouterDevtools router={router} />
        )}
      </IconContext.Provider>
    </ContextProvider>
  );
}
