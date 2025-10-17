import { tool } from "ai";
import z from "zod";

export const productSearchTool = tool({
    description: "",
    parameters: z.object({
        url: z.string().describe("The url to find products")
    }),
    execute: async ({ url }) => {
        console.log("I AM USING PRODUCT SEARCH TOOL")
        try {
            const response = await fetch('https://google.serper.dev/lens', {
                method: 'POST',
                headers: {
                    'X-API-KEY': process.env.SERPER_API_KEY || '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json()
            console.log("PRODUCT RESULTS : ", data)

            return data
        } catch (error) {
            console.error('Video Search API error:', error)
            return null
        }
    }
})