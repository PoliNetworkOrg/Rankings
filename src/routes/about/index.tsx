import { Route } from "@tanstack/router";
import Page from "@/components/custom-ui/Page";
import { rootRoute } from "../root";
import { CREDITS } from "@/utils/constants";
import { FaTelegram } from "react-icons/fa";

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
              {CREDITS.map((credit) => (
                <li key={credit.name}>
                  <p className="flex items-center justify-start">
                    {credit.name}
                    {credit.role && <span>&nbsp;({credit.role})</span>}
                    {credit.tgLink && (
                      <>
                        &nbsp;
                        <a
                          target="_blank"
                          rel="noreferrer noopener"
                          href={credit.tgLink}
                          className="inline-block"
                        >
                          <FaTelegram size={16} />
                        </a>
                      </>
                    )}
                  </p>
                </li>
              ))}
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

          <div className="flex items-center justify-between">
            <p className="opacity-60">Versione: {APP_VERSION}</p>
            <p>
              Sviluppato con amore da{" "}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://polinetwork.org"
              >
                PoliNetwork
              </a>{" "}
              ❤️
            </p>
          </div>
        </div>
      </Page>
    );
  },
});
