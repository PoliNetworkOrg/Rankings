import { useContext, useMemo, useState } from "react";
import MobileContext from "@/contexts/MobileContext";
import {
  PhaseGroup,
  PhaseLink,
  Phases,
} from "@/utils/types/data/parsed/Index/RankingFile";
import { NO_GROUP } from "@/utils/constants";
import { State } from "@/utils/types/state";
import RankingSelect from "./RankingSelect";
import GroupSelect from "./GroupSelect";

export type GroupSelectProps = {
  groups: PhaseGroup[];
  groupOpen: State<boolean>;
  selectedGroup: PhaseGroup;
  onChange: (group: PhaseGroup) => void;
};

type Props = {
  phases: Phases;
  selectedGroup: PhaseGroup;
  selectedPhase: PhaseLink;
  onChange: (link: PhaseLink, group: PhaseGroup) => void;
};

export default function PhaseSelect(props: Props) {
  const { phases, selectedGroup, selectedPhase, onChange } = props;
  const { width } = useContext(MobileContext);
  const groupOpen = useState<boolean>(false);
  const rankingOpen = useState<boolean>(false);

  const filteredPhases = selectedGroup.phases.filter(
    (a) => phases.all.findIndex((b) => a.href === b.href) !== -1,
  );

  const isCombobox = useMemo(
    () => width < Math.max(768, 190 * filteredPhases.length),
    [filteredPhases.length, width],
  );

  const groups = phases.groups.valuesArr();
  const showGroups = !(
    groups.length === 0 ||
    (groups.length === 1 && groups[0].value === NO_GROUP)
  );

  function handleOnGroupChange(group: PhaseGroup): void {
    const firstPhase = group.phases[0];
    onChange(firstPhase, group);
  }

  function handleOnRankingChange(link: PhaseLink): void {
    const group = phases.groups.get(link.group.value);
    if (!group) return;

    onChange(link, group);
  }

  return (
    <div className="flex w-full flex-wrap gap-4 max-sm:flex-col">
      {showGroups && (
        <GroupSelect
          isCombobox={isCombobox}
          groupOpen={groupOpen}
          onChange={handleOnGroupChange}
          selectedGroup={selectedGroup}
          groups={phases.groups}
        />
      )}
      <RankingSelect
        isCombobox={isCombobox}
        rankingOpen={rankingOpen}
        onChange={handleOnRankingChange}
        selectedPhase={selectedPhase}
        phases={filteredPhases}
      />
    </div>
  );
}
