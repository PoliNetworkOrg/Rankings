import { useState } from "react"
import { Removable } from "@/components/custom-ui/Removable"
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
import { capitaliseWords } from "@/utils/strings/capitalisation"

type Props = {
  options: string[]
  value: string | null
  onChange: (value: string | null) => void
}

const courseLabel = (value: string) => capitaliseWords(value)

export function CourseCombobox({ value, options, onChange }: Props) {
  const [open, setOpen] = useState(false)
  function handleSelect(value: string | null) {
    onChange(value)
    setOpen(false)
  }

  const selected = value ? options.find((a) => a === value) : undefined

  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm">Corso</p>
      {selected ? (
        <Removable onRemove={() => handleSelect(null)}>
          {courseLabel(selected)}
        </Removable>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 justify-start">
              Nessun corso selezionato
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="bottom" align="start">
            <Command>
              <CommandInput placeholder="Cerca un corso..." />
              <CommandList>
                <CommandEmpty>Nessun corso trovato</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className={options.length > 7 ? "h-72" : ""}>
                    {options.map((course) => (
                      <CommandItem
                        key={course}
                        value={course}
                        onSelect={handleSelect}
                      >
                        {courseLabel(course)}
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
