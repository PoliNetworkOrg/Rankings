import { useContext, useMemo, useState } from "react";
import MobileContext from "@/contexts/MobileContext";
import {
  PhaseGroup,
  PhaseLink,
  Phases,
} from "@/utils/types/data/parsed/Index/RankingFile";
import { NO_GROUP } from "@/utils/constants";
import GroupCombobox from "./Combobox/GroupCombobox";
import GroupTabs from "./Tabs/GroupTabs";
import RankingCombobox from "./Combobox/RankingCombobox";
import RankingTabs from "./Tabs/RankingTabs";
import { Removable } from "@/components/custom-ui/Removable";

export type PhaseSelectComboboxProps = PhaseSelectProps & {
  open: [boolean, boolean];
  setOpen: (group: boolean, ranking: boolean) => void;
};

export type PhaseSelectProps = {
  phases: Phases;
  selectedGroup: PhaseGroup;
  selectedPhase: PhaseLink;
  onChange: (link: PhaseLink, group: PhaseGroup) => void;
};

export default function PhaseSelect(props: PhaseSelectProps) {
  const { width } = useContext(MobileContext);
  const [open, setOpen] = useState<[boolean, boolean]>([false, false]);

  const handleSetOpen = (group: boolean, ranking: boolean) =>
    setOpen([group, ranking]);

  const comboboxProps = {
    ...props,
    open,
    setOpen: handleSetOpen,
  };

  const filteredPhases = props.selectedGroup.phases.filter(
    (a) => props.phases.all.findIndex((b) => a.href === b.href) !== -1,
  );

  const isCombobox = useMemo(
    () => width < Math.max(768, 190 * filteredPhases.length),
    [filteredPhases.length, width],
  );

  const groups = props.phases.groups.valuesArr();
  const showGroups = !(groups.length === 1 && groups[0].value === NO_GROUP);

  return (
    <div className="flex w-full flex-wrap gap-4 max-sm:flex-col">
      {showGroups && (
        <div className="flex items-center space-x-4">
          <p className="text-muted-foreground text-sm">Fase</p>
          {groups.length >= 2 ? (
            isCombobox ? (
              <GroupCombobox {...comboboxProps} />
            ) : (
              <GroupTabs {...props} />
            )
          ) : (
            <Removable showRemove={false}>{groups[0].label}</Removable>
          )}
        </div>
      )}
      <div className="flex items-center space-x-4">
        <p className="text-muted-foreground text-sm">Graduatoria</p>
        {filteredPhases.length >= 2 ? (
          isCombobox ? (
            <RankingCombobox {...comboboxProps} />
          ) : (
            <RankingTabs {...props} />
          )
        ) : (
          <Removable showRemove={false}>{filteredPhases[0].name}</Removable>
        )}
      </div>
    </div>
  );
}
