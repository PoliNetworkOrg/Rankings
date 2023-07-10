import { Route } from "@tanstack/router"
import Page from "@/components/custom-ui/Page"
import { rootRoute } from "../root"

export const privacyRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "privacy",
  component: function Privacy() {
    return (
      <Page>
        <div style={{ padding: 20 }}>
          <div style={{ textAlign: "justify" }}>
            <div style={{ padding: 10 }}></div>
            <div style={{ textAlign: "center" }}>
              <h1>
                <b>Privacy</b>
              </h1>
            </div>
            <div style={{ padding: 20 }}></div>
            <div>
              <p>
                La privacy è un valore <b>fondante</b> di{" "}
                <a href="https://polinetwork.org">PoliNetwork</a>.
              </p>
              <div style={{ padding: 10 }}> </div>
              <p>
                Questo sito non utilizza nessun tipo di cookie, né presenta
                forme di pubblicità o tracciamento.{" "}
              </p>
              <div style={{ padding: 30 }}> </div>
              <hr style={{ opacity: 0.1 }} />
              <div style={{ padding: 30 }}> </div>
              <p>
                Potete in ogni caso consultare il nostro sito e la nostra
                raccolta di informative privacy a{" "}
                <a href="https://polinetwork.org/learnmore/privacy">
                  questo link
                </a>
              </p>
              <div style={{ padding: 10 }}> </div>
              <p>
                Se avete ulteriori dubbi{" "}
                <a href="https://polinetwork.org/learnmore/contacts/">
                  contattateci!
                </a>
              </p>
            </div>
          </div>
        </div>
      </Page>
    )
  }
})
