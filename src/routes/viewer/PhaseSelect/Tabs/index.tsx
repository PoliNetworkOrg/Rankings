import { PhaseSelectProps } from "..";
import GroupSelect from "./GroupSelect";
import RankingSelect from "./RankingSelect";

type Props = PhaseSelectProps & {
  showGroups: boolean;
};

export default function PhaseSelectTabs(props: Props) {
  return (
    <div className="flex flex-1 flex-wrap gap-4 overflow-x-hidden">
      {props.showGroups && <GroupSelect {...props} />}
      <RankingSelect {...props} />
    </div>
  );
}
