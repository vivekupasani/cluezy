import { tool } from "ai";
import z from "zod";

export const FinanceSearchTool = tool({
    description: "Search the web for finance releted information",
    parameters: z.object({}),
    execute: async () => {
        try {
            console.log("🔬 USING FINANCE INFORMATION SEARCH TOOL");

        } catch (error) {
            console.error('Finance Search Tool error:', error);
            throw error;
        }
    }
})