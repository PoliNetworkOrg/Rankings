import { queryOptions } from "@tanstack/react-query"
import urlJoin from "url-join"
import type { SettingsState } from "@/stores/settings-store"
import { type DATA_SOURCE, LINKS } from "./constants"
import { FetchError, NotFoundError } from "./errors"
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
    queryKey: ["index-school-year", ...defaultQueryKeys(opts)],
    queryFn: async () => {
      const res = await fetch(
        getDataUrl("/output/indexes/bySchoolYear.json", opts)
      )
      return res.json() as Promise<BySchoolYearIndex>
    },
    retry: 2,
    retryDelay: 300,
    staleTime: 120_000,
  }),

  idHashIndex: queryOptions({
    queryKey: ["index-studentid", ...defaultQueryKeys(opts)],
    queryFn: async () => {
      const res = await fetch(
        getDataUrl("/output/indexes/byStudentIdHash.json", opts)
      )
      return res.json() as Promise<Record<string, string[]>>
    },
    retry: 2,
    retryDelay: 300,
    staleTime: 600_000,
  }),

  ranking: (id: string) =>
    queryOptions({
      queryKey: ["ranking", id, ...defaultQueryKeys(opts)],
      queryFn: async () => {
        const res = await fetch(getDataUrl(`/output/rankings/${id}.json`, opts))
        // const res = await fetch(getDataUrl(`/output/rankings/${id}.json`))
        if (res.status === 404) throw new NotFoundError()
        if (!res.ok) throw new FetchError()
        return res.json() as Promise<NewRanking>
      },
      retry: 2,
      retryDelay: 300,
      staleTime: 600_000,
    }),
})

export const getActiveQueries = (
  settings: Pick<SettingsState, "dataSource" | "ref" | "localPort">
) => {
  const { dataSource, ref, localPort } = settings

  return dataSource === "github"
    ? queryFactory({ source: dataSource, ref })
    : queryFactory({ source: "local", port: localPort })
}
