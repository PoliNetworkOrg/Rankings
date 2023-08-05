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
    <div className="mr-2 flex flex-wrap gap-4 overflow-x-hidden">
      {selectedGroup && (
        <Tabs
          value={selectedGroup.value}
          onValueChange={handleChange}
          className="flex flex-1 overflow-x-hidden"
        >
          <div className="flex flex-1 items-center space-x-4 overflow-x-hidden">
            <p className="text-muted-foreground text-sm">Fase</p>
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
          </div>
        </Tabs>
      )}
    </div>
  );
}
