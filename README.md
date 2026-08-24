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




## FE-AA1 — Buttons with a Brain

### Motion & State Choices

The button uses short, smooth transitions so each state change feels intentional instead of abrupt.

Normal hover, focus, and state transitions use around 200–300ms. This keeps the interface responsive while still making changes noticeable.

Loading, success, and error states provide clear feedback so the user can understand what is happening. The interaction also prevents repeated clicks while an action is running and provides visible keyboard focus feedback.

The goal was to make the button communicate its current state clearly instead of simply changing its text or color instantly.
