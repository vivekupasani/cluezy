import { tool } from 'ai';
import Exa from 'exa-js';
import { z } from 'zod';

export function createAcademicSearchTool(globalExcludeDomains: string[] = []) {
    return tool({
        description: 'Search acadamic papers and research.',
        parameters: z.object({
            query: z.string().describe('The search query'),
            excludeDomains: z.array(z.string()).describe('List of domains to exclude').optional(),
        }),
        execute: async ({ query, excludeDomains = [] }: { query: string, excludeDomains?: string[] }) => {
            try {
                console.log("I AM USING ACADEMIC SEARCH TOOL")
                console.log("query: ", query);
                const exa = new Exa(process.env.EXA_API_KEY);

                // Merge global exclusions with request-specific exclusions
                const mergedExcludeDomains = [
                    ...new Set([...excludeDomains, ...globalExcludeDomains])
                ];

                const [exaResult] = await Promise.all([
                    exa.search(query, {
                        category: "research paper",
                        numResults: 10,
                        type: "instant",
                        contents: {
                            highlights: {
                                maxCharacters: 4000
                            },
                            text: true,
                            livecrawl: "fallback",
                        },
                        excludeDomains: mergedExcludeDomains,
                    }),
                ]);

                return {
                    results: exaResult.results,
                    images: [],
                };
            } catch (error) {
                console.error('Academic search error:', error);
                throw error;
            }
        },
    });
}

// Default export for backward compatibility if needed, though we should transition to factory
export const academicSearchTool = createAcademicSearchTool();