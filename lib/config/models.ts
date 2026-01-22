import { Model } from '@/lib/types/models'
import { unstable_cache } from 'next/cache'

import defaultModels from './default-models.json'

export function validateModel(model: any): model is Model {
  return (
    typeof model.id === 'string' &&
    typeof model.name === 'string' &&
    typeof model.provider === 'string' &&
    typeof model.providerId === 'string' &&
    typeof model.enabled === 'boolean' &&
    (model.toolCallType === 'native' || model.toolCallType === 'manual') &&
    (model.toolCallModel === undefined ||
      typeof model.toolCallModel === 'string')
  )
}

/**
 * Internal function to fetch models, separated from cache to allow passing baseUrl
 */
async function fetchModelsInternal(baseUrlObj: URL): Promise<Model[]> {
  try {
    let staticModels: Model[] = []

    // Try to load default models first as it's the fastest
    if (
      Array.isArray(defaultModels.models) &&
      defaultModels.models.every(validateModel)
    ) {
      staticModels = defaultModels.models as Model[]
    }

    // Fetch Ollama models
    const ollamaModels = await fetchOllamaModels(baseUrlObj)

    // Combine static and Ollama models
    const allModels = [...staticModels, ...ollamaModels]

    console.log(
      `Loaded ${staticModels.length} static models and ${ollamaModels.length} Ollama models`
    )
    return allModels
  } catch (error) {
    console.warn('Failed to load models:', error)
  }

  // Last resort: return default models
  return (defaultModels.models as Model[]) || []
}

/**
 * Cached version of model fetching
 * We pass baseUrl as a parameter so it can be used as part of the cache key and
 * because we can't call headers() (which getBaseUrl uses) inside unstable_cache
 */
const getCachedModels = unstable_cache(
  async (baseUrl: string): Promise<Model[]> => {
    return fetchModelsInternal(new URL(baseUrl))
  },
  ['models-cache'],
  { revalidate: 3600, tags: ['models'] }
)

/**
 * Public function to get models.
 * It resolves the base URL outside of the cache (since it uses headers)
 * and then calls the cached function.
 */
export async function getModels(): Promise<Model[]> {
  try {
    const { getBaseUrlString } = await import('@/lib/utils/url')
    const baseUrl = await getBaseUrlString()
    return getCachedModels(baseUrl)
  } catch (error) {
    // If we're pre-rendering and dynamic APIs (headers) are not available,
    // return default models to avoid crashing the build in PPR mode.
    console.log('Pre-rendering models without baseUrl')
    return (defaultModels.models as Model[]) || []
  }
}

/**
 * Fetch Ollama models from the API endpoint
 */
async function fetchOllamaModels(baseUrl: URL): Promise<Model[]> {
  try {
    const ollamaUrl = process.env.OLLAMA_BASE_URL
    if (!ollamaUrl) {
      console.log('OLLAMA_BASE_URL not configured, skipping Ollama models')
      return []
    }

    const ollamaApiUrl = new URL('/api/ollama/models', baseUrl)
    console.log(
      'Attempting to fetch Ollama models from:',
      ollamaApiUrl.toString()
    )

    const response = await fetch(ollamaApiUrl, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json'
      }
    })

    if (!response.ok) {
      console.warn(
        `HTTP error when fetching Ollama models: ${response.status} ${response.statusText}`
      )
      return []
    }

    const data = await response.json()
    if (Array.isArray(data.models)) {
      console.log(`Successfully loaded ${data.models.length} Ollama models`)
      return data.models
    }

    return []
  } catch (error) {
    console.warn('Failed to fetch Ollama models:', error)
    return []
  }
}
