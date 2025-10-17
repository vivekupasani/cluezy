import { tool } from "ai";
import { z } from "zod";

export const pdfSearchTool = tool({
    description: "Search for PDF documents on Google using Serper API",
    parameters: z.object({
        query: z.string().describe("The query used to find PDFs"),
        type: z.string().describe("The file type which needs to search")
    }),
    execute: async ({ query }) => {
        try {
            console.log("📄 Using PDF Search Tool...");

            const inputQuery = `${query} filetype:pdf`;

            const response = await fetch("https://google.serper.dev/search", {
                method: "POST",
                headers: {
                    "X-API-KEY": process.env.SERPER_API_KEY || "",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ q: inputQuery }),
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }

            const data = await response.json();

            console.log("PDF RESPONSE : ", data)

            return {
                result: data,
            };
        } catch (error: any) {
            console.error("Error in pdfSearchTool:", error);
            return {
                result: { error: error.message || "Unknown error" },
            };
        }
    },
});

export function createFileSearchTool(fileType: string) {
    return tool({
        description: "Search for specific file type on Google using Serper API",
        parameters: z.object({
            query: z.string().describe("The query used to find PDFs"),
        }),
        execute: async ({ query }) => {
            try {
                console.log(`📄 Using FILE (${fileType}) Search Tool...`);

                const inputQuery = `${query} filetype:${fileType}`;

                const response = await fetch("https://google.serper.dev/search", {
                    method: "POST",
                    headers: {
                        "X-API-KEY": process.env.SERPER_API_KEY || "",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ q: inputQuery }),
                });

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }

                const data = await response.json();

                console.log("PDF RESPONSE : ", data)

                return {
                    result: data,
                };
            } catch (error: any) {
                console.error("Error in pdfSearchTool:", error);
                return {
                    result: { error: error.message || "Unknown error" },
                };
            }
        },
    });
}
