import { Removable } from "@/components/custom-ui/Removable";
import RankingCombobox, { RankingComboboxProps } from "./Combobox";
import RankingTabs, { RankingTabsProps } from "./Tabs";

type ChildProps = RankingTabsProps & RankingComboboxProps;
export type RankingSelectProps = ChildProps & {
  isCombobox: boolean;
};

export default function RankingSelect(props: RankingSelectProps) {
  const { phases, isCombobox, rankingOpen, selectedPhase, onChange } = props;
  return (
    <div className="flex items-center space-x-4">
      <p className="text-muted-foreground text-sm">Graduatoria</p>
      {phases.length >= 2 ? (
        isCombobox ? (
          <RankingCombobox
            phases={phases}
            selectedPhase={selectedPhase}
            onChange={onChange}
            rankingOpen={rankingOpen}
          />
        ) : (
          <RankingTabs
            phases={phases}
            selectedPhase={selectedPhase}
            onChange={onChange}
          />
        )
      ) : (
        <Removable showRemove={false}>{selectedPhase.name}</Removable>
      )}
    </div>
  );
}
