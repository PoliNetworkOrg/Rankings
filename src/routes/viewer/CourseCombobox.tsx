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
import type CustomMap from "@/utils/CustomMap"
import type { CourseInfo } from "@/utils/data/store"

type Props = {
  courses: CustomMap<string, CourseInfo>
  value: string
  onSelect: (value: string) => void
}

export function CourseCombobox({ value, courses: c, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  function handleSelect(value: string) {
    onSelect(value)
    setOpen(false)
  }

  const arr = c.valuesArr()
  const absCourse = arr[0]
  const courses = arr.slice(1)
  const selectedCourse = courses.find((a) => a.value === value)

  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm">Corso</p>
      {selectedCourse ? (
        <Removable onRemove={() => handleSelect(absCourse.value)}>
          {selectedCourse.label}
        </Removable>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-full justify-start">
              Nessun corso selezionato
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="bottom" align="start">
            <Command>
              <CommandInput placeholder="Cambia corso..." />
              <CommandList>
                <CommandEmpty>Nessun corso trovato</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className={courses.length > 7 ? "h-72" : ""}>
                    {courses.map((course) => (
                      <CommandItem
                        key={course.value}
                        value={course.value}
                        onSelect={handleSelect}
                      >
                        {course.label}
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
