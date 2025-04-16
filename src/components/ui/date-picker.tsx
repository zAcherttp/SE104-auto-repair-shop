"use client";

import * as React from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { LucideIcon } from "lucide-react";

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  format?: string;
  disabled?: boolean;
  icon?: LucideIcon;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  className,
  format: dateFormat = "PPP",
  disabled = false,
  icon,
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date
  );

  React.useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            " justify-between text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          {selectedDate ? (
            format(selectedDate, dateFormat)
          ) : (
            <span>{placeholder}</span>
          )}
          {icon && React.createElement(icon, { className: "opacity-50" })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
