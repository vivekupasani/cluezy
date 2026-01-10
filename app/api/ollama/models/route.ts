import { NextResponse } from 'next/server'

import { OllamaClient } from '@/lib/ollama/client'
import { transformOllamaModel } from '@/lib/ollama/transformer'

export async function GET() {
  const ollamaUrl = process.env.OLLAMA_BASE_URL
  if (!ollamaUrl) {
    return NextResponse.json({ models: [] })
  }

  try {
    const client = new OllamaClient(ollamaUrl)
    const ollamaModels = await client.getModels()

    const models = (
      await Promise.all(
        ollamaModels.map(async ollamaModel => {
          try {
            const capabilities = await client.getModelCapabilities(ollamaModel.name)
            return transformOllamaModel(ollamaModel, capabilities)
          } catch {
            return null
          }
        })
      )
    ).filter((model): model is NonNullable<typeof model> => model !== null)

    return NextResponse.json({ models })
  } catch {
    return NextResponse.json({ models: [] })
  }
}
