import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhaseSelectProps } from "..";

export default function GroupSelect({
  phases,
  selectedGroup,
  onChange,
}: PhaseSelectProps) {
  function handleChange(value: string): void {
    const group = phases.groups.get(value);
    if (!group) return;

    onChange(group.phases[0], group);
  }

  return (
    selectedGroup && (
      <Tabs
        value={selectedGroup.value}
        onValueChange={handleChange}
        className="flex flex-1 overflow-x-hidden"
      >
        <TabsList className="flex overflow-x-hidden">
          {phases.groups.valuesArr().map((group) => (
            <TabsTrigger
              className="block"
              value={group.value}
              key={group.value}
            >
              {group.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    )
  );
}
