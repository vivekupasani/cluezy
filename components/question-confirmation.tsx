'use client'

import { useState } from 'react'

import { ToolInvocation } from 'ai'
import { ArrowRight, Check, SkipForward } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

interface QuestionConfirmationProps {
  toolInvocation: ToolInvocation
  onConfirm: (toolCallId: string, approved: boolean, response?: any) => void
  isCompleted?: boolean
}

interface QuestionOption {
  value: string
  label: string
}

export function QuestionConfirmation({
  toolInvocation,
  onConfirm,
  isCompleted = false
}: QuestionConfirmationProps) {
  const { question, options, allowsInput, inputLabel, inputPlaceholder } =
    toolInvocation.args

  const resultData =
    toolInvocation.state === 'result' && toolInvocation.result
      ? toolInvocation.result
      : null

  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [inputText, setInputText] = useState('')
  const [completed, setCompleted] = useState(isCompleted)
  const [skipped, setSkipped] = useState(false)

  const isButtonDisabled =
    selectedOptions.length === 0 && (!allowsInput || inputText.trim() === '')

  const handleOptionChange = (label: string) => {
    setSelectedOptions(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value)
  }

  const handleSkip = () => {
    setSkipped(true)
    setCompleted(true)
    onConfirm(toolInvocation.toolCallId, false, { skipped: true })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const response = { selectedOptions, inputText: inputText.trim(), question }
    onConfirm(toolInvocation.toolCallId, true, response)
    setCompleted(true)
  }

  const getDisplayedOptions = (): string[] =>
    resultData?.selectedOptions ?? selectedOptions

  const getDisplayedInputText = (): string =>
    resultData?.inputText ?? inputText

  const wasSkipped = (): boolean => resultData?.skipped ?? skipped

  const updatedQuery = () => {
    if (wasSkipped()) return 'Question skipped'

    const displayOptions = getDisplayedOptions()
    const displayInputText = getDisplayedInputText()

    const optionsText =
      displayOptions.length > 0 ? `Selected: ${displayOptions.join(', ')}` : ''
    const inputTextDisplay =
      displayInputText.trim() !== '' ? `Input: ${displayInputText}` : ''

    return [optionsText, inputTextDisplay].filter(Boolean).join(' | ')
  }

  // ✅ Completed or result state view
  if (completed || toolInvocation.state === 'result') {
    const isSkipped = wasSkipped()
    return (
      <Card className="p-4 border-border/50 shadow-sm bg-card/60 max-w-[720px] ml-4 backdrop-blur-sm rounded-xl">
        <div className="flex flex-col space-y-2">
          <CardTitle className="text-base font-medium text-foreground/90">
            {question}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isSkipped ? (
              <SkipForward size={16} className="text-yellow-500" />
            ) : (
              <Check size={16} className="text-green-500" />
            )}
            <p className="truncate">{updatedQuery()}</p>
          </div>
        </div>
      </Card>
    )
  }

  // ✅ Default (active) view
  return (
    <Card className="border-border/50 shadow-md bg-card/70 max-w-[720px] ml-4 backdrop-blur-sm rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground/90">
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {options && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {options.map((option: QuestionOption, index: number) => (
                <div
                  key={`option-${index}`}
                  className="flex items-center space-x-2 rounded-md border border-border/40 px-3 py-2 hover:bg-accent/40 transition-colors"
                >
                  <Checkbox
                    id={option.value}
                    checked={selectedOptions.includes(option.label)}
                    onCheckedChange={() => handleOptionChange(option.label)}
                  />
                  <label
                    htmlFor={option.value}
                    className="text-sm cursor-pointer select-none"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          )}

          {allowsInput && (
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="query"
                className="text-sm text-muted-foreground font-medium"
              >
                {inputLabel}
              </label>
              <Input
                id="query"
                type="text"
                placeholder={inputPlaceholder}
                value={inputText}
                onChange={handleInputChange}
                className="border-border/40"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              className="flex items-center gap-1 text-xs sm:text-sm"
            >
              <SkipForward size={16} />
              Skip
            </Button>
            <Button
              type="submit"
              disabled={isButtonDisabled}
              className="flex items-center gap-1 text-xs sm:text-sm"
            >
              <ArrowRight size={16} />
              Send
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
