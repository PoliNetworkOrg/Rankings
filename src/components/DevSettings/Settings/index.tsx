// import type Data from "@/utils/data/data"
import { DATA_REF } from "@/utils/constants"
import Section from "../Section"
import SetDataRef from "./SetDataRef"

// type Props = {
//   data: Data
// }

export default function Settings() {
  return (
    <Section title="Settings">
      <SetDataRef currentRef={DATA_REF.STABLE} />
    </Section>
  )
}
