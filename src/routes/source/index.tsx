import { Route } from "@tanstack/router"
import type { IconType } from "react-icons"
import { LuDatabase, LuGlobe, LuSettings } from "react-icons/lu"
import Page from "@/components/custom-ui/Page"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LINKS } from "@/utils/constants"
import { rootRoute } from "../root"

type Source = {
  name: string
  link: string
  desc: string
  icon?: IconType
}

const sources: Source[] = [
  {
    name: "Web",
    link: LINKS.githubSource.web,
    desc: "Questa web-app",
    icon: LuGlobe,
  },
  {
    name: "Script",
    link: LINKS.githubSource.script,
    desc: "Script che scarica i dati dal Politecnico e li trasforma in json",
    icon: LuSettings,
  },
  {
    name: "Dati",
    link: LINKS.githubSource.dati,
    desc: "Contiene i dati originali e l'output dello script",
    icon: LuDatabase,
  },
]

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
                    <TableHead>Repo</TableHead>
                    <TableHead>Descrizione</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sources.map((source) => (
                    <TableRow key={source.name}>
                      <TableCell className="pr-4">
                        <a
                          target="_blank"
                          rel="noreferrer noopener"
                          href={source.link}
                          className="flex items-center text-sm"
                        >
                          {source.icon && (
                            <source.icon className="mr-1" size={16} />
                          )}
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
    )
  },
})
