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

export default function GroupCombobox({
  selectedGroup,
  onChange,
  phases,
  open,
  setOpen,
}: PhaseSelectComboboxProps) {
  function handleChange(value: string): void {
    setOpen(false, open[1]);
    const group = phases.groups.get(value);
    if (!group) return;

    onChange(group.phases[0], group);
  }

  return (
    <Popover open={open[0]} onOpenChange={(value) => setOpen(value, open[1])}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-full justify-start">
          {selectedGroup.label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="bottom" align="start">
        <Command onValueChange={handleChange}>
          <CommandInput placeholder="Cambia fase..." />
          <CommandList>
            <CommandEmpty>Nessuna graduatoria trovata</CommandEmpty>
            <CommandGroup>
              <ScrollArea className={phases.all.length > 6 ? "h-72" : ""}>
                {phases.groups.valuesArr().map((group) => (
                  <CommandItem
                    key={group.value}
                    onSelect={handleChange}
                    value={group.value}
                  >
                    {group.label}
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
