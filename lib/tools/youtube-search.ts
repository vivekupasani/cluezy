import { tool } from 'ai';
import Exa from 'exa-js';
import { z } from 'zod';

interface VideoSearchResult {
    videoId: string;
    url: string;
    title?: string;
    thumbnail_url?: string;
    author_name?: string;
    publishedDate?: string;
    description?: string;
}

export const youtubeSearchTool = tool({
    description: 'Search YouTube videos using Exa AI. Returns basic video information for search results.',
    parameters: z.object({
        query: z.string().describe('The search query for YouTube videos'),
        timeRange: z.enum(['day', 'week', 'month', 'year', 'anytime']).default('anytime'),
        maxResults: z.number().min(1).max(10).default(5),
    }),
    execute: async ({
        query,
        timeRange,
        maxResults = 5,
    }: {
        query: string;
        timeRange: 'day' | 'week' | 'month' | 'year' | 'anytime';
        maxResults: number;
    }) => {
        try {
            console.log("🔍 USING YOUTUBE SEARCH TOOL - Basic search");
            const exa = new Exa(process.env.EXA_API_KEY);

            console.log('Search query:', query);
            console.log('Time range:', timeRange);
            console.log('Max results:', maxResults);

            let startDate: string | undefined;
            let endDate: string | undefined;

            const now = new Date();
            const formatDate = (date: Date) => date.toISOString().split('T')[0];

            switch (timeRange) {
                case 'day':
                    startDate = formatDate(new Date(now.getTime() - 24 * 60 * 60 * 1000));
                    endDate = formatDate(now);
                    break;
                case 'week':
                    startDate = formatDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
                    endDate = formatDate(now);
                    break;
                case 'month':
                    startDate = formatDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
                    endDate = formatDate(now);
                    break;
                case 'year':
                    startDate = formatDate(new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000));
                    endDate = formatDate(now);
                    break;
                case 'anytime':
                    // Don't set dates for anytime
                    break;
            }

            const searchOptions: any = {
                type: 'auto',
                numResults: maxResults,
                includeDomains: ['youtube.com', 'youtu.be', 'm.youtube.com'],
            };

            if (startDate) {
                searchOptions.startPublishedDate = startDate;
            }
            if (endDate) {
                searchOptions.endPublishedDate = endDate;
            }

            console.log('📅 Search date range:', { timeRange, startDate, endDate });

            const searchResult = await exa.searchAndContents(query, searchOptions);

            console.log('🎥 YouTube Search Results found:', searchResult.results.length);

            // Process results to extract basic video information
            const processedResults: VideoSearchResult[] = searchResult.results.map((result: any) => {
                const videoIdMatch = result.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
                const videoId = videoIdMatch?.[1];

                return {
                    videoId: videoId || 'unknown',
                    url: result.url,
                    title: result.title,
                    description: result.text?.substring(0, 200) + '...', // Truncate description
                    publishedDate: result.publishedDate,
                    thumbnail_url: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined,
                };
            });

            console.log(`✅ YouTube Search Complete: ${processedResults.length} videos found`);
            console.log("YOUTUBE RESPONSE : ", processedResults)
            return {
                results: processedResults,
                searchSummary: {
                    query,
                    timeRange,
                    totalResults: processedResults.length,
                },
            };
        } catch (error) {
            console.error('YouTube search error:', error);
            throw error;
        }
    },
});