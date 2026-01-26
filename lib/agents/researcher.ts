import { CoreMessage, smoothStream, streamText } from 'ai'

import { RESEARCHER_SYSTEM_PROMPT } from '../prompts/researcher-sys-prompt'
import { createAcademicSearchTool } from '../tools/acadamic-search'
import { connectorSearchTool } from '../tools/connector-search'
import { datetimeTool } from '../tools/datetime'
import { createGithubSearchTool } from '../tools/github-search'
import { createFileSearchTool } from '../tools/pdf-search'
import { productSearchTool } from '../tools/product-search'
import { retrieveTool } from '../tools/retrieve'
import { createSearchTool } from '../tools/search'
import { createVideoSearchTool } from '../tools/video-search'
import { weatherTool } from '../tools/weather'
import { createXSearchTool } from '../tools/x-search'
import { youtubeVideoAnalysisTool } from '../tools/youtube-video-analysis'
import { getModel } from '../utils/registry'

type ResearcherReturn = Parameters<typeof streamText>[0]

export function researcher({
  messages,
  model,
  searchMode,
  excludeDomains
}: {
  messages: CoreMessage[]
  model: string
  searchMode: boolean
  excludeDomains?: string[]
}): ResearcherReturn {
  try {
    const currentDate = new Date().toLocaleString()

    // Create model-specific tools
    const searchTool = createSearchTool(model, excludeDomains)
    const videoSearchTool = createVideoSearchTool(model)
    const pdfSearchTool = createFileSearchTool("pdf")
    const docSearchTool = createFileSearchTool("doc")
    const pptSearchTool = createFileSearchTool("ppt")

    const academicSearchTool = createAcademicSearchTool(excludeDomains)
    const xSearchTool = createXSearchTool()
    const githubSearchTool = createGithubSearchTool()

    const systemPrompt = `Current date and time: ${currentDate}\n${RESEARCHER_SYSTEM_PROMPT}`

    return {
      model: getModel(model),
      system: systemPrompt,
      messages,
      tools: {
        search: searchTool,
        acadamicSearch: academicSearchTool,
        retrieve: retrieveTool,
        videoSearch: videoSearchTool,
        weather: weatherTool,
        youtubeVideoAnalysis: youtubeVideoAnalysisTool,
        datetime: datetimeTool,
        productSearch: productSearchTool,
        pdfSearch: pdfSearchTool,
        docSearch: docSearchTool,
        pptSearch: pptSearchTool,
        connectorSearch: connectorSearchTool,
        xSearch: xSearchTool,
        githubSearch: githubSearchTool
      },
      experimental_activeTools: searchMode
        ? ['search', 'acadamicSearch', 'retrieve', 'videoSearch', 'weather', 'datetime', 'youtubeVideoAnalysis', 'productSearch', 'pdfSearch', 'docSearch', 'pptSearch', 'connectorSearch', 'xSearch', 'githubSearch']
        : [],
      maxSteps: searchMode ? 5 : 1,
      experimental_transform: smoothStream()
    }
  } catch (error) {
    console.error('Error in chatResearcher:', error)
    throw error
  }
}