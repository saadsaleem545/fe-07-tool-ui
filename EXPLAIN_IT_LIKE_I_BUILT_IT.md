# Explain It Like You Built It

## How My Website Inspection Tool Works

I built a website inspection feature where a user can enter a website URL, such as https://example.com, and ask the AI to inspect it.

When I click the Inspect button, the message is sent from the frontend to my `/api/chat` route. The AI can then use my `inspectWebsite` tool to inspect the website.

The tool fetches the website and gets basic information such as the HTTP status, page title, and description. The result is then sent back to the frontend.

On the frontend, I created different UI states for the tool. While the tool is working, the user sees a loading state. If the inspection succeeds, a green result card shows the website information. If something fails, a red error state is shown with a Retry button.

I also learned that building an AI feature is not only about getting an AI response. I have to handle loading, success, empty, and error states so the application is useful when something goes wrong.

Finally, I pushed the project to GitHub and deployed it with Vercel so that the application is available through a public URL.
