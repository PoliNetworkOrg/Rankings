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
import LangSelect, { Lang } from "./LangSelect";

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

  const [selectedLang, setSelectedLang] = useState<Lang>(
    selectedPhase.order.isEnglish ? "ENG" : "ITA",
  );

  const showLangs =
    phases.all.filter((p) => p.order.isEnglish).length > 0 &&
    phases.all.filter((p) => !p.order.isEnglish).length > 0;

  const filteredPhases = useMemo(
    () =>
      selectedGroup.phases
        .filter((a) => phases.all.findIndex((b) => a.href === b.href) !== -1)
        .filter(
          (a) => !showLangs || a.order.isEnglish === (selectedLang === "ENG"),
        ),
    [phases.all, selectedGroup.phases, selectedLang, showLangs],
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

  function handleOnLangChange(newLang: Lang): void {
    setSelectedLang(newLang);

    const filteredUpdated = phases.all.filter(
      (p) => p.order.isEnglish === (newLang === "ENG"),
    );
    if (filteredUpdated.length === 0) return;

    const firstValidPhase = filteredUpdated[0];
    const group = phases.groups.get(firstValidPhase.group.value);
    if (!group) return;

    onChange(firstValidPhase, group);
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
      <LangSelect
        canChoose={showLangs}
        selectedLang={selectedLang}
        onChange={handleOnLangChange}
      />
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
