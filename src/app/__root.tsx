import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { StrictMode } from "react"
import { IconContext } from "react-icons"
import DevSettings from "@/components/DevSettings"
import Layout from "@/components/Layout"
import { Toaster } from "@/components/ui/sonner"
import ContextProvider from "@/contexts/ContextProvider"
import { TooltipProvider } from "@/components/ui/tooltip"

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
          <TooltipProvider>
            <QueryClientProvider client={queryClient}>
              <Layout>
                <Outlet />

                {import.meta.env.DEV && <DevSettings />}
              </Layout>
              <Toaster richColors position="bottom-center" />
            </QueryClientProvider>
          </TooltipProvider>
        </IconContext.Provider>
      </ContextProvider>
    </StrictMode>
  )
}
