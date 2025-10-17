import { createGroq } from '@ai-sdk/groq'
import { generateText } from 'ai'

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY!,
})

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json()
        const date = new Date().toLocaleDateString()

        if (!prompt) {
            return Response.json(
                { error: 'Prompt not found!' },
                { status: 404 }
            )
        }

        const { text } = await generateText({
            model: groq('openai/gpt-oss-20b'),
            system: `You are an expert prompt engineer called Cluezy. You are given a prompt and you need to enhance it.
Today's Date: ${date}
Guidelines (MANDATORY):
- Preserve the user's original intent and constraints
- Make the prompt specific, unambiguous, and actionable
- Add missing context: entities, timeframe, location, format/constraints if implied
- Remove fluff, pronouns, and vague language; use proper nouns when possible
- Keep it concise (1-2 sentences extra max) but information-dense
- Do NOT ask follow-up questions
- Make sure it gives the best and comprehensive results for the user's query
- Make sure to maintain the Point of View of the User
- Your job is to enhance the prompt, not to answer the prompt!!
- Make sure the prompt is not an answer to the user's query!!
- Return ONLY the improved prompt text, with no quotes or commentary or answer to the user's query!!
- Just return the improved prompt text in plain text format, no other text or commentary or markdown or anything else!!`,
            prompt,
        })

        return Response.json({ enhancedPrompt: text })
    } catch (err) {
        console.error('Error in enhance-prompt API:', err)
        return Response.json(
            { error: 'Error generating prompt' },
            { status: 500 }
        )
    }
}
