import { CoreMessage, smoothStream, streamText } from 'ai'
import { CONNECTOR_CONFIGS, ConnectorProvider } from '../connectors/types'
import { RESEARCHER_SYSTEM_PROMPT } from '../prompts/researcher-sys-prompt'
import { getVercelTools } from '../services/tools'
import { createAcademicSearchTool } from '../tools/acadamic-search'
import { createGithubSearchTool } from '../tools/github-search'
import { createFileSearchTool } from '../tools/pdf-search'
import { productSearchTool } from '../tools/product-search'
import { retrieveTool } from '../tools/retrieve'
import { createSearchTool } from '../tools/search'
import { createVideoSearchTool } from '../tools/video-search'
import { weatherTool } from '../tools/weather'
import { createWebSearchTool } from '../tools/web-search'
import { createXSearchTool } from '../tools/x-search'
import { youtubeVideoAnalysisTool } from '../tools/youtube-video-analysis'
import { getModel, isReasoningModel } from '../utils/registry'

type ResearcherReturn = Parameters<typeof streamText>[0]

export async function researcher({
  messages,
  model,
  searchMode,
  userId,
  excludeDomains,
  selectedApps
}: {
  messages: CoreMessage[]
  model: string
  searchMode: boolean
  userId?: string
  excludeDomains?: string[]
  selectedApps?: ConnectorProvider[]
}): Promise<ResearcherReturn> {
  try {
    const currentDate = new Date().toLocaleString()

    // Create model-specific tools
    const searchTool = createSearchTool(model, excludeDomains)
    const videoSearchTool = createVideoSearchTool(model)
    const pdfSearchTool = createFileSearchTool('pdf')
    const docSearchTool = createFileSearchTool('doc')
    const pptSearchTool = createFileSearchTool('ppt')

    const webSearchTool = createWebSearchTool(excludeDomains)
    const academicSearchTool = createAcademicSearchTool(excludeDomains)
    const xSearchTool = createXSearchTool()
    const githubSearchTool = createGithubSearchTool()

    // Fetch Composio tools if userId is provided
    let composioTools = {}
    if (userId && userId !== 'anonymous') {
      try {
        if (selectedApps && selectedApps.length > 0) {
          composioTools = await getVercelTools(userId, selectedApps)
        }
      } catch (error) {
        console.error('Error fetching Composio tools:', error)
      }
    }

    let systemPrompt = `Current date and time: ${currentDate}\n${RESEARCHER_SYSTEM_PROMPT}`

    if (selectedApps && selectedApps.length > 0) {
      const appNames = selectedApps
        .map(id => CONNECTOR_CONFIGS[id as ConnectorProvider]?.name || id)
        .join(', ')
      systemPrompt += `\n\nCONTEXT APPS: The user has specifically selected the following apps for this query: ${appNames}.
- ALWAYS prioritize using tools from these apps to answer the query.
- Directly use the appropriate tool (e.g., if Gmail is selected and user asks for drafts, use GMAIL_LSIT_DRAFTS).
- DO NOT ask for clarification or "Which app?" if the request can be fulfilled using the selected context apps.`
    }

    const tools = {
      search: webSearchTool,
      acadamicSearch: academicSearchTool,
      retrieve: retrieveTool,
      videoSearch: videoSearchTool,
      weather: weatherTool,
      youtubeVideoAnalysis: youtubeVideoAnalysisTool,
      productSearch: productSearchTool,
      pdfSearch: pdfSearchTool,
      docSearch: docSearchTool,
      pptSearch: pptSearchTool,
      xSearch: xSearchTool,
      githubSearch: githubSearchTool,
      ...composioTools
    }

    const isReasoning = isReasoningModel(model)

    return {
      model: getModel(model),
      system: systemPrompt,
      messages,
      tools: tools,
      experimental_activeTools: searchMode ? Object.keys(tools) : [],
      maxSteps: searchMode ? 5 : 1,
      experimental_transform: smoothStream(),
      temperature: isReasoning ? 1 : 0
    }
  } catch (error) {
    console.error('Error in chatResearcher:', error)
    throw error
  }
}
