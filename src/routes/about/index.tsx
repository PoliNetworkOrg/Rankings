import { Route } from "@tanstack/router"
import Page from "../../components/ui/Page"
import { rootRoute } from "../root"

export const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "about",
  component: function About() {
    return (
      <Page>
        <div style={{ padding: 20 }}>
          <div style={{ textAlign: "justify" }}>
            <div style={{ padding: 10 }}></div>
            <div style={{ textAlign: "center" }}>
              <h1>
                <b>About</b>
              </h1>
            </div>
            <div style={{ padding: 20 }}></div>
            <div>
              Il seguente progetto mira a conservare lo storico delle
              graduatorie d'ammissione al Politecnico di Milano.
            </div>
            <div style={{ padding: 2 }}></div>
            <div>
              {" "}
              Propone una visualizzazione graficamente migliore, responsive,
              sviluppata dal nostro team di design.
            </div>
            <div style={{ padding: 15 }}> </div>
            <div>Partecipanti e collaboratori:</div>
            <ul style={{ listStyle: "unset" }}>
              <div style={{ padding: 2 }}></div>
              <li style={{ marginLeft: 20 }}>
                Lorenzo Corallo, Developer,{" "}
                <a href="https://t.me/lorenzocorallo">Telegram</a>
              </li>
              <div style={{ padding: 2 }}></div>
              <li style={{ marginLeft: 20 }}>
                Giovanni Malusa, Designer,{" "}
                <a href="https://t.me/giovannimalausa">Telegram</a>
              </li>
            </ul>
            <div style={{ padding: 20 }}></div>
            <div>
              Sei interessato a contribuire allo sviluppo dei progetti del
              network e/o conoscere di più la nostra realtà?{" "}
              <a href="https://polinetwork.org/learnmore/contacts/">
                Contattaci!
              </a>
            </div>
            <div style={{ padding: 15 }}> </div>
            <div style={{ textAlign: "right" }}>
              Sviluppato con amore da{" "}
              <a href="https://polinetwork.org">PoliNetwork</a> ❤️
            </div>
          </div>
        </div>
      </Page>
    )
  }
})