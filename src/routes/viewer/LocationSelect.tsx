import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MobileContext from "@/contexts/MobileContext";
import { useContext, useState } from "react";

type Location = {
  value: string;
  label: string;
};

type onChangeType = (value: string) => void;

type Props = {
  value: string;
  locations: Location[];
  onChange: onChangeType;
};

export default function LocationsSelect(props: Props) {
  const { isMobile } = useContext(MobileContext);
  return isMobile ? LocationCombobox(props) : LocationsTabs(props);
}

function LocationCombobox({ value, onChange, locations }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center space-x-4">
      <p className="text-muted-foreground text-sm">Sede</p>
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
                        onChange(value);
                        setOpen(false);
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
    </div>
  );
}

function LocationsTabs({ value, onChange, locations }: Props) {
  return (
    locations.length > 0 && (
      <Tabs value={value} onValueChange={onChange}>
        <div className="flex items-center space-x-4">
          <p className="text-muted-foreground text-sm">Sede</p>
          <TabsList>
            {locations.map((location) => (
              <TabsTrigger value={location.value} key={location.value}>
                {location.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
    )
  );
}
