'use client'
import { createContext, useContext, useState } from 'react'

import { ChatHistoryClient } from './sidebar/chat-history-client'

export const HistoryDialogContext = createContext<{
  isHistoryDialogOpen: boolean
  setHistoryDialogIsOpen: React.Dispatch<React.SetStateAction<boolean>>
} | null>(null)

export const HistoryDialogProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [isHistoryDialogOpen, setHistoryDialogIsOpen] = useState(false)

  return (
    <HistoryDialogContext.Provider
      value={{ isHistoryDialogOpen, setHistoryDialogIsOpen }}
    >
      {children}
    </HistoryDialogContext.Provider>
  )
}

export const useHistoryDialog = () => {
  const context = useContext(HistoryDialogContext)
  if (!context) {
    throw new Error(
      'useHistoryDialog must be used within a HistoryDialogProvider'
    )
  }
  return context
}

export const HistoryDialog = () => {
  return <ChatHistoryClient />
}
