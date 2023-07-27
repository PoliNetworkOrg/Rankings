import { PhaseSelectProps } from "..";
import GroupSelect from "./GroupSelect";
import RankingSelect from "./RankingSelect";

type showGroupsBool = {
  showGroups: boolean;
};

type Props = PhaseSelectProps & showGroupsBool;

export default function PhaseSelectTabs(props: Props) {
  return (
    <div className="flex flex-1 flex-wrap gap-8 overflow-x-hidden">
      {props.showGroups && <GroupSelect {...props} />}
      <RankingSelect {...props} />
    </div>
  );
}
