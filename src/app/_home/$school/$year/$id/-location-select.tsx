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
import { capitaliseWords } from "@/utils/strings/capitalisation"

type Props = {
  value: string
  locations: string[]
  onChange: (value: string) => void
}

export default function LocationsSelect(props: Props) {
  "use no memo"
  const { isMobile } = useContext(MobileContext)
  const { locations } = props
  if (locations.length === 0) return null
  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm">Sede</p>
      {locations.length >= 2 ? (
        isMobile ? (
          <LocationCombobox {...props} />
        ) : (
          <LocationsTabs {...props} />
        )
      ) : (
        <Removable showRemove={false}>
          {capitaliseWords(locations[0])}
        </Removable>
      )}
    </div>
  )
}

function LocationCombobox({ value, onChange, locations }: Props) {
  "use no memo"
  const [open, setOpen] = useState(false)
  const selected = locations.find(
    (l) => l.toLowerCase() === value.toLowerCase()
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start">
          {selected ? capitaliseWords(selected) : "Seleziona una sede..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="bottom" align="start">
        <Command>
          <CommandInput placeholder="Cambia sede..." />
          <CommandList>
            <CommandEmpty>Nessuna sede trovata.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className={locations.length > 7 ? "h-72" : ""}>
                {locations.map((location) => (
                  <CommandItem
                    autoFocus={selected === location}
                    key={location}
                    onSelect={(_value) => {
                      onChange(location)
                      setOpen(false)
                    }}
                  >
                    {capitaliseWords(location)}
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
    <Tabs value={value.toLowerCase()} onValueChange={onChange}>
      <TabsList>
        {locations.map((location) => (
          <TabsTrigger
            value={location.toLowerCase()}
            key={location.toLowerCase()}
          >
            {capitaliseWords(location)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
