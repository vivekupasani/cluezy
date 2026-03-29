import { tool } from "ai";
import { z } from "zod";

export function createAppsTool(selectedApps: any[]) {
    return tool({
        description: "Returns the list of selected apps",
        parameters: z.object({}),
        execute: async () => {
            return
        }
    })
}