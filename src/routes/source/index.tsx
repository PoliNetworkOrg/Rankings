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
            <br />
            <br />
            <center>
              <table className="m-10 border p-10">
                <tr>
                  <td className="flex-col gap-8 pl-8 pr-8 font-bold">&nbsp;</td>
                  <td className="flex-col gap-8 pl-8 pr-8 font-bold">&nbsp;</td>
                </tr>
                <tr>
                  <td className="flex-col gap-8 pl-8 pr-8 font-bold">
                    {" "}
                    <center>Nome</center>
                  </td>
                  <td className="flex-col gap-8 pl-8 pr-8 font-bold">
                    <center> Descrizione</center>
                  </td>
                </tr>
                <tr>
                  <td className="flex-col gap-8 pl-8 pr-8 font-bold">&nbsp;</td>
                  <td className="flex-col gap-8 pl-8 pr-8 font-bold">&nbsp;</td>
                </tr>
                <tr>
                  <td>
                    <a
                      target="_blank"
                      rel="noreferrer noopener"
                      href={LINKS.githubSource.web}
                    >
                      <span className="flex-col gap-8 pl-8 pr-8">
                        {" "}
                        <center> Rankings</center>
                      </span>
                    </a>
                  </td>
                  <td>
                    <span className="flex-col gap-8 pl-8 pr-8">
                      <center> Questa web-app</center>
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>
                    <a
                      target="_blank"
                      rel="noreferrer noopener"
                      href={LINKS.githubSource.script}
                    >
                      <span className="flex-col gap-8 pl-8 pr-8">
                        <center>
                          &nbsp;&nbsp;&nbsp;GraduatorieScriptCSharp
                          &nbsp;&nbsp;&nbsp;
                        </center>
                      </span>
                    </a>
                  </td>
                  <td>
                    <span className="flex-col gap-8 pl-8 pr-8">
                      <center>
                        &nbsp;&nbsp;&nbsp; Script che scarica i dati dal
                        Politecnico e li trasforma in json&nbsp;&nbsp;&nbsp;
                      </center>
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>
                    <a
                      target="_blank"
                      rel="noreferrer noopener"
                      href={LINKS.githubSource.dati}
                    >
                      <span className="flex-col gap-8 pl-8 pr-8">
                        <center> RankingsDati</center>
                      </span>
                    </a>
                  </td>
                  <td>
                    <span className="flex-col gap-8 pl-8 pr-8">
                      <center>
                        {" "}
                        Contiene i dati originali e l'output dello script
                      </center>
                    </span>
                  </td>
                </tr>
              </table>
            </center>
          </div>
        </div>
      </Page>
    );
  },
});
