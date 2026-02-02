import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { Suspense, useEffect, useState } from "react"
import { LuInfo, LuLock, LuShieldCheck } from "react-icons/lu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useQueries } from "@/hooks/use-queries"
import { LOCAL_STORAGE } from "@/utils/constants"
import { sha256 } from "@/utils/strings/crypto"
import type { IndexEntry } from "@/utils/types/data/ranking"
import type { School } from "@/utils/types/data/school"
import { Removable } from "../custom-ui/Removable"
import { RankingInfo } from "../PathBreadcrumb"
import { Badge } from "../ui/badge"

type SchoolYearKey = `${School}-${number}`
type GroupedResults = Map<
  SchoolYearKey,
  { school: School; year: number; entries: IndexEntry[] }
>

function groupResults(entries: IndexEntry[]): GroupedResults {
  const grouped: GroupedResults = new Map()
  for (const entry of entries) {
    const key: SchoolYearKey = `${entry.school}-${entry.year}`
    if (!grouped.has(key)) {
      grouped.set(key, { school: entry.school, year: entry.year, entries: [] })
    }
    grouped.get(key)?.entries.push(entry)
  }
  return grouped
}

function getResults(
  rankingIds: string[] | null,
  bySchoolYearIndex: Record<string, Record<string, IndexEntry[]>> | undefined
): GroupedResults | null {
  if (!rankingIds || !bySchoolYearIndex) return null

  const entries: IndexEntry[] = []
  for (const schoolData of Object.values(bySchoolYearIndex)) {
    for (const yearEntries of Object.values(schoolData)) {
      for (const entry of yearEntries) {
        if (rankingIds.includes(entry.id)) {
          entries.push(entry)
        }
      }
    }
  }

  return groupResults(entries)
}

function getTotalCount(results: GroupedResults | null): number {
  if (!results) return 0
  let count = 0
  for (const group of results.values()) {
    count += group.entries.length
  }
  return count
}

function getSortedGroups(results: GroupedResults | null) {
  if (!results) return []
  return [...results.values()].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year
    return a.school.localeCompare(b.school)
  })
}

