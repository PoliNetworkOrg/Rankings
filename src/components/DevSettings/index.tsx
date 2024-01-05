import { useState } from "react";
import { Button } from "../ui/button";
import Data from "@/utils/data/data";
import { LuSettings2, LuX } from "react-icons/lu";
import Page from "../custom-ui/Page";
import { DATA_REF } from "@/utils/constants";
import Section from "./Section";
import DataSummary from "./DataSummary";
import Settings from "./Settings";
import { RouterContext } from "@/router";

type LocalData = {
  main?: Data;
  stable?: Data;
};

export default function DevSettings({
  data,
  routerContext,
}: {
  data?: Data;
  routerContext: RouterContext;
}) {
  const [open, setOpen] = useState(false);
  const [{ stable, main }, setLocalData] = useState<LocalData>({});

  const mainData = Data.init(DATA_REF.MAIN);
  const stableData = Data.init(DATA_REF.STABLE);

  Promise.all([mainData, stableData]).then(([main, stable]) =>
    setLocalData({ main, stable }),
  );

  return (
    data && (
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
                {stable && main && <DataSummary stable={stable} main={main} />}
              </Section>

              <Settings routerContext={routerContext} data={data} />
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
  );
}
