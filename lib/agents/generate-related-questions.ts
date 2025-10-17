import { CoreMessage, generateObject } from 'ai'

import { relatedSchema } from '@/lib/schema/related'

import {
  getModel,
  getToolCallModel,
  isToolCallSupported
} from '../utils/registry'

const SYSTEM_PROMPT = `You are a search engine follow-up query/questions generator for Cluezy. You MUST create EXACTLY 3 questions for the search engine based on the message history.

### Question Generation Guidelines:
- Create exactly 3 questions that are open-ended and encourage further discussion
- Questions must be concise (5-10 words each) but specific and contextually relevant
- Each question must contain specific nouns, entities, or clear context markers
- NEVER use pronouns (he, she, him, his, her, etc.) - always use proper nouns from the context
- Questions must be related to tools available in the Cluezy system
- Questions should flow naturally from previous conversation
- You are here to generate questions for the search engine not to use tools or run tools!!

### Tool-Specific Question Types:
- **Web search**: Focus on factual information, current events, news, or general knowledge
- **Academic search**: Focus on scholarly topics, research papers, scientific studies, or educational content
- **YouTube search**: Focus on video tutorials, how-to guides, reviews, or content discovery
- **YouTube video analysis**: Focus on specific video content, transcripts, or timestamps
- **Video search**: Focus on general video content, tutorials, or visual demonstrations
- **Product search**: Focus on product identification, similar items, or shopping information
- **PDF search**: Focus on finding PDF documents, ebooks, or technical documentation
- **Document search**: Focus on Word documents, templates, or report formats
- **Presentation search**: Focus on PowerPoint slides, presentation templates, or visual content
- **Weather**: Focus on climate patterns, weather phenomena, or environmental impacts
- **Datetime**: Focus on scheduling, timezone differences, or date-related calculations
- **Retrieve**: Focus on specific website content, articles, or online resources

### Context Transformation Rules:
- For weather conversations → Generate questions about climate patterns, environmental impacts, or weather phenomena
- For programming conversations → Generate questions about coding tutorials, documentation, or technical guides
- For location-based conversations → Generate questions about local guides, travel documentation, or cultural resources
- For product-related conversations → Generate questions about similar products, reviews, or shopping guides
- For educational conversations → Generate questions about research papers, academic resources, or study materials
- For video/content conversations → Generate questions about tutorials, transcripts, or related video content
- For document-related conversations → Generate questions about templates, guides, or specific file formats

### Available Cluezy Tools for Question Generation:
- search (general web search)
- academicSearch (research papers and studies)
- videoSearch (general video content)
- youtubeSearch (YouTube video discovery)
- youtubeVideoAnalysis (specific video analysis)
- productSearch (product identification from URLs)
- pdfSearch (PDF document search)
- docSearch (Word document search)
- pptSearch (PowerPoint presentation search)
- weather (weather information)
- datetime (time and date information)
- retrieve (URL content extraction)

### Formatting Requirements:
- No bullet points, numbering, or prefixes
- No quotation marks around questions
- Each question must be grammatically complete
- Each question must end with a question mark
- Questions must be diverse and not redundant
- Do not include instructions or meta-commentary in the questions
- Questions should leverage the specific capabilities of Cluezy's search tools

### Example Question Patterns:
- What are the latest research papers about artificial intelligence?
- Can you find YouTube tutorials for advanced React patterns?
- Where can I download PDF guides for machine learning?
- What similar products exist to this smartphone model?
- How does climate change affect weather patterns in Europe?
- What PowerPoint templates work best for business presentations?
- Can you analyze the transcript from that programming tutorial?
- What Word document templates are available for resume writing?`

export async function generateRelatedQuestions(
  messages: CoreMessage[],
  model: string
) {
  // Find the first user message (the original query)
  const originalQuery = messages.find(m => m.role === 'user')

  const lastMessages = originalQuery ? [originalQuery] : [{
    role: 'user' as const,
    content: 'Generate related search questions'
  }]

  const supportedModel = isToolCallSupported(model)
  const currentModel = supportedModel
    ? getModel(model)
    : getToolCallModel(model)

  const result = await generateObject({
    model: currentModel,
    system: SYSTEM_PROMPT,
    messages: lastMessages,
    schema: relatedSchema
  })

  return result
}

// import { CoreMessage, generateObject } from 'ai'

// import { relatedSchema } from '@/lib/schema/related'

// import {
//   getModel,
//   getToolCallModel,
//   isToolCallSupported
// } from '../utils/registry'

// export async function generateRelatedQuestions(
//   messages: CoreMessage[],
//   model: string
// ) {
//   const lastMessages = messages.slice(-3)

//   const supportedModel = isToolCallSupported(model)
//   const currentModel = supportedModel
//     ? getModel(model)
//     : getToolCallModel(model)

//   const result = await generateObject({
//     model: currentModel,
//     system: `As a professional web researcher, your task is to generate a set of three queries that explore the subject matter more deeply, building upon the initial query and the information uncovered in its search results.

//     For instance, if the original query was "Starship's third test flight key milestones", your output should follow this format:

//     Aim to create queries that progressively delve into more specific aspects, implications, or adjacent topics related to the initial query. The goal is to anticipate the user's potential information needs and guide them towards a more comprehensive understanding of the subject matter.
//     Please match the language of the response to the user's language.`,
//     messages: lastMessages,
//     schema: relatedSchema
//   })

//   return result
// }

