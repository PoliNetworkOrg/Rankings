import { Route } from "@tanstack/router";
import Page from "@/components/custom-ui/Page";
import { rootRoute } from "../root";
import { LINKS } from "@/utils/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Source = {
  name: string;
  link: string;
  desc: string;
};

const sources: Source[] = [
  {
    name: "Rankings",
    link: LINKS.githubSource.web,
    desc: "Questa web-app",
  },
  {
    name: "GraduatorieScriptCSharp",
    link: LINKS.githubSource.script,
    desc: "Script che scarica i dati dal Politecnico e li trasforma in json",
  },
  {
    name: "RankingsDati",
    link: LINKS.githubSource.dati,
    desc: "Contiene i dati originali e l'output dello script",
  },
];

export const sourceRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "source",
  component: function About() {
    return (
      <Page>
        <div className="flex flex-col gap-8 p-8 text-justify">
          <h2 className="text-center text-lg font-bold">Source</h2>
          <div>
            <p>Il codice è suddiviso in più repository:</p>
            <div className="my-4 rounded-md border border-slate-300 dark:border-slate-700 [&_*]:border-slate-300 [&_*]:dark:border-slate-700">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrizione</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sources.map((source) => (
                    <TableRow>
                      <TableCell className="pr-4">
                        <a
                          target="_blank"
                          rel="noreferrer noopener"
                          href={source.link}
                        >
                          {source.name}
                        </a>
                      </TableCell>
                      <TableCell>{source.desc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </Page>
    );
  },
});
