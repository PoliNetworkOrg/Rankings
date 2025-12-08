import { createFileRoute } from "@tanstack/react-router"
import Page from "@/components/custom-ui/Page"

export const Route = createFileRoute("/privacy")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Page>
      <div className="flex flex-col gap-8 p-8 text-justify">
        <h2 className="text-center font-bold text-lg">Privacy</h2>
        <div>
          <p>
            La privacy è un valore <b>fondante</b> di{" "}
            <a href="https://polinetwork.org">PoliNetwork</a>.
          </p>
          <p className="mt-4">
            Questo sito non utilizza nessun tipo di cookie, né presenta forme di
            pubblicità o tracciamento.{" "}
          </p>
        </div>
        <hr className="my-4 opacity-20" />
        <div>
          <p>
            Potete in ogni caso consultare il nostro sito e la nostra raccolta
            di informative privacy a{" "}
            <a href="https://polinetwork.org/learnmore/privacy">questo link</a>.
          </p>
          <p className="mt-4">
            Se avete ulteriori dubbi{" "}
            <a href="https://polinetwork.org/learnmore/contacts/">
              contattateci!
            </a>
          </p>
        </div>
      </div>
    </Page>
  )
}