export function StudentIdSearch({ currentId }: { currentId: string | null }) {
  const [studentId, setStudentId] = useState("")
  const [prevCurrentId, setPrevCurrentId] = useState<string | null>(null)
  const [submittedId, setSubmittedId] = useState<string | null>(null)

  const queries = useQueries()
  const { data: studentIdIndex, isLoading: isLoadingIdIndex } = useQuery(
    queries.idHashIndex
  )
  const { data: bySchoolYearIndex, isLoading: isLoadingIndex } = useQuery(
    queries.index
  )

  const isLoading = isLoadingIdIndex || isLoadingIndex
  const rankingIds =
    submittedId && studentIdIndex ? (studentIdIndex[submittedId] ?? null) : null
  const results = getResults(rankingIds, bySchoolYearIndex)
  const totalCount = getTotalCount(results)
  const sortedGroups = getSortedGroups(results)
  const isValidFormat = studentId.length >= 6

  const handleSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()

    if (isValidFormat && studentId) {
      const hash = await sha256(studentId)
      setSubmittedId(hash.slice(0, 20))
    }
  }

  const clear = async () => {
    setSubmittedId(null)
    setStudentId("")
    localStorage.removeItem(LOCAL_STORAGE.searchedStudentId)
  }

  useEffect(() => {
    if (studentIdIndex && submittedId !== null) {
      if (studentIdIndex[submittedId])
        localStorage.setItem(LOCAL_STORAGE.searchedStudentId, studentId)
      else localStorage.removeItem(LOCAL_STORAGE.searchedStudentId)
    }
  }, [studentIdIndex, submittedId, studentId])

  useEffect(() => {
    if (
      currentId !== null &&
      currentId !== prevCurrentId &&
      currentId.length >= 6
    ) {
      setStudentId(currentId)
      void sha256(currentId).then((v) => setSubmittedId(v.slice(0, 20)))
      setPrevCurrentId(currentId)
    }
  }, [currentId, prevCurrentId])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-50 via-white to-teal-50 p-6 dark:border-emerald-900/50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-teal-950/30">
      <div className="-top-12 -right-12 absolute h-32 w-32 rounded-full bg-emerald-200/30 blur-2xl dark:bg-emerald-500/10" />
      <div className="-bottom-8 -left-8 absolute h-24 w-24 rounded-full bg-teal-200/30 blur-2xl dark:bg-teal-500/10" />

      <div className="relative space-y-4">
        <div>
          <h3 className="font-semibold text-slate-800 text-xl dark:text-slate-200">
            🔍 Ricerca per matricola
          </h3>
          <p className="mt-2 text-slate-600 text-sm dark:text-slate-400">
            Inserisci il tuo numero di matricola per cercarlo nelle graduatorie
            archiviate
          </p>
        </div>

        <div className="flex items-center justify-start gap-2">
          {!submittedId || !totalCount ? (
            <form
              onSubmit={handleSearch}
              className="flex w-full items-center justify-start gap-2"
            >
              <Input
                type="text"
                aria-label="Numero matricola"
                placeholder="Numero matricola"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={!isValidFormat || !studentId || isLoading}
              >
                {isLoading ? "Caricamento..." : "Mostra risultati"}
              </Button>
            </form>
          ) : (
            <Removable onRemove={clear}>{studentId}</Removable>
          )}
        </div>

        {results && totalCount > 0 && (
          <div className="space-y-3">
            <p className="font-medium text-slate-700 text-sm dark:text-slate-300">
              Trovato in {totalCount} graduatori{totalCount === 1 ? "a" : "e"}:
            </p>
            {sortedGroups.map((group) => (
              <SchoolYearGroup
                key={`${group.school}-${group.year}`}
                school={group.school}
                year={group.year}
                entries={group.entries}
              />
            ))}
          </div>
        )}

        {submittedId && studentIdIndex && totalCount === 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="text-amber-700 text-sm dark:text-amber-300">
              Nessuna graduatoria trovata per questa matricola
            </p>
          </div>
        )}

        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-slate-500 text-xs dark:text-slate-500">
            <LuInfo className="shrink-0" size={14} />
            <span>Formato richiesto: AB1234</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs dark:text-slate-500">
            <LuLock className="shrink-0" size={14} />
            <span>Non condividere il tuo numero di matricola con altri</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs dark:text-slate-500">
            <LuShieldCheck className="shrink-0" size={14} />
            <span>
              I numeri di matricola sono anonimizzati tramite hash nel nostro
              archivio
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SchoolYearGroup({
  school,
  year,
  entries,
}: {
  school: School
  year: number
  entries: IndexEntry[]
}) {
  const sortedEntries = [...entries].sort((a, b) => {
    if (a.phase.language !== b.phase.language)
      return a.phase.language.localeCompare(b.phase.language)
    if (a.phase.primary !== b.phase.primary)
      return a.phase.primary - b.phase.primary
    if (a.phase.secondary !== b.phase.secondary)
      return a.phase.secondary - b.phase.secondary
    return (a.phase.isExtraEu ? 1 : 0) - (b.phase.isExtraEu ? 1 : 0)
  })

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
        <span>{school}</span>
        <span className="text-slate-500 dark:text-slate-400">•</span>
        <span>{year}</span>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
        {sortedEntries.map((entry) => (
          <Link
            key={entry.id}
            to="/$school/$year/$id"
            params={{ school, year, id: entry.id }}
            className="flex flex-wrap items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-slate-50 hover:no-underline dark:hover:bg-slate-800/50"
          >
            <Suspense
              fallback={
                <Badge variant="secondary" className="h-8 w-20 animate-pulse" />
              }
            >
              <RankingInfo extended id={entry.id} />
            </Suspense>
          </Link>
        ))}
      </div>
    </div>
  )
}
