import { useState } from "react"
import { LuSettings2, LuX } from "react-icons/lu"
import type Data from "@/utils/data/data"
import Page from "../custom-ui/Page"
import { Button } from "../ui/button"
import DataSummary from "./DataSummary"
import Section from "./Section"
import Settings from "./Settings"

export default function DevSettings({
  stableData,
  mainData,
}: {
  stableData: Data
  mainData: Data
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className={`fixed left-0 top-0 flex h-screen w-full bg-white dark:bg-slate-950 ${
          open ? "" : "hidden"
        }`}
      >
        <Page className="gap-4" paddingTop={false}>
          <div className="flex w-full items-center justify-between border-b border-slate-600 py-4">
            <h3 className="text-2xl font-bold">Dev Settings</h3>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              <LuX />
            </Button>
          </div>

          <div className="flex h-full max-h-full w-full flex-col gap-4 overflow-y-scroll pb-12 pr-2 scrollbar-thin">
            <Section title="WebApp Info" showHr={false}>
              <p>Version: {APP_VERSION}</p>
            </Section>

            <Section title="Data info">
              <DataSummary stable={stableData} main={mainData} />
            </Section>

            <Settings data={stableData} />
          </div>
        </Page>
      </div>

      {!open && (
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          size="icon"
          className="absolute right-0 top-0 m-2"
        >
          <LuSettings2 />
        </Button>
      )}
    </>
  )
}
