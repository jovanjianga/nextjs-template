"use client"

import * as React from "react"
import { Check, ChevronDown, Cpu } from "lucide-react"

import { cn } from "@/lib/utils"
import { imageModels, type ModelOption } from "@/config/styles"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ModelSelectorProps {
  selectedModel: string | null
  onModelChange: (modelId: string) => void
  disabled?: boolean
}

export function ModelSelector({
  selectedModel,
  onModelChange,
  disabled = false,
}: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false)

  const currentModel = selectedModel
    ? imageModels.find((m) => m.id === selectedModel)
    : imageModels.find((m) => m.isDefault)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="h-9 justify-between gap-2 px-3 text-sm font-normal"
        >
          <div className="flex items-center gap-2">
            <Cpu className="size-4 text-muted-foreground" />
            <span className="max-w-[120px] truncate sm:max-w-[180px]">
              {currentModel?.name || "Select model"}
            </span>
          </div>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup heading="Image Models">
              {imageModels.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => {
                    onModelChange(model.id)
                    setOpen(false)
                  }}
                  className="flex flex-col items-start gap-1 py-3"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium">{model.name}</span>
                    <Check
                      className={cn(
                        "size-4",
                        currentModel?.id === model.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </div>
                  {model.description && (
                    <span className="text-xs text-muted-foreground">
                      {model.description}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

