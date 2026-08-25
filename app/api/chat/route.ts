import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, tool } from "ai";
import { inspectWebsiteTool } from "../tools/inspect-website";

// Prevent unnecessarily long-running streaming requests.
export const maxDuration = 30;

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body?.messages;

    // Basic request validation.
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Prevent oversized requests from consuming excessive AI resources.
    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({
          error: `Too many messages. Maximum allowed is ${MAX_MESSAGES}.`,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    for (const message of messages) {
      if (!message || typeof message !== "object") {
        return new Response(
          JSON.stringify({ error: "Invalid message format." }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const text =
        typeof message.content === "string"
          ? message.content
          : JSON.stringify(message.parts ?? "");

      if (text.length > MAX_MESSAGE_LENGTH) {
        return new Response(
          JSON.stringify({
            error: `Message is too long. Maximum allowed length is ${MAX_MESSAGE_LENGTH} characters.`,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

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