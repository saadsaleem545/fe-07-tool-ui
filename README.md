# FE-07 — Generative UI Tool Results Demo

A Generative UI website inspection application built with **Next.js, React, AI SDK, Google Gemini, Zod, TypeScript, and Tailwind CSS**.

The application allows a user to provide a website URL. Google Gemini can call a server-side `inspectWebsite` tool, which validates the URL, fetches the website, extracts basic metadata, and returns a structured result that is rendered as a readable UI instead of exposing raw tool JSON.

---

## Live Demo

**Production URL:** To be added after deployment.

**GitHub Repository:**  
https://github.com/saadsaleem545/fe-07-tool-ui

---

## Project Overview

This project demonstrates the core concepts of **Generative UI and AI tool calling**.

Instead of simply returning text from an AI model, the application allows the AI to use a server-side tool and then transforms the structured tool result into a user-friendly interface.

The project demonstrates:

- AI model integration
- Server-side tool execution
- Tool input validation with Zod
- Generative UI concepts
- Structured tool results
- Loading states
- Success states
- Error handling
- Streaming AI responses
- Automated frontend testing
- Server-side request validation

---

## Features

- AI-powered website inspection
- Google Gemini integration through AI SDK
- Server-side `inspectWebsite` tool
- Zod URL validation
- Website metadata extraction
- HTTP status detection
- Page title extraction
- Meta description extraction
- Structured tool result UI
- Loading state while the tool is executing
- Success result state
- Error state
- Responsive Tailwind CSS interface
- Server-side environment variables
- Request size limits
- Maximum message limits
- Streaming timeout protection
- Automated Vitest tests
- TypeScript support

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework and application routing |
| React 19 | User interface |
| TypeScript | Type safety |
| AI SDK | AI streaming and tool calling |
| Google Gemini | AI model |
| Zod | Runtime input validation |
| Tailwind CSS | UI styling |
| Vitest | Automated testing |
| Testing Library | Component testing |

---

# How It Works

The application follows this flow:

