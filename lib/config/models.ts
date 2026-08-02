import { Model } from '@/lib/types/models'

export const availableModels: Model[] = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google Generative AI',
    providerId: 'google',
    enabled: true,
    toolCallType: 'native'
  }
]

export async function getModels(): Promise<Model[]> {
  return availableModels
}
