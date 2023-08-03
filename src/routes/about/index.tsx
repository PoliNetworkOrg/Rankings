import { Route } from "@tanstack/router";
import Page from "@/components/custom-ui/Page";
import { rootRoute } from "../root";

export const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "about",
  component: function About() {
    return (
      <Page>
        <div className="flex flex-col gap-8 p-8 text-justify">
          <h2 className="text-center text-lg font-bold">About</h2>
          <div>
            <p>
              Il seguente progetto mira a conservare lo storico delle
              graduatorie d'ammissione al Politecnico di Milano.
            </p>
            <p className="my-1">
              Propone una visualizzazione graficamente migliore, responsive,
              sviluppata dal nostro team di design.
            </p>
          </div>

          <div>
            <h3>Partecipanti e collaboratori:</h3>
            <ul className="flex list-disc flex-col gap-1 py-1 pl-4">
              <li>
                Lorenzo Corallo, Developer,{" "}
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://t.me/lorenzocorallo"
                >
                  Telegram
                </a>
              </li>
              <li>
                Giovanni Malusa, Designer,{" "}
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://t.me/giovannimalausa"
                >
                  Telegram
                </a>
              </li>
            </ul>
          </div>

          <div>
            Sei interessato a contribuire allo sviluppo dei progetti del network
            e/o conoscere di più la nostra realtà?{" "}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://polinetwork.org/learnmore/contacts/"
            >
              Contattaci!
            </a>
          </div>

          <div className="text-right">
            Sviluppato con amore da{" "}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://polinetwork.org"
            >
              PoliNetwork
            </a>{" "}
            ❤️
          </div>
        </div>
      </Page>
    );
  },
});
