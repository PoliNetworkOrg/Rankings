import { Link, Route } from "@tanstack/router"
import Alert from "@/components/custom-ui/Alert"
import Page from "@/components/custom-ui/Page"
import { Button } from "@/components/ui/button"
import { rootRoute } from "../root"

export const homepageRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  loader: async ({ context }) => {
    const { data } = context
    return await data
  },
  component: function Homepage({ useLoader }) {
    const data = useLoader()
    return (
      <Page className="text-center">
        <div className="flex flex-col items-center gap-4 py-4">
          <h3 className="text-2xl font-bold">
            Benvenuto nello storico delle graduatorie del Politecnico di Milano!
          </h3>

          <p className="text-xl">
            Inizia scegliendo la scuola di tuo interesse
          </p>

          <div className="grid w-full grid-cols-2 items-center gap-4 py-4 max-sm:grid-cols-1">
            {data.schools.map(school => (
              <Link to="/view/$school" params={{ school: school }} key={school}>
                <Button variant="secondary" size="card" className="w-full">
                  <span className="text-lg">{school}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex-1"></div>

        <Alert level="warning" className="max-w-2xl">
          <p>
            L'accuratezza o l'affidabilità dei contenuti di questo sito non è
            garantita{" "}
          </p>
          <p className="mt-2 italic">
            Se vuoi controllare la tua posizione nella graduatoria per
            immatricolarti, consulta il sito del{" "}
            <a href="https://polimi.it">Politecnico di Milano</a>
          </p>
        </Alert>
      </Page>
    )
  }
})
