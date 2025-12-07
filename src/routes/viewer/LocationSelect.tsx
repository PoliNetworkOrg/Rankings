import { useContext, useState } from "react"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MobileContext from "@/contexts/MobileContext"

type Location = {
  value: string
  label: string
}

type Props = {
  value: string
  locations: Location[]
  onChange: (value: string) => void
}

export default function LocationsSelect(props: Props) {
  const { isMobile } = useContext(MobileContext)
  const { locations } = props
  if (locations.length === 0) return null
  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm">Sede</p>
      {locations.length >= 2 ? (
        isMobile ? (
          LocationCombobox(props)
        ) : (
          LocationsTabs(props)
        )
      ) : (
        <Removable showRemove={false}>{locations[0].label}</Removable>
      )}
    </div>
  )
}

function LocationCombobox({ value, onChange, locations }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start">
          {value
            ? locations.find((l) => l.value === value)?.label
            : "Seleziona una sede..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="bottom" align="start">
        <Command>
          <CommandInput placeholder="Cambia corso..." />
          <CommandList>
            <CommandEmpty>No courses found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className={locations.length > 7 ? "h-72" : ""}>
                {locations.map((location) => (
                  <CommandItem
                    key={location.value}
                    onSelect={(value) => {
                      onChange(value)
                      setOpen(false)
                    }}
                  >
                    {location.label}
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

function LocationsTabs({ value, onChange, locations }: Props) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList>
        {locations.map((location) => (
          <TabsTrigger value={location.value} key={location.value}>
            {location.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
