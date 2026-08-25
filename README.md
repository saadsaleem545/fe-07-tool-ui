# FE-07 — Generative UI Tool Results Demo

A production-ready Generative UI demo built with **Next.js, React, AI SDK, Google Gemini, Zod, and Tailwind CSS**.

The application provides an AI-powered website inspection assistant. Users can ask the assistant to inspect a website, the AI calls a server-side tool, and the tool result is rendered as structured UI instead of exposing raw JSON.

## Live Demo

**Production URL:** Add the deployed Vercel URL here after deployment.

## Features

* AI-powered website inspection assistant
* Google Gemini integration through the AI SDK
* Server-side `inspectWebsite` tool
* Zod-based tool input validation
* Structured tool results rendered in the UI
* Tool lifecycle states
* Loading, success, and error states
* Streaming AI responses
* Responsive Tailwind CSS interface
* Server-side environment variable usage
* Request validation and input limits
* Streaming route timeout protection

## Tech Stack

| Technology    | Purpose                                 |
| ------------- | --------------------------------------- |
| Next.js 16    | React framework and application routing |
| React 19      | User interface                          |
| AI SDK        | AI streaming and tool calling           |
| Google Gemini | AI model                                |
| Zod           | Tool input validation                   |
| Tailwind CSS  | Styling                                 |
| TypeScript    | Type safety                             |
| Vitest        | Testing                                 |

## How It Works

The application follows this flow:

1. The user enters a request in the chat interface.
2. The request is sent to `/api/chat`.
3. The server converts the UI messages into model messages.
4. Google Gemini processes the request.
5. When a website needs to be inspected, Gemini calls the `inspectWebsite` tool.
6. The server validates the tool input with Zod.
7. The website metadata is inspected server-side.
8. The structured tool result is returned to the AI.
9. The AI explains the result to the user.
10. The interface renders the result as a readable UI component.

### Architecture

```text
User
  |
  v
Next.js UI
  |
  v
/api/chat
  |
  +----> Google Gemini
  |
  +----> inspectWebsite tool
              |
              v
        Website metadata
              |
              v
        Structured result
              |
              v
        Generative UI
```

## Tool Contract

### `inspectWebsite`

The `inspectWebsite` tool accepts a website URL and returns basic website metadata.

### Input

```ts
{
  url: string;
}
```

The URL is validated before the tool is executed.

## API Protection

The production chat route includes basic protection against oversized requests.

### Message limit

A request can contain a maximum of:

```text
20 messages
```

### Message size limit

Each message is limited to:

```text
4,000 characters
```

Requests exceeding these limits receive a `400 Bad Request` response instead of being sent to the AI model.

### Streaming timeout

The AI route defines:

```ts
export const maxDuration = 30;
```

This prevents a streaming request from running indefinitely.

These protections reduce the risk of trivial abuse and unnecessary AI API usage.

## Environment Variables

Create a local `.env.local` file:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_generative_ai_api_key
```

The API key is only used server-side and should never be committed to Git.

### Environment Variable Table

| Variable                       | Required | Purpose                                 |
| ------------------------------ | -------- | --------------------------------------- |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes      | Authenticates requests to Google Gemini |

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/saadsaleem545/fe-07-tool-ui.git
cd fe-07-tool-ui
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local`:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_generative_ai_api_key
```

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

To verify the project can be built for production:

```bash
npm run build
```

The production server can then be started with:

```bash
npm start
```

## Testing

Run the test suite with:

```bash
npm test
```

For a single test run:

```bash
npm run test:run
```

## Project Structure

```text
fe-07-tool-ui/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts
│   │   └── tools/
│   │       └── inspect-website.ts
│   ├── error.tsx
│   ├── layout.tsx
│   ├── page.test.tsx
│   └── page.tsx
├── components/
├── public/
├── package.json
├── tsconfig.json
└── README.md
```

### Important Files

**`app/page.tsx`**

Contains the main Generative UI experience and chat interface.

**`app/api/chat/route.ts`**

Handles AI requests, streaming responses, tool execution, request validation, and the 30-second streaming limit.

**`app/api/tools/inspect-website.ts`**

Contains the server-side website inspection tool and its validation logic.

**`components/`**

Contains reusable UI components used to render the application and tool results.

## Design Decisions

### Why server-side tools?

The website inspection tool runs on the server so that external requests and tool logic are not unnecessarily exposed to the browser.

### Why Zod?

Zod provides explicit runtime validation for tool inputs. This prevents malformed data from reaching the tool implementation.

### Why streaming?

Streaming allows the assistant response to appear progressively instead of making the user wait for the complete response.

### Why Generative UI?

Instead of displaying raw tool JSON, the application turns structured tool results into readable interface components. This makes the AI interaction easier to understand and demonstrates how AI output can directly drive UI.

## AI-Assisted Development

AI tools were used as development assistants throughout the project.

They helped with:

* Understanding the AI SDK and tool-calling workflow
* Debugging Next.js and TypeScript errors
* Designing the `inspectWebsite` tool structure
* Creating and refining Zod validation
* Improving loading, success, and error states
* Reviewing production-readiness issues
* Adding request-size limits and streaming timeout protection
* Improving documentation

The final implementation was reviewed and tested manually. AI-generated suggestions were adapted to the project's actual architecture rather than copied without verification.

## Production Checklist

Before considering the project production-ready:

* [x] Production build succeeds
* [x] TypeScript compilation succeeds
* [x] AI route is server-side
* [x] Tool input is validated
* [x] Request size is limited
* [x] Streaming duration is limited
* [ ] Production environment variable configured
* [ ] Production URL verified
* [ ] Cross-browser testing completed
* [ ] Mobile testing completed
* [ ] Final README reviewed

## Screenshots

Add screenshots of the running application here.

Recommended screenshots:

1. Main chat interface
2. Tool execution/loading state
3. Successful website inspection result
4. Error state

Example:

```text
screenshots/
├── chat-interface.png
├── tool-result.png
└── error-state.png
```

## Repository

**GitHub:**
https://github.com/saadsaleem545/fe-07-tool-ui

## License

This project was created as part of the Frontend AI Engineering track and is intended for educational and portfolio purposes.
