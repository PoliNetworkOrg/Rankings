import { PhaseSelectProps } from "..";
import GroupSelect from "./GroupSelect";
import RankingSelect from "./RankingSelect";

type setOpenType = (group: boolean, ranking: boolean) => void;

type openType = [boolean, boolean];

type comboboxProps = {
  open: openType;
  setOpen: setOpenType;
  showGroups: boolean;
};

export type PhaseSelectComboboxProps = PhaseSelectProps & comboboxProps;

export default function PhaseSelectCombobox(props: PhaseSelectComboboxProps) {
  return (
    <div className="flex flex-col items-start gap-4">
      {props.showGroups && <GroupSelect {...props} />}
      <RankingSelect {...props} />
    </div>
  );
}
