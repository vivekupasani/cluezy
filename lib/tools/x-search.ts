import { tool } from "ai";
import Exa from "exa-js";
import { z } from "zod";

export function createXSearchTool(globalExcludeDomains: string[] = []) {
    return tool({
        description: "Search for information on the web.",
        parameters: z.object({
            query: z.string().describe('The search query'),
            excludeDomains: z.array(z.string()).describe('List of domains to exclude').optional(),
        }),
        execute: async ({ query, excludeDomains = [] }) => {
            try {
                console.log("I AM USING X SEARCH TOOL")
                const exa = new Exa(process.env.EXA_API_KEY);

                // Merge global exclusions with request-specific exclusions
                const mergedExcludeDomains = [
                    ...new Set([...excludeDomains, ...globalExcludeDomains])
                ];

                const result = await exa.searchAndContents(
                    query,
                    {
                        category: "tweet",
                        numResults: 10,
                        text: true,
                        type: "auto",
                        livecrawl: "fallback",
                        excludeDomains: mergedExcludeDomains
                    }
                );
                return {
                    results: result["results"],
                    query: query,
                    images: []
                };
            } catch (error) {
                console.error('Search error:', error);
                throw error;
            }
        },
    });
}