import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { State } from "@/utils/types/state";
import { PhaseLink } from "@/utils/types/data/parsed/Index/RankingFile";
import PhaseFlag from "@/components/custom-ui/PhaseFlag";

export type RankingComboboxProps = {
  rankingOpen: State<boolean>;
  phases: PhaseLink[];
  selectedPhase: PhaseLink;
  onChange: (link: PhaseLink) => void;
};

export default function RankingCombobox({
  rankingOpen,
  selectedPhase,
  onChange,
  phases,
}: RankingComboboxProps) {
  const [open, setOpen] = rankingOpen;
  function handleChange(value: string): void {
    setOpen(false);
    const phase = phases.find((p) => p.href === value);
    if (!phase) return;
    onChange(phase);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-full justify-start">
          <span className="mr-1">{selectedPhase.name}</span> <PhaseFlag phase={selectedPhase} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="bottom" align="start">
        <Command onValueChange={handleChange}>
          <CommandInput placeholder="Cambia graduatoria..." />
          <CommandList>
            <CommandEmpty>Nessuna graduatoria trovata</CommandEmpty>
            <CommandGroup>
              <ScrollArea className={phases.length > 6 ? "h-72" : ""}>
                {phases.map((phase) => (
                  <CommandItem
                    key={phase.href}
                    onSelect={handleChange}
                    value={phase.href}
                  >
                    <span className="mr-1">{phase.name}</span>
                    <PhaseFlag phase={phase} />
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
