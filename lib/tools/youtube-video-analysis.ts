import { tool } from 'ai';
import { getSubtitles, getVideoDetails } from 'youtube-caption-extractor';
import { z } from 'zod';

interface ActualVideoDetails {
    title?: string;
    description?: string;
    subtitles?: any[];
    // Add other fields that are actually returned by getVideoDetails
}

interface VideoAnalysisResult {
    videoId: string;
    url: string;
    details?: {
        title?: string;
        description?: string;
        thumbnail_url?: string;
        provider_name?: string;
        provider_url?: string;
    };
    captions?: string;
    timestamps?: string[];
    summary?: string;
    publishedDate?: string;
    analysis: {
        hasCaptions: boolean;
        hasTimestamps: boolean;
        captionLength?: number;
        timestampCount?: number;
        error?: string;
    };
}

interface SubtitleFragment {
    start: string;
    dur: string;
    text: string;
}

export const youtubeVideoAnalysisTool = tool({
    description: 'Get detailed analysis of a specific YouTube video including captions, timestamps, and full metadata. Use when user provides a specific YouTube URL.',
    parameters: z.object({
        videoUrl: z.string().describe('The specific YouTube video URL to analyze'),
    }),
    execute: async ({ videoUrl }: { videoUrl: string }) => {
        try {
            console.log("🔬 USING YOUTUBE VIDEO ANALYSIS TOOL - Detailed analysis");

            // Extract video ID from various YouTube URL formats
            const videoIdMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
            const videoId = videoIdMatch?.[1];

            if (!videoId) {
                throw new Error('Invalid YouTube URL. Please provide a valid YouTube video URL.');
            }

            console.log(`🎬 Analyzing YouTube video: ${videoId}`);
            console.log(`📺 Video URL: ${videoUrl}`);

            const baseResult: VideoAnalysisResult = {
                videoId,
                url: `https://www.youtube.com/watch?v=${videoId}`,
                analysis: {
                    hasCaptions: false,
                    hasTimestamps: false,
                },
            };

            try {
                // Fetch video details and subtitles in parallel
                console.log(`📹 Fetching video details and captions for ${videoId}...`);

                const [details, subs] = await Promise.all([
                    getVideoDetails({ videoID: videoId, lang: 'en' }).catch((e: unknown) => {
                        console.warn(`⚠️ getVideoDetails failed for ${videoId}:`, e);
                        return null;
                    }),
                    getSubtitles({ videoID: videoId, lang: 'en' }).catch((e: unknown) => {
                        console.warn(`⚠️ getSubtitles failed for ${videoId}:`, e);
                        return null;
                    })
                ]);

                console.log("Details of video: " + JSON.stringify(details))

                // Extract transcript text
                let transcriptText: string | undefined = undefined;

                // Prefer subtitles from details if available, then fallback to direct fetch
                if (details && Array.isArray(details.subtitles) && details.subtitles.length > 0) {
                    transcriptText = details.subtitles.map((s: any) => s.text).join('\n');
                    console.log(`✅ Got captions from details: ${transcriptText.length} characters`);
                } else if (subs && Array.isArray(subs) && subs.length > 0) {
                    transcriptText = subs.map((s: any) => s.text).join('\n');
                    console.log(`✅ Got captions from API: ${transcriptText.length} characters`);
                } else {
                    console.log(`❌ No captions available for ${videoId}`);
                }

                // Extract chapters from description
                const extractChaptersFromDescription = (description: string | undefined): string[] | undefined => {
                    if (!description) return undefined;
                    const lines = description.split(/\r?\n/);
                    const chapterRegex = /^\s*((?:\d+:)?\d{1,2}:\d{2})\s*[\-|–|—]?\s*(.+)$/i;
                    const chapters: string[] = [];
                    for (const line of lines) {
                        const match = line.match(chapterRegex);
                        if (match) {
                            const time = match[1];
                            const title = match[2].trim();
                            if (time && title) chapters.push(`${time} - ${title}`);
                        }
                    }
                    return chapters.length > 0 ? chapters : undefined;
                };

                // Generate chapters from subtitles
                const generateChaptersFromSubtitles = (
                    subs: SubtitleFragment[] | undefined,
                    targetCount: number = 10
                ): string[] | undefined => {
                    if (!subs || subs.length === 0) return undefined;
                    const parseSeconds = (s: string) => Number.isFinite(Number(s)) ? Number(s) : 0;
                    const lastSub = subs[subs.length - 1];
                    const totalDurationSec = Math.max(0, parseSeconds(lastSub.start) + parseSeconds(lastSub.dur));
                    if (totalDurationSec <= 1) return undefined;

                    const interval = Math.max(30, Math.floor(totalDurationSec / targetCount));
                    const chapters: string[] = [];
                    const usedTimes = new Set<number>();

                    for (let t = interval; t < totalDurationSec; t += interval) {
                        const idx = subs.findIndex((sf) => parseSeconds(sf.start) >= t);
                        const chosen = idx >= 0 ? subs[idx] : subs[subs.length - 1];
                        const text = chosen.text?.replace(/\s+/g, ' ').trim();
                        if (!text || text.length < 5) continue;

                        const key = Math.floor(parseSeconds(chosen.start));
                        if (usedTimes.has(key)) continue;
                        usedTimes.add(key);

                        const seconds = Math.max(1, key);
                        const h = Math.floor(seconds / 3600);
                        const m = Math.floor((seconds % 3600) / 60);
                        const s = seconds % 60;
                        const pad = (n: number) => n.toString().padStart(2, '0');
                        const timeString = h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
                        chapters.push(`${timeString} - ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
                        if (chapters.length >= targetCount) break;
                    }
                    return chapters.length > 0 ? chapters : undefined;
                };

                // Get timestamps
                let timestamps: string[] | undefined = undefined;
                if (details?.description) {
                    timestamps = extractChaptersFromDescription(details.description);
                }

                if (!timestamps) {
                    const subtitleData = (details?.subtitles as SubtitleFragment[]) || (subs as SubtitleFragment[]);
                    if (subtitleData && subtitleData.length > 0) {
                        timestamps = generateChaptersFromSubtitles(subtitleData, 8);
                    }
                }

                // Build the final result
                const processedVideo: VideoAnalysisResult = {
                    ...baseResult,
                    details: {
                        title: details?.title || 'Unknown Title',
                        description: details?.description,
                        thumbnail_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                        provider_name: 'YouTube',
                        provider_url: 'https://www.youtube.com',
                    },
                    captions: transcriptText,
                    timestamps,
                    analysis: {
                        hasCaptions: !!transcriptText,
                        hasTimestamps: !!(timestamps && timestamps.length > 0),
                        captionLength: transcriptText?.length,
                        timestampCount: timestamps?.length,
                    },
                };

                return processedVideo;

            } catch (processingError) {
                console.error(`💥 Error processing video ${videoId}:`, processingError);
                return {
                    ...baseResult,
                    analysis: {
                        hasCaptions: false,
                        hasTimestamps: false,
                        error: processingError instanceof Error ? processingError.message : 'Unknown processing error'
                    }
                };
            }

        } catch (error) {
            console.error('YouTube video analysis error:', error);
            throw error;
        }
    },
});
