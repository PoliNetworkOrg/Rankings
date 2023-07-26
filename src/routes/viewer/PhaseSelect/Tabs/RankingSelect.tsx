import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhaseSelectProps } from "..";

export default function RankingSelect({
  selectedPhase,
  selectedGroup,
  onChange,
  phases,
}: PhaseSelectProps) {
  function handleChange(value: string): void {
    const phase = phases.all.find((p) => p.href === value);
    if (!phase) return;

    const group = phases.groups.get(phase.group.value) ?? selectedGroup;
    onChange(phase, group ?? selectedGroup);
  }

  const filteredPhases = selectedGroup.phases.filter(
    (a) => phases.all.findIndex((b) => a.href === b.href) !== -1,
  );
  return (
    <Tabs
      value={selectedPhase.href}
      onValueChange={handleChange}
      className="flex flex-1"
    >
      <div className="flex flex-1 items-center space-x-4 overflow-x-hidden">
        <p className="text-muted-foreground text-sm">Graduatoria</p>
        <TabsList className="flex overflow-x-hidden">
          {filteredPhases.map((phase) => (
            <TabsTrigger
              className={`block ${
                phase.href === selectedPhase.href ? "" : "truncate"
              }`}
              value={phase.href}
              key={phase.href}
            >
              {phase.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
