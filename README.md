# FE-07 · Generative UI

## Tool Results Demo

A Generative UI demo built with Next.js, AI SDK, Google Gemini, Zod, and Tailwind CSS.

The application allows an AI assistant to inspect a website and render the tool lifecycle as structured UI components.

## Features

- Server-side AI tool
- Zod input validation
- Website metadata inspection
- Structured tool results
- Tool lifecycle UI states
- Success result card
- Designed tool error state
- Streaming AI responses

## Tool Contract

### Tool Name

`inspectWebsite`

### Purpose

Inspects a website URL and returns basic metadata.

### Input Schema

{
  url: string;
}