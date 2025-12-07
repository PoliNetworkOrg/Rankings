import { Removable } from "@/components/custom-ui/Removable"
import GroupCombobox, { type GroupComboboxProps } from "./Combobox"
import GroupTabs, { type GroupTabsProps } from "./Tabs"

type ChildProps = GroupTabsProps & GroupComboboxProps
export type GroupSelectProps = ChildProps & {
  isCombobox: boolean
}

export default function GroupSelect(props: GroupSelectProps) {
  const { groups, isCombobox, selectedGroup, groupOpen, onChange } = props
  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm">Fase</p>
      {groups.size >= 2 ? (
        isCombobox ? (
          <GroupCombobox
            onChange={onChange}
            groupOpen={groupOpen}
            selectedGroup={selectedGroup}
            groups={groups}
          />
        ) : (
          <GroupTabs
            onChange={onChange}
            selectedGroup={selectedGroup}
            groups={groups}
          />
        )
      ) : (
        <Removable showRemove={false}>{selectedGroup.label}</Removable>
      )}
    </div>
  )
}
