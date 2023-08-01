import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouterContext } from "@tanstack/router";
import { DATA_REF, LINKS } from "@/utils/constants";
import Data from "@/utils/data/data";

type Props = {
  currentRef: DATA_REF;
};
export default function SetDataRef({ currentRef }: Props) {
  const context = useRouterContext();

  function handleChangeRef(refStr: string): void {
    context.context.data = Data.init(refStr as DATA_REF);
    context.load();
  }
  return (
    <div className="flex items-center gap-4">
      <p>
        Sorgente data{" "}
        <a href={LINKS.dataRepoUrl} target="_blank" rel="noreferrer noopener">
          (repo)
        </a>
      </p>
      <Tabs value={currentRef} onValueChange={handleChangeRef}>
        <TabsList>
          <TabsTrigger className="block" value={DATA_REF.STABLE}>
            Stable
          </TabsTrigger>
          <TabsTrigger className="block" value={DATA_REF.MAIN}>
            Main
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
