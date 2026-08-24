import { z } from "zod";

export const fetchMetaTags = {
  description:
    "Fetch the title, description, and Open Graph image from a website URL.",

  inputSchema: z.object({
    url: z
      .string()
      .url()
      .describe("The complete website URL, including https://"),
  }),

  execute: async ({ url }: { url: string }) => {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      });

      if (!response.ok) {
        throw new Error(`Website returned HTTP ${response.status}`);
      }

      const html = await response.text();

      const getMetaContent = (pattern: RegExp) => {
        const match = html.match(pattern);
        return match?.[1] ?? null;
      };

      const title =
        getMetaContent(/<title[^>]*>([\s\S]*?)<\/title>/i)?.trim() ?? null;

      const description =
        getMetaContent(
          /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
        ) ?? null;

      const image =
        getMetaContent(
          /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i
        ) ?? null;

      return {
        url,
        title,
        description,
        image,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch website metadata."
      );
    }
  },
};