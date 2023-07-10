import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import CustomMap from "@/utils/CustomMap"
import { CourseInfo } from "@/utils/data/store"
import { useState } from "react"

type Props = {
  courses: CustomMap<string, CourseInfo>
  value: string
  onSelect: (value: string) => void
}

export function CourseCombobox({ value, courses, onSelect }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center space-x-4">
      <p className="text-muted-foreground text-sm">Corso</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            {value ? courses.get(value)?.label : "Seleziona un corso..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="bottom" align="start">
          <Command>
            <CommandInput placeholder="Cambia corso..." />
            <CommandList>
              <CommandEmpty>No courses found.</CommandEmpty>
              <CommandGroup>
                {courses.valuesArr().map(course => (
                  <CommandItem
                    key={course.value}
                    value={course.value}
                    onSelect={value => {
                      onSelect(value)
                      setOpen(false)
                    }}
                  >
                    {course.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
