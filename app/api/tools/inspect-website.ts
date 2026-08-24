import { z } from "zod";

export const inspectWebsiteTool = {
  description:
    "Inspect a website URL and return basic metadata such as title, description, and status.",

  inputSchema: z.object({
    url: z
      .string()
      .url()
      .describe("The full website URL to inspect, for example https://example.com"),
  }),

  execute: async ({ url }: { url: string }) => {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 FE-07-Tool-UI",
        },
      });

      if (!response.ok) {
        throw new Error(`Website returned HTTP ${response.status}`);
      }

      const html = await response.text();

      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const descriptionMatch = html.match(
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
      );

      const title = titleMatch?.[1]?.trim() || "No title found";
      const description =
        descriptionMatch?.[1]?.trim() || "No description found";

      return {
        url,
        status: response.status,
        title,
        description,
        success: true,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to inspect website"
      );
    }
  },
};