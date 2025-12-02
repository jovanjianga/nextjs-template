"use client"

import * as React from "react"
import { Check, ChevronDown, Palette } from "lucide-react"

import { cn } from "@/lib/utils"
import { presetStyles, type StyleOption } from "@/config/styles"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface StyleSelectorProps {
  selectedStyle: string | null
  customStyle: string
  onStyleChange: (styleId: string | null) => void
  onCustomStyleChange: (style: string) => void
}

export function StyleSelector({
  selectedStyle,
  customStyle,
  onStyleChange,
  onCustomStyleChange,
}: StyleSelectorProps) {
  const [open, setOpen] = React.useState(false)

  const selectedStyleData = presetStyles.find((s) => s.id === selectedStyle)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                {selectedStyleData ? selectedStyleData.name : "Select Style"}
              </div>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0">
            <Command>
              <CommandInput placeholder="Search styles..." />
              <CommandEmpty>No style found</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-auto">
                <CommandItem
                  value="none"
                  onSelect={() => {
                    onStyleChange(null)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      !selectedStyle ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>No preset style</span>
                </CommandItem>
                {presetStyles.map((style) => (
                  <CommandItem
                    key={style.id}
                    value={style.id}
                    onSelect={() => {
                      onStyleChange(style.id)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedStyle === style.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{style.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {style.description}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="custom-style" className="text-sm text-muted-foreground">
          Custom Style Description (Optional)
        </Label>
        <Input
          id="custom-style"
          placeholder="e.g., dreamy, retro, high contrast..."
          value={customStyle}
          onChange={(e) => onCustomStyleChange(e.target.value)}
          className="h-9"
        />
      </div>
    </div>
  )
}

