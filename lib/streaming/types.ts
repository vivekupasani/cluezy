import { Message } from 'ai'

import { ConnectorProvider } from '../connectors/types'
import { Model } from '../types/models'

export interface BaseStreamConfig {
  messages: Message[]
  model: Model
  chatId: string
  searchMode: boolean
  userId: string
  excludeDomains?: string[],
  selectedApps?: ConnectorProvider[]
}
