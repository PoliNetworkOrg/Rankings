import Page from "../components/ui/Page"

export default function About() {
  return (
    <Page>
      <div style={{ padding: 20 }}>
        <div style={{ textAlign: "justify" }}>
          <div style={{ padding: 10 }}></div>
          <div style={{ textAlign: "center" }}>
            <h1><b>About</b></h1>
          </div>
          <div style={{ padding: 20 }}></div>
          <div>
            Il seguente progetto mira a conservare lo storico delle graduatorie
            d'ammissione al Politecnico di Milano. Propone una visualizzazione
            graficamente migliore, responsive, sviluppata dal nostro team di
            design.
          </div>

          <div style={{ padding: 10 }}> </div>
          <div>Partecipanti e collaboratori:</div>
          <ul style={{ listStyle: "unset" }}>
            <li style={{ marginLeft: 20 }}>
              Lorenzo Corallo, Developer,{" "}
              <a href="https://t.me/lorenzocorallo">Telegram</a>
            </li>
            <li style={{ marginLeft: 20 }}>
              Giovanni Malusa, Designer,{" "}
              <a href="https://t.me/giovannimalausa">Telegram</a>
            </li>
          </ul>

          <div style={{ padding: 20 }}></div>
          <div>
            Sei interessato a contribuire allo sviluppo dei progetti del network
            e/o conoscere di più la nostra realtà?{" "}
            <a href="https://polinetwork.org/learnmore/contacts/">
              Contattaci!
            </a>
          </div>

          <div style={{ padding: 15 }}> </div>
          <div style={{ textAlign: "right" }}>
            Sviluppato con amore da PoliNetwork ❤️
          </div>
        </div>
      </div>
    </Page>
  )
}
