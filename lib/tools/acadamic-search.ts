import { tool } from 'ai';
import Exa from 'exa-js';
import { z } from 'zod';

export const academicSearchTool = tool({
    description: 'Search academic papers and research.',
    parameters: z.object({
        query: z.string().describe('The search query'),
    }),
    execute: async ({ query }: { query: string }) => {
        try {
            console.log("I AM USING ACADAMIC SEARCH TOOL")
            const exa = new Exa(process.env.EXA_API_KEY);

            const result = await exa.searchAndContents(query, {
                type: 'auto',
                numResults: 20,
                category: 'research paper',
                summary: {
                    query: 'Abstract of the Paper',
                },
            });

            const processedResults = result.results.reduce<typeof result.results>((acc, paper) => {
                if (acc.some((p) => p.url === paper.url) || !paper.summary) return acc;

                const cleanSummary = paper.summary.replace(/^Summary:\s*/i, '');
                const cleanTitle = paper.title?.replace(/\s\[.*?\]$/, '');

                acc.push({
                    ...paper,
                    title: cleanTitle || '',
                    summary: cleanSummary,
                });

                return acc;
            }, []);

            const imageRes = await fetch("https://google.serper.dev/images", {
                method: "POST",
                headers: {
                    "X-API-KEY": process.env.SERPER_API_KEY || "",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ q: query }),
            });

            const imageData = await imageRes.json();
            const images =
                imageData?.images?.map((img: any, idx: number) => ({
                    url: img.imageUrl,
                    description: img.title || `Image ${idx + 1}`,
                })) || [];

            return {
                results: processedResults,
                images: images,
            };
        } catch (error) {
            console.error('Academic search error:', error);
            throw error;
        }
    },
});