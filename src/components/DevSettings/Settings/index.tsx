import Data from "@/utils/data/data";
import Section from "../Section";
import SetDataRef from "./SetDataRef";
import { RouterContext } from "@/router";

type Props = {
  routerContext: RouterContext;
  data: Data;
};

export default function Settings({ data, routerContext }: Props) {
  return (
    <Section title="Settings">
      <SetDataRef currentRef={data.ref} routerContext={routerContext} />
    </Section>
  );
}
