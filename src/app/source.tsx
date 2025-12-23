import { createFileRoute } from "@tanstack/react-router"

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

export const Route = createFileRoute("/source")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Page className="items-center">
      <div className="flex flex-col gap-8 p-8 text-justify">
        <h2 className="text-center font-bold text-lg">Source</h2>
        <div>
          <p>Il codice è suddiviso in più repository:</p>
          <div className="my-4 rounded-md border border-slate-300 **:border-slate-300 dark:border-slate-700 **:dark:border-slate-700">
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
}
