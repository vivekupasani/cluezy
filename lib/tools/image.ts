import { tool } from 'ai'

import { getSearchSchemaForModel } from '@/lib/schema/search'

/**
 * Creates a video search tool with the appropriate schema for the model.
 */
export function createImageTool(fullModel: string) {
    return tool({
        description: 'generate image bsed on query',
        parameters: getSearchSchemaForModel(fullModel),
        execute: async ({ query }) => {
            console.log("Using image generation")
            return "Hello world"
        }
    })
}

// Default export for backward compatibility, using a default model
export const imageTool = createImageTool('openai:gpt-4o-mini')
