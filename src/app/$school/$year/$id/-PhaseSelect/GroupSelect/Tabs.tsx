import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type {
  PhaseGroup,
  PhaseGroups,
} from "@/utils/types/data/parsed/Index/RankingFile"

export type GroupTabsProps = {
  groups: PhaseGroups
  selectedGroup: PhaseGroup
  onChange: (group: PhaseGroup) => void
}

export default function GroupTabs({
  groups,
  selectedGroup,
  onChange,
}: GroupTabsProps) {
  function handleChange(value: string): void {
    const group = groups.get(value)
    if (!group) return

    onChange(group)
  }

  return (
    <Tabs
      value={selectedGroup.value}
      onValueChange={handleChange}
      className="flex flex-1 overflow-x-hidden"
    >
      <TabsList className="flex overflow-x-hidden">
        {groups.valuesArr().map((group) => (
          <TabsTrigger className="block" value={group.value} key={group.value}>
            {group.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
