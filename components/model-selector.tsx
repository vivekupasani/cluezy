'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import { Bot, Check, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'

import { Model } from '@/lib/types/models'
import { getCookie, setCookie } from '@/lib/utils/cookies'

import { createModelId } from '../lib/utils'

import { Button } from './ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

function groupModelsByProvider(models: Model[]) {
  return models
    .filter(model => model.enabled)
    .reduce(
      (groups, model) => {
        const provider = model.provider
        if (!groups[provider]) {
          groups[provider] = []
        }
        groups[provider].push(model)
        return groups
      },
      {} as Record<string, Model[]>
    )
}

interface ModelSelectorProps {
  models: Model[]
}

export function ModelSelector({ models }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const DEFAULT_SELECTED_MODEL: Model = {
    "id": "gemini-2.5-flash",
    "name": "Gemini 2.5 Flash",
    "provider": "Google Generative AI",
    "providerId": "google",
    "enabled": true,
    "toolCallType": "native"
  }

  useEffect(() => {
    const savedModel = getCookie('selectedModel')
    if (savedModel) {
      try {
        const model = JSON.parse(savedModel) as Model
        setValue(createModelId(model))
      } catch (e) {
        console.error('Failed to parse saved model:', e)
      }
    }
    else {
      setCookie('selectedModel', JSON.stringify(DEFAULT_SELECTED_MODEL))
      setValue(createModelId(DEFAULT_SELECTED_MODEL))
    }
  }, [])

  const handleModelSelect = (id: string) => {
    const newValue = id === value ? '' : id
    setValue(newValue)

    const selectedModel = models.find(
      model => createModelId(model) === newValue
    )
    if (selectedModel) {
      setCookie('selectedModel', JSON.stringify(selectedModel))
      toast.success(`Switched to ${selectedModel.name}`)
    } else {
      setCookie('selectedModel', '')
    }

    setOpen(false)
  }

  const selectedModel = models.find(model => createModelId(model) === value)
  const groupedModels = groupModelsByProvider(models)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild >
        <Button
          role="combobox"
          aria-expanded={open}
          className="h-8 px-2 flex items-center justify-center gap-1.5 rounded-lg bg-secondary/30 hover:bg-secondary/60  border-border text-muted-foreground hover:text-foreground transition-all duration-200 border-0"
        >
          {selectedModel ? (
            <Image
              src={`/providers/logos/${selectedModel.providerId}.svg`}
              alt={selectedModel.provider}
              width={14}
              height={14}
              className="rounded-full shrink-0"
            />
          ) : (
            <Bot size={14} className='shrink-0' />
          )}
          <span className="text-xs font-medium truncate max-w-[100px] hidden sm:block">
            {selectedModel?.name || 'Select model'}
          </span>
          <ChevronDown size={12} className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 mx-2 HiddenScrollbar border-border/50 shadow-xl rounded-xl" align="start">
        <Command className='bg-background/95 backdrop-blur-sm'>
          <CommandInput placeholder="Search models..." className="h-10 text-sm" />
          <CommandList className="max-h-[300px] overflow-y-auto CustomScrollbar p-1">
            <CommandEmpty className='txt-grad text-sm text-center py-4'>No model found.</CommandEmpty>
            {Object.entries(groupedModels).map(([provider, models]) => (
              <CommandGroup key={provider} heading={provider} className="text-muted-foreground/70 font-medium">
                {models.map(model => {
                  const modelId = createModelId(model)
                  const isSelected = value === modelId
                  return (
                    <CommandItem
                      key={modelId}
                      value={modelId}
                      onSelect={handleModelSelect}
                      className={`flex justify-between items-center px-3 py-2 rounded-lg mb-0.5 cursor-pointer aria-selected:bg-accent/50 ${isSelected ? 'bg-accent/50' : ''}`}
                    >
                      <div className="flex items-center space-x-2.5 overflow-hidden">
                        <div className="shrink-0 rounded-full border border-border/40 p-0.5 bg-background">
                          <Image
                            src={`/providers/logos/${model.providerId}.svg`}
                            alt={model.provider}
                            width={16}
                            height={16}
                            className="rounded-full"
                          />
                        </div>
                        <span className={`text-sm font-medium truncate ${isSelected ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                          {model.name}
                        </span>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))}
            <div className='p-2 border-t border-border/40 mt-1'>
              <p className='text-[10px] text-center text-muted-foreground/60'>More models coming soon</p>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
