import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";

import { cn } from "@/utils/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Removable } from "@/components/custom-ui/Removable";
import { useState } from "react";

export type FilterOption<T> = {
  originalValue: T;
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type Props<TData, TValue> = {
  column: Column<TData, TValue>;
  title: string;
  options: FilterOption<TValue>[];
};

export function FilterBtn<TData, TValue>({
  column,
  title,
  options,
}: Props<TData, TValue>) {
  const [open, setOpen] = useState<boolean>(false);
  const facets = column.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  function handleClearFilter(): void {
    column?.setFilterValue(undefined);
    setOpen(false);
  }

  function handleOptionSelect(
    option: FilterOption<TValue>,
    isSelected: boolean,
  ): void {
    if (options.length <= 2) selectedValues.clear(); // filter with radio behaviour
    if (isSelected) selectedValues.delete(option.value); // toggle behaviour
    else selectedValues.add(option.value);

    const filterValues = Array.from(selectedValues); // get selected filter options
    column?.setFilterValue(filterValues.length ? filterValues : undefined); // update table
  }

  return facets.size >= 2 ? (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-center whitespace-nowrap border-dashed px-2"
        >
          <PlusCircledIcon className="mr-2" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    size="small"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selezionati
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        size="tiny"
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>Nessun filtro trovato</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const facet = facets.get(option.originalValue);
                const isSelected = selectedValues.has(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleOptionSelect(option, isSelected)}
                  >
                    <div
                      className={cn(
                        "border-primary mr-2 flex h-4 w-4 items-center justify-center border",
                        options.length <= 2 ? "rounded-full" : "rounded-sm",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && <option.icon className="mr-2 h-4 w-4" />}
                    <span>{option.label}</span>
                    {facet && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facet}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClearFilter}
                    className="justify-center text-center"
                  >
                    Pulisci i filtri
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  ) : (
    <Removable showRemove={false}>
      {title}
      <Separator
        orientation="vertical"
        className="mx-2 h-4 bg-slate-400 dark:bg-slate-600"
      />
      {facets.size === 1 && Array.from(facets.keys())[0]
        ? options[0].label
        : "N/A"}
    </Removable>
  );
}
