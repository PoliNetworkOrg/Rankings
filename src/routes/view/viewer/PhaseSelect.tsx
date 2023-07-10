import { useContext, useState } from "react"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import MobileContext from "@/contexts/MobileContext"
import { PhaseLink } from "@/utils/types/data/parsed/Index/RankingFile"

type Props = {
  phasesLinks?: PhaseLink[]
  value: string
  onChange: (value: string) => void
}

export default function PhaseSelect(props: Props) {
  const { width } = useContext(MobileContext)
  const [open, setOpen] = useState(false)
  if (!props.phasesLinks) return <></>
  const minWidth = 200 * props.phasesLinks?.length
  return width > minWidth
    ? PhaseTabs(props)
    : PhaseCombobox({ ...props, open, setOpen })
}

type ComboboxProps = Props & {
  open: boolean
  setOpen: (value: boolean) => void
}

function PhaseCombobox({
  value,
  onChange,
  phasesLinks,
  open,
  setOpen
}: ComboboxProps) {
  return (
    phasesLinks && (
      <div className="flex items-center space-x-4">
        <p className="text-muted-foreground text-sm">Sede</p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start">
              {value
                ? phasesLinks.find(l => l.href === value)?.name
                : "Seleziona una sede..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="bottom" align="start">
            <Command onValueChange={onChange}>
              <CommandInput placeholder="Cambia sede..." />
              <CommandList>
                <CommandEmpty>No courses found.</CommandEmpty>
                <CommandGroup>
                  {phasesLinks.map(phase => (
                    <CommandItem
                      key={phase.href}
                      onSelect={value => {
                        onChange(value)
                        setOpen(false)
                      }}
                      value={phase.href}
                    >
                      {phase.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    )
  )
}
function PhaseTabs({ value, onChange, phasesLinks }: Props) {
  return (
    phasesLinks && (
      <div className="flex flex-1 flex-wrap gap-4 overflow-x-hidden">
        <Tabs
          value={value}
          onValueChange={onChange}
          className="flex flex-1 overflow-x-hidden"
        >
          <div className="flex flex-1 items-center space-x-4 overflow-x-hidden">
            <p className="text-muted-foreground text-sm">Fase</p>
            <TabsList className="flex overflow-x-hidden">
              {phasesLinks.map(phase => (
                <TabsTrigger
                  className={`block ${phase.href === value ? "" : "truncate"}`}
                  value={phase.href}
                  key={phase.href}
                >
                  {phase.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      </div>
    )
  )
}
