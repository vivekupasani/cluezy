import { Message } from 'ai'

import { UserPlanDetailsProps } from '../actions/user-premium'
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
  userPlanDetails?: UserPlanDetailsProps | null
}
