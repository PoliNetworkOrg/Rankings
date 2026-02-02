import { useState } from "react"
import { LuSettings2, LuX } from "react-icons/lu"
import Page from "../custom-ui/Page"
import { Button } from "../ui/button"
import DataSummary from "./DataSummary"
import Section from "./Section"
import Settings from "./settings"

export default function DevSettings() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className={`fixed top-0 left-0 flex h-screen w-full bg-white dark:bg-slate-900 ${
          open ? "" : "hidden"
        }`}
      >
        <Page className="gap-4" paddingTop={false}>
          <div className="flex w-full items-center justify-between border-slate-600 border-b py-4">
            <h3 className="font-bold text-2xl">Dev Settings</h3>
          </div>

          <div className="scrollbar-thin flex h-full max-h-full w-full flex-col gap-4 overflow-y-scroll pr-2 pb-12">
            <Section title="WebApp Info" showHr={false}>
              <p>Version: {APP_VERSION}</p>
            </Section>

            <Section title="Data info">
              <DataSummary
              // stable={stableData} main={mainData}
              />
            </Section>

            <Settings
            // data={stableData}
            />
          </div>
        </Page>
      </div>

      <Button
        onClick={() => setOpen((v) => !v)}
        variant="outline"
        size="icon"
        className="-translate-x-1/2 absolute top-4 left-1/2 z-20"
      >
        {open ? <LuX /> : <LuSettings2 />}
      </Button>
    </>
  )
}
