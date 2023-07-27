import { useContext, useMemo, useState } from "react";
import MobileContext from "@/contexts/MobileContext";
import {
  PhaseGroupLabelValueNum,
  PhaseLink,
  Phases,
} from "@/utils/types/data/parsed/Index/RankingFile";
import PhaseSelectCombobox from "./Combobox";
import PhaseSelectTabs from "./Tabs";
import { NO_GROUP } from "@/utils/constants";

type onChangeType = (link: PhaseLink, group: PhaseGroupLabelValueNum) => void;

export type PhaseSelectProps = {
  phases: Phases;
  selectedGroup: PhaseGroupLabelValueNum;
  selectedPhase: PhaseLink;
  onChange: onChangeType;
};

export default function PhaseSelect(props: PhaseSelectProps) {
  const { width } = useContext(MobileContext);
  const [open, setOpen] = useState<[boolean, boolean]>([false, false]);
  const isCombobox = useMemo(
    () => width < Math.max(768, 190 * props.phases.all.length),
    [props.phases.all.length, width],
  );

  const groups = props.phases.groups.valuesArr();
  const showGroups = !(groups.length === 1 && groups[0].value === NO_GROUP);

  const handleSetOpen = (group: boolean, ranking: boolean) =>
    setOpen([group, ranking]);

  return isCombobox
    ? PhaseSelectCombobox({
        ...props,
        open,
        setOpen: handleSetOpen,
        showGroups,
      })
    : PhaseSelectTabs({ ...props, showGroups });
}
