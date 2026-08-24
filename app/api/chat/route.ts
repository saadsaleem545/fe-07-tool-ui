import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, tool } from "ai";
import { inspectWebsiteTool } from "../tools/inspect-website";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google("gemini-3.6-flash"),

      system: `
You are a website inspection assistant.

When the user gives you a website URL and asks you to inspect it,
you MUST use the inspectWebsite tool.

After receiving the tool result, explain the findings clearly.
Do not output raw JSON to the user.
`,

      messages: await convertToModelMessages(messages),

      tools: {
        inspectWebsite: tool(inspectWebsiteTool),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    return new Response(
      JSON.stringify({
        error: "Something went wrong while processing the request.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}