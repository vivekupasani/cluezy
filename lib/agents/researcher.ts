import { CoreMessage, smoothStream, streamText } from 'ai'

import { RESEARCHER_SYSTEM_PROMPT } from '../prompts/researcher-sys-prompt'
import { academicSearchTool } from '../tools/acadamic-search'
import { datetimeTool } from '../tools/datetime'
import { createFileSearchTool } from '../tools/pdf-search'
import { productSearchTool } from '../tools/product-search'
import { createQuestionTool } from '../tools/question'
import { retrieveTool } from '../tools/retrieve'
import { createSearchTool } from '../tools/search'
import { createVideoSearchTool } from '../tools/video-search'
import { weatherTool } from '../tools/weather'
import { youtubeVideoAnalysisTool } from '../tools/youtube-video-analysis'
import { getModel } from '../utils/registry'

type ResearcherReturn = Parameters<typeof streamText>[0]

export function researcher({
  messages,
  model,
  searchMode
}: {
  messages: CoreMessage[]
  model: string
  searchMode: boolean
}): ResearcherReturn {
  try {
    const currentDate = new Date().toLocaleString()

    // Create model-specific tools
    const searchTool = createSearchTool(model)
    const videoSearchTool = createVideoSearchTool(model)
    const askQuestionTool = createQuestionTool(model)
    const pdfSearchTool = createFileSearchTool("pdf")
    const docSearchTool = createFileSearchTool("doc")
    const pptSearchTool = createFileSearchTool("ppt")

    return {
      model: getModel(model),
      system: `Current date and time: ${currentDate}\n${RESEARCHER_SYSTEM_PROMPT}`,
      messages,
      tools: {
        search: searchTool,
        acadamicSearch: academicSearchTool,
        retrieve: retrieveTool,
        videoSearch: videoSearchTool,
        ask_question: askQuestionTool,
        weather: weatherTool,
        youtubeVideoAnalysis: youtubeVideoAnalysisTool,
        datetime: datetimeTool,
        productSearch: productSearchTool,
        pdfSearch: pdfSearchTool,
        docSearch: docSearchTool,
        pptSearch: pptSearchTool
      },
      experimental_activeTools: searchMode
        ? ['search', 'acadamicSearch', 'retrieve', 'videoSearch', 'ask_question', 'weather', 'datetime', 'youtubeVideoAnalysis', 'productSearch', 'pdfSearch', 'docSearch', 'pptSearch']
        : [],
      maxSteps: searchMode ? 5 : 1,
      experimental_transform: smoothStream()
    }
  } catch (error) {
    console.error('Error in chatResearcher:', error)
    throw error
  }
}