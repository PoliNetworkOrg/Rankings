import { PhaseSelectProps } from "..";
import GroupSelect from "./GroupSelect";
import RankingSelect from "./RankingSelect";

export type PhaseSelectComboboxProps = PhaseSelectProps & {
  open: [boolean, boolean];
  setOpen: (group: boolean, ranking: boolean) => void;
  showGroups: boolean;
};

export default function PhaseSelectCombobox(props: PhaseSelectComboboxProps) {
  return (
    <div className="flex flex-col items-start gap-4">
      {props.showGroups && <GroupSelect {...props} />}
      <RankingSelect {...props} />
    </div>
  );
}
