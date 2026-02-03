import { createFileRoute } from "@tanstack/react-router"
import { FaTelegram } from "react-icons/fa"
import Page from "@/components/custom-ui/Page"
import { CREDITS, LINKS } from "@/utils/constants"

export const Route = createFileRoute("/about")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Page className="items-center">
      <div className="flex flex-col gap-8 p-8 text-justify">
        <h2 className="text-center font-bold text-lg">About</h2>
        <div className="space-y-1">
          <p>
            Il seguente progetto mira a conservare lo storico delle graduatorie
            d'ammissione al Politecnico di Milano.
          </p>
          <p>
            Propone una visualizzazione graficamente migliore, responsive,
            sviluppata dal nostro team di design.
          </p>
        </div>

        <div className="space-y-2">
          <h3>Partecipanti e collaboratori:</h3>
          <ul className="flex list-disc flex-col gap-1 py-1 pl-4">
            {CREDITS.map((credit) => (
              <li key={credit.name}>
                <p className="flex items-center justify-start">
                  {credit.name}
                  {credit.role && (
                    <span className="text-slate-700 dark:text-slate-400 font-light">
                      &nbsp;{credit.role}
                    </span>
                  )}
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
          <p className="text-xs italic text-slate-700 dark:text-slate-400">
            Per Content si intendono contributori che hanno fornito graduatorie
            mancanti (con link originali o dati grezzi) o altri dati da
            visualizzare.
          </p>
        </div>

        <div className="space-y-1">
          <p>
            Per segnalare eventuali bug o problemi del sito, utilizza la{" "}
            <a target="_blank" rel="noreferrer noopener" href={LINKS.issuesUrl}>
              sezione Issues della nostra repository
            </a>
            .
          </p>

          <p>
            Sei interessato a contribuire allo sviluppo dei progetti del network
            e/o conoscere di più la nostra realtà?{" "}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://polinetwork.org/learnmore/contacts/"
            >
              Contattaci!
            </a>
          </p>
        </div>

        <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start">
          <p className="text-slate-800 dark:text-slate-300">
            Versione: {APP_VERSION}
          </p>
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
  )
}
