"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type ComboboxItem = {
  value: string;
  label: string;
};

interface ComboboxProps {
  items: ComboboxItem[];
  searchEnabled?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  width?: string;
}

export function ComboBox({
  searchEnabled,
  items,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No item found.",
  value,
  onChange,
  className,
  disabled = false,
  width = "200px",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value || "");

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const newValue = currentValue === selectedValue ? "" : currentValue;
      setSelectedValue(newValue);
      onChange?.(newValue);
      setOpen(false);
    },
    [selectedValue, onChange]
  );

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(`w-[${width}] font-normal justify-between`, className)}
          disabled={disabled}
        >
          {selectedValue
            ? items.find((item) => item.value === selectedValue)?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-[${width}] p-0`}>
        <Command>
          {searchEnabled && (
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
          )}
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={handleSelect}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedValue === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
