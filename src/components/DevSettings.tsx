import { useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { DATA_REF, LINKS } from "@/utils/constants";
import Data from "@/utils/data/data";
import { useRouterContext } from "@tanstack/router";
import { LuSettings2, LuX } from "react-icons/lu";

export default function DevSettings({ data }: { data?: Data }) {
  const [open, setOpen] = useState(false);
  const context = useRouterContext();

  function handleChangeRef(refStr: string): void {
    context.context.data = Data.init(refStr as DATA_REF);
    context.load();
  }

  return (
    data && (
      <>
        <div
          className={`fixed left-0 top-0 flex h-screen w-full flex-col items-start justify-start gap-4 border-slate-600 bg-black/60 p-4 backdrop-blur ${
            open ? "border-t " : "hidden"
          }`}
        >
          <div className="flex w-full items-center justify-between">
            <h3 className="text-2xl font-bold">Dev Settings</h3>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              <LuX />
            </Button>
          </div>

          <hr className="w-full border-slate-600" />

          <Section title="WebApp Info">
            <p>Version: {APP_VERSION}</p>
          </Section>

          <hr className="w-full border-slate-600" />

          <Section title="Settings">
            <div className="flex items-center gap-4">
              <p>
                Sorgente data{" "}
                <a
                  href={LINKS.dataRepoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  (repo)
                </a>
              </p>
              <Tabs value={data.ref} onValueChange={handleChangeRef}>
                <TabsList>
                  <TabsTrigger className="block" value={DATA_REF.MAIN}>
                    Main
                  </TabsTrigger>
                  <TabsTrigger className="block" value={DATA_REF.STABLE}>
                    Stable
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </Section>
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
  );
}

type SectionProps = {
  title: string;
  children: React.ReactNode;
};
function Section({ title, children }: SectionProps) {
  return (
    <div className="flex flex-col items-start gap-2">
      <h4 className="text-lg font-bold">{title}</h4>
      {children}
    </div>
  );
}
