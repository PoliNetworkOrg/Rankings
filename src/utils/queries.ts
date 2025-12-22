import { queryOptions } from "@tanstack/react-query"
import urlJoin from "url-join"
import { type DATA_SOURCE, LINKS } from "./constants"
import { NotFoundError } from "./errors"
import type { BySchoolYearIndex, NewRanking } from "./types/data/ranking"

export type DataSource = (typeof DATA_SOURCE)[keyof typeof DATA_SOURCE]
export function getDataUrl(path: string, opts: QueryFactoryOpts): string {
  const base =
    opts.source === "local"
      ? `http://localhost:${opts.port}`
      : urlJoin(LINKS.dataRepoUrlRaw, `/refs/heads/${opts.ref}/data/`)
  return urlJoin(base, path)
}

type QueryFactoryOpts =
  | {
      source: typeof DATA_SOURCE.github
      ref: string
    }
  | {
      source: typeof DATA_SOURCE.local
      port: number
    }

const defaultQueryKeys = (opts: QueryFactoryOpts) => [
  opts.source,
  opts.source === "github" ? opts.ref : opts.port,
]

export const queryFactory = (opts: QueryFactoryOpts) => ({
  index: queryOptions({
    queryKey: ["index", ...defaultQueryKeys(opts)],
    queryFn: async () => {
      const res = await fetch(
        getDataUrl("/output/indexes/bySchoolYear.json", opts)
      )
      return res.json() as Promise<BySchoolYearIndex>
    },
    retry: 2,
    retryDelay: 300,
  }),

  ranking: (id: string) =>
    queryOptions({
      queryKey: ["ranking", id, ...defaultQueryKeys(opts)],
      queryFn: async () => {
        const res = await fetch(getDataUrl(`/output/rankings/${id}.json`, opts))
        // const res = await fetch(getDataUrl(`/output/rankings/${id}.json`))
        if (res.status === 404) throw new NotFoundError()
        return res.json() as Promise<NewRanking>
      },
      retry: 2,
      retryDelay: 300,
    }),
})
