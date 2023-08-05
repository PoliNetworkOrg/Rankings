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
import { PhaseSelectComboboxProps } from "..";

export default function RankingCombobox({
  selectedGroup,
  selectedPhase,
  onChange,
  phases,
  open,
  setOpen,
}: PhaseSelectComboboxProps) {
  function handleChange(value: string): void {
    setOpen(open[0], false);
    const phase = phases.all.find((p) => p.href === value);
    if (!phase) return;

    const group = phases.groups.get(phase.group.value) ?? selectedGroup;
    onChange(phase, group ?? selectedGroup);
  }

  const filteredPhases = selectedGroup.phases.filter(
    (a) => phases.all.findIndex((b) => a.href === b.href) !== -1,
  );

  return (
    <Popover open={open[1]} onOpenChange={(value) => setOpen(open[0], value)}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-full justify-start">
          {selectedPhase.name}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="bottom" align="start">
        <Command onValueChange={handleChange}>
          <CommandInput placeholder="Cambia graduatoria..." />
          <CommandList>
            <CommandEmpty>Nessuna graduatoria trovata</CommandEmpty>
            <CommandGroup>
              <ScrollArea className={phases.all.length > 6 ? "h-72" : ""}>
                {filteredPhases.map((phase) => (
                  <CommandItem
                    key={phase.href}
                    onSelect={handleChange}
                    value={phase.href}
                  >
                    {phase.name}
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
