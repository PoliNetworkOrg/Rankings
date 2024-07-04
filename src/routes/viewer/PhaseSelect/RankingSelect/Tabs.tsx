import PhaseFlag from "@/components/custom-ui/PhaseFlag";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhaseLink } from "@/utils/types/data/parsed/Index/RankingFile";

export type RankingTabsProps = {
  phases: PhaseLink[];
  selectedPhase: PhaseLink;
  onChange: (link: PhaseLink) => void;
};

export default function RankingTabs({
  selectedPhase,
  phases,
  onChange,
}: RankingTabsProps) {
  function handleChange(value: string): void {
    const phase = phases.find((p) => p.href === value);
    if (!phase) return;

    onChange(phase);
  }

  return (
    <Tabs
      value={selectedPhase.href}
      onValueChange={handleChange}
      className="flex flex-1"
    >
      <TabsList className="flex overflow-x-hidden">
        {phases.map((phase) => (
          <TabsTrigger
            className={`block ${
              phase.href === selectedPhase.href ? "" : "truncate"
            }`}
            value={phase.href}
            key={phase.href}
          >
            {phase.name} <PhaseFlag phase={phase} />
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