```text
User
  |
  v
Website Inspector UI
  |
  v
/api/chat
  |
  v
Google Gemini
  |
  +----------------------+
  |                      |
  | Website inspection   |
  | required             |
  v                      |
inspectWebsite tool      |
  |                      |
  v                      |
Fetch website            |
  |
  v
Extract metadata
  |
  +--> URL
  +--> HTTP status
  +--> Page title
  +--> Meta description
  |
  v
Structured tool result
  |
  v
Generative UI



Step-by-step
The user enters a website URL.
The frontend sends the request to /api/chat.
The server converts the UI messages into model messages.
Google Gemini processes the request.
When website inspection is required, Gemini calls inspectWebsite.
The tool receives the website URL.
Zod validates the URL.
The tool performs the website request server-side.
The HTML response is inspected.
The tool extracts the page title and meta description.
The structured result is returned to the AI workflow.
The frontend displays the result as a structured UI card.
Server-Side Tool
inspectWebsite

The main tool is located at:

app/api/tools/inspect-website.ts

The tool is responsible for inspecting a website and returning structured metadata.

Tool description
Inspect a website URL and return basic metadata such as title,
description, and status.
Input schema

The tool uses Zod to validate its input:

{
  url: string;
}

The URL must be a valid URL.

Example:

https://example.com
Tool result

A successful inspection returns structured data similar to:

{
  url: "https://example.com",
  status: 200,
  title: "Example Domain",
  description: "Example website description",
  success: true
}

The result is then displayed through the application's UI.

AI Route

The AI route is located at:

app/api/chat/route.ts

The route:

Validates incoming messages
Limits the number of messages
Limits message size
Converts UI messages into model messages
Connects to Google Gemini
Registers the inspectWebsite tool
Streams the AI response
Returns a UI message stream

The AI model currently used is:

Gemini 3.6 Flash

The route also defines:

export const maxDuration = 30;

This prevents unnecessarily long-running streaming requests.

Request Protection

The application includes basic server-side request protection.

Maximum messages

A request can contain a maximum of:

20 messages

Requests exceeding this limit receive:

400 Bad Request
Maximum message length

Each message is limited to:

4,000 characters

This helps prevent unnecessarily large requests from being sent to the AI model.

Streaming timeout

The API route uses:

export const maxDuration = 30;

This limits the maximum execution duration of the streaming request.

Generative UI

The key concept demonstrated by this project is Generative UI.

Traditional AI applications often display tool results as raw JSON.

For example:

{
  "url": "https://example.com",
  "status": 200,
  "title": "Example Domain"
}

This project instead transforms the structured data into a visual result card containing:

Website URL
HTTP status
Page title
Meta description
Success state

This makes the tool result easier for users to understand.

UI States

The application demonstrates multiple interface states.

Idle

The user sees:

Inspect Website

and can submit a website for inspection.

Loading

While the request is being processed, the interface displays a loading state and prevents duplicate requests.

Success

After a successful inspection, the application displays:

Website inspected successfully

along with the structured website metadata.

Error

If the request fails, the application displays an error message instead of crashing.

Environment Variables

Create a .env.local file in the project root:

GOOGLE_GENERATIVE_AI_API_KEY=your_google_generative_ai_api_key

The API key is used only on the server.

Never commit .env.local or expose the API key in client-side code.

Environment variable
Variable	Required	Purpose
GOOGLE_GENERATIVE_AI_API_KEY	Yes	Authenticates Google Gemini requests
Installation
1. Clone the repository
git clone https://github.com/saadsaleem545/fe-07-tool-ui.git
2. Enter the project directory
cd fe-07-tool-ui
3. Install dependencies
npm install
4. Configure environment variables

Create:

.env.local

Add:

GOOGLE_GENERATIVE_AI_API_KEY=your_google_generative_ai_api_key
5. Start the development server
npm run dev

Open:

http://localhost:3000
Testing

The project uses Vitest and Testing Library.

Run the test suite:

npm test

For a single test run:

npm run test:run
Latest verified test result
Test Files  1 passed (1)
Tests       6 passed (6)

All six automated tests are currently passing.

Tested behavior

The test suite verifies:

Website Inspector idle state
Empty URL error handling
Loading state
Successful API response
Failed API request
Keyboard focus accessibility
Production Build

To verify the production build:

npm run build

Start the production server:

npm start

The production build should be verified before deployment.

Project Structure
fe-07-tool-ui/
|
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts
│   │   │
│   │   └── tools/
│   │       └── inspect-website.ts
│   │
│   ├── error.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── page.test.tsx
│   └── ...
│
├── components/
│
├── public/
│
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
Important Files
app/page.tsx

Contains the main Website Inspector interface.

Responsibilities include:

URL input
Inspect Website button
Loading state
Error state
Structured inspection result
Responsive UI
app/api/chat/route.ts

Handles:

AI requests
Google Gemini integration
Tool registration
Message conversion
Request validation
Streaming responses
Request limits
app/api/tools/inspect-website.ts

Contains the server-side website inspection tool.

Responsibilities include:

Zod URL validation
Website fetching
HTTP status handling
HTML processing
Title extraction
Meta description extraction
Structured result generation
app/page.test.tsx

Contains automated tests for the Website Inspector UI and its different states.

Design Decisions
Why server-side tools?

The website inspection logic runs on the server.

This prevents unnecessary exposure of server-side implementation details and keeps external website requests away from the browser.

Why Zod?

Zod provides runtime validation for tool inputs.

This ensures that the tool receives a properly formatted website URL before attempting the request.

Why streaming?

Streaming allows AI responses to be delivered progressively instead of waiting for the entire response before updating the interface.

Why Generative UI?

Generative UI allows structured AI/tool output to be transformed into interface components.

Instead of showing raw JSON, the application presents useful information such as:

Website
HTTP Status
Page Title
Meta Description

This creates a more understandable AI-powered user experience.

AI-Assisted Development

AI tools were used as development assistants during the project.

They helped with:

Understanding AI SDK concepts
Understanding server-side tool calling
Debugging Next.js and TypeScript issues
Designing the inspectWebsite tool
Creating Zod validation
Improving loading and error states
Creating automated tests
Reviewing request validation
Improving project documentation

All generated suggestions were reviewed, adapted, and tested against the actual project implementation.

Assignment Requirements

This project demonstrates the major requirements of the FE-07 Generative UI assignment:

 Server-side AI tool
 Zod input schema
 Tool execution function
 AI tool registration
 Tool lifecycle/loading state
 Structured tool result
 Result rendered as UI
 User interaction
 Error handling
 Automated tests
 README documentation
Production Checklist

Before final deployment:

 Server-side AI route implemented
 Server-side tool implemented
 Zod validation implemented
 Request size limits implemented
 Streaming timeout configured
 Loading state implemented
 Success state implemented
 Error state implemented
 Automated tests passing
 Production build verified
 Production environment variable configured
 Vercel deployment completed
 Production URL verified
 Mobile testing completed
 Cross-browser testing completed
 Final screenshots added
Screenshots

Screenshots can be added here after the final UI verification.

Recommended screenshots:

Website Inspector idle state
Website inspection loading state
Successful inspection result
Error state

Example structure:

screenshots/
├── idle-state.png
├── loading-state.png
├── success-state.png
└── error-state.png
Repository

GitHub Repository:

https://github.com/saadsaleem545/fe-07-tool-ui

License

This project was created as part of the Frontend AI Engineering — FE-07 Generative UI assignment and is intended for educational and portfolio purposes.