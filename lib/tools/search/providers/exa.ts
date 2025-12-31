import Exa from 'exa-js';

import { SearchResults } from '@/lib/types';

import { BaseSearchProvider } from './base';

export class ExaSearchProvider extends BaseSearchProvider {
  async search(
    query: string,
    maxResults: number = 10,
    _searchDepth: 'basic' | 'advanced' = 'basic',
    includeDomains: string[] = [],
    excludeDomains: string[] = []
  ): Promise<SearchResults> {
    const apiKey = process.env.EXA_API_KEY;
    this.validateApiKey(apiKey, 'EXA');

    const exa = new Exa(apiKey);
    const exaResults = await exa.searchAndContents(query, {
      highlights: true,
      numResults: maxResults,
      includeDomains,
      excludeDomains,
    });

    const imageRes = await fetch("https://google.serper.dev/images", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query }),
    });

    if (!imageRes.ok) {
      throw new Error(`Network response was not ok: ${imageRes.status}`);
    }

    const imageData = await imageRes.json();
    console.log("Image data: ", imageData)
    const images =
      imageData?.images?.map((img: any, idx: number) => ({
        url: img.imageUrl,
        description: img.title || `Image ${idx + 1}`,
      })) || [];

    return {
      results: exaResults.results.map((result: any) => ({
        title: result.title,
        url: result.url,
        content: result.highlight || result.text,
      })),
      query,
      images,
      number_of_results: exaResults.results.length,
    };
  }
}
