import { useContext } from "react"
import { Link, Route } from "@tanstack/router"
import DataContext from "../../contexts/DataContext"
import Alert from "@/components/custom-ui/Alert"
import Page from "@/components/custom-ui/Page"
import { Button } from "@/components/ui/button"
import { rootRoute } from "../root"

export const homepageRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Homepage() {
    const { data } = useContext(DataContext)
    return (
      <Page className="text-center">
        <hr className="py-4" />

        <h3 className="text-xl font-bold">
          Benvenuto nello storico delle graduatorie del Politecnico di Milano!
        </h3>

        <div style={{ padding: 5 }}></div>
        <p className="text-lg">Inizia scegliendo la scuola di tuo interesse</p>

        <div className="grid grid-cols-2 items-center gap-4 py-4">
          {data.schools.map(school => (
            <Link to="/view/$school" params={{ school: school }} key={school}>
              <Button variant="secondary" className="w-32">
                {school}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex-1"></div>

        <Alert level={"warning"}>
          <p>
            Questo progetto è gestito da{" "}
            <a href="https://polinetwork.org">PoliNetwork</a> e non è in alcun
            modo collegato al Politecnico di Milano.
          </p>
          <p>
            Gli autori del Progetto non si assumono alcuna responsabilità, né
            garantiscono espressamente o implicitamente l'accuratezza o
            l'affidabilità dei contenuti di questo sito.
          </p>
          <div style={{ padding: 5 }}></div>
          <i>
            Se vuoi controllare la tua posizione nella graduatoria per
            immatricolarti, consulta il sito del{" "}
            <a href="https://polimi.it">Politecnico di Milano</a>
          </i>
        </Alert>
      </Page>
    )
  }
})
