import { Outlet, Route } from "@tanstack/router"
import Alert from "@/components/custom-ui/Alert"
import Page from "@/components/custom-ui/Page"
import { rootRoute } from "../root"
import PathBreadcrumb from "@/components/PathBreadcrumb"

export const homepageRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: function Homepage() {
    return (
      <Page>
        <PathBreadcrumb />
        <div className="flex w-full flex-1 flex-col items-center gap-4 py-4">
          <Outlet />
        </div>

        <Alert level="warning">
          <p>
            L'accuratezza o l'affidabilità dei contenuti di questo sito non è
            garantita.
          </p>
          <p className="italic">
            Se vuoi controllare la tua posizione nella graduatoria per
            immatricolarti, consulta il sito del{" "}
            <a href="https://polimi.it">Politecnico di Milano</a>.
          </p>
        </Alert>
      </Page>
    )
  }
})
