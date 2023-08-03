import { Route } from "@tanstack/router";
import Page from "@/components/custom-ui/Page";
import { rootRoute } from "../root";
import { LINKS } from "@/utils/constants";

export const sourceRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "source",
  component: function About() {
    return (
      <Page>
        <div className="flex flex-col gap-8 p-8 text-justify">
          <h2 className="text-center text-lg font-bold">Source</h2>
          <div>
            <p>Il codice è suddiviso in tre repository:</p>
            <ul className="flex list-disc flex-col gap-1 py-1 pl-4">
              <li>
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href={LINKS.githubSource.web}
                >
                  Rankings
                </a>
                : questa web-app
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href={LINKS.githubSource.script}
                >
                  GraduatorieScriptCSharp
                </a>
                : script che scarica i dati dal Politecnico e li trasforma in
                json
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href={LINKS.githubSource.dati}
                >
                  RankingsDati
                </a>
                : contiene i dati originali e l'output dello script
              </li>
            </ul>
          </div>
        </div>
      </Page>
    );
  },
});
