"use client"

import * as React from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateOfBirthPickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DateOfBirthPicker({
  date,
  onSelect,
  placeholder = "Sélectionner une date",
  className,
  disabled = false,
}: DateOfBirthPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onSelect?.(selectedDate)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd MMMM yyyy", { locale: fr }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0" 
        align="start"
        side="bottom"
        sideOffset={4}
        avoidCollisions={true}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          captionLayout="dropdown"
          fromYear={1900}
          toYear={new Date().getFullYear()}
          disabled={(date: Date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          initialFocus
          className="p-0"
        />
      </PopoverContent>
    </Popover>
  )
}
