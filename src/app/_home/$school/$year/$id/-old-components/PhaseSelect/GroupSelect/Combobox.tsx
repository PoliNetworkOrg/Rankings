import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { PhaseGroup, PhaseGroups } from "@/utils/types/data/phase"
import type { State } from "@/utils/types/state"

export type GroupComboboxProps = {
  groups: PhaseGroups
  selectedGroup: PhaseGroup
  groupOpen: State<boolean>
  onChange: (group: PhaseGroup) => void
}

export default function GroupCombobox({
  selectedGroup,
  onChange,
  groups,
  groupOpen,
}: GroupComboboxProps) {
  const [open, setOpen] = groupOpen

  function handleChange(value: string): void {
    setOpen(false)
    const group = groups.get(value)
    if (!group) return

    onChange(group)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
              <ScrollArea className={groups.size > 6 ? "h-72" : ""}>
                {groups.valuesArr().map((group) => (
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
  )
}
