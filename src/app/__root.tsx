import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { StrictMode } from "react"
import { IconContext } from "react-icons"
import Layout from "@/components/Layout"
import ContextProvider from "@/contexts/ContextProvider"

export const queryClient = new QueryClient()
export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <StrictMode>
      <ContextProvider>
        <IconContext.Provider
          value={{ style: { verticalAlign: "middle", fontSize: "26px" } }}
        >
          <QueryClientProvider client={queryClient}>
            <Layout>
              <Outlet />
            </Layout>
          </QueryClientProvider>
        </IconContext.Provider>
      </ContextProvider>
    </StrictMode>
  )
}
