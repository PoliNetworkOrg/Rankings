import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { LuCheck, LuPencil, LuRefreshCw } from "react-icons/lu"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQueries } from "@/hooks/use-queries"
import { useSettingsStore } from "@/stores/settings-store"
import { DATA_SOURCE } from "@/utils/constants"
import type { DataSource } from "@/utils/queries"

export function SetDataSource() {
  const { localPort, ref, dataSource, setDataSource } = useSettingsStore()

  return (
    <div className="flex w-full items-center gap-10">
      <div className="flex items-center gap-3">
        <h3>Data Source</h3>
        <Tabs
          value={dataSource}
          onValueChange={(v) => setDataSource(v as DataSource)}
        >
          <TabsList>
            <TabsTrigger className="block" value={DATA_SOURCE.github}>
              GitHub
            </TabsTrigger>
            <TabsTrigger className="block" value={DATA_SOURCE.local}>
              Local
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {dataSource === "github" && (
        <div className="flex items-center gap-3">
          <p>Ref:</p>
          <ChangeRef initialRef={ref} />
        </div>
      )}
      {dataSource === "local" && (
        <div className="flex items-center gap-3">
          <p>Port:</p>
          <ChangePort initialPort={localPort} />
        </div>
      )}
      <Status />
    </div>
  )
}

function ChangeRef({ initialRef }: { initialRef: string }) {
  const [ref, setRef] = useState<string>(initialRef)
  const [open, setOpen] = useState<boolean>(false)

  const { setRef: updateRef } = useSettingsStore()

  function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    updateRef(ref)
    handleOpenChange(false)
  }

  function handleOpenChange(open: boolean) {
    setOpen(open)
    setRef(initialRef)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="flex gap-2">
          {initialRef} <LuPencil size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-70">
        <form onSubmit={handleUpdate} className="flex gap-2">
          <Input value={ref} onChange={(e) => setRef(e.target.value)} />
          <Button type="submit" variant="secondary">
            <LuCheck size={16} />
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}

function ChangePort({ initialPort }: { initialPort: number }) {
  const [port, setPort] = useState<number>(initialPort)
  const [open, setOpen] = useState<boolean>(false)
  const error = port < 1000 || port > 65535 || Number.isNaN(port)
  const { changeLocalPort } = useSettingsStore()

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.valueAsNumber
    setPort(value)
  }

  function handleSetDefault() {
    changeLocalPort(6767)
    handleOpenChange(false)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    handleUpdate()
  }

  function handleOpenChange(open: boolean) {
    setOpen(open)
    setPort(initialPort)
  }

  function handleUpdate() {
    if (error) toast.error("HTTP Port must be between 1000 and 65535")
    else {
      setOpen(false)
      changeLocalPort(port)
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="flex gap-2">
          {initialPort} <LuPencil size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={port}
            type="number"
            onChange={handleInputChange}
            className={
              error ? "border-red-500 text-red-500 dark:border-red-500" : ""
            }
          />
          <Button type="submit" variant="secondary">
            <LuCheck size={16} />
          </Button>
        </form>
        {initialPort !== 6767 && (
          <div className="mt-2 flex w-full items-center justify-center">
            <button
              className="text-xs underline opacity-50"
              type="button"
              onClick={handleSetDefault}
            >
              Default: 6767
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

function Status() {
  const q = useQueries()
  const query = useQuery(q.index)

  return (
    <div className="flex items-center gap-3">
      <p>Status:</p>
      <Badge
        className="min-w-28 justify-center self-stretch"
        variant={
          query.isFetching
            ? "secondary"
            : query.isSuccess
              ? "success"
              : "destructive"
        }
      >
        {query.isFetching
          ? "Fetching..."
          : query.isSuccess
            ? "Working"
            : "Unreachable"}
      </Badge>
      <Button
        onClick={() => query.refetch()}
        disabled={query.isFetching}
        variant="outline"
        size="icon"
      >
        <LuRefreshCw size={16} />
      </Button>
    </div>
  )
}
