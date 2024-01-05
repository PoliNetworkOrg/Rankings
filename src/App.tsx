import ContextProvider from "./contexts/ContextProvider";
import { IconContext } from "react-icons";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query";

export default function App() {
  return (
    <ContextProvider>
      <QueryClientProvider client={queryClient}>
        <IconContext.Provider
          value={{ style: { verticalAlign: "middle", fontSize: "26px" } }}
        >
          <RouterProvider router={router} />
        </IconContext.Provider>
      </QueryClientProvider>
    </ContextProvider>
  );
}
