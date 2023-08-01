import Data from "@/utils/data/data";
import Section from "../Section";
import SetDataRef from "./SetDataRef";

type Props = {
  data: Data;
};

export default function Settings({ data }: Props) {
  return (
    <Section title="Settings">
      <SetDataRef currentRef={data.ref} />
    </Section>
  );
}
