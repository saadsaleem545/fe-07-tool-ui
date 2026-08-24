"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");

  const {
    messages,
    sendMessage,
    status,
    error,
    regenerate,
  } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || status === "streaming") return;

    const message = input.trim();

    setInput("");

    await sendMessage({
      text: message,
    });
  };

  const handleRetry = async () => {
    if (status === "streaming") return;

    await regenerate();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-6 sm:px-6 sm:py-10">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <div className="mb-2 text-sm font-medium text-cyan-400">
            FE-07 · Generative UI
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Tool Results Demo
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
            Ask the AI to inspect a website and watch the tool lifecycle.
          </p>
        </header>

        {/* Empty State */}
        {messages.length === 0 && !error && (
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-lg rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center sm:p-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-2xl">
                🌐
              </div>

              <h2 className="text-xl font-semibold">
                Ready to inspect a website?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Enter a public website URL and the AI will inspect its page
                metadata.
              </p>

              <button
                type="button"
                onClick={() => setInput("Inspect https://example.com")}
                className="mt-5 rounded-lg border border-slate-700 px-4 py-2 text-sm text-cyan-300 transition hover:border-cyan-500 hover:bg-cyan-500/10"
              >
                Try example.com
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <section className="flex-1 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`mb-2 text-xs font-semibold uppercase tracking-wider ${
                    message.role === "user"
                      ? "text-cyan-400"
                      : "text-purple-400"
                  }`}
                >
                  {message.role === "user" ? "You" : "AI"}
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <p
                          key={index}
                          className="whitespace-pre-wrap leading-7 text-slate-200"
                        >
                          {part.text}
                        </p>
                      );
                    }

                    if (part.type === "tool-inspectWebsite") {
                      if (part.state === "input-streaming") {
                        return (
                          <div
                            key={index}
                            className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4"
                          >
                            <div className="font-semibold text-yellow-300">
                              🔄 Inspecting website...
                            </div>

                            <p className="mt-2 text-sm text-yellow-100/70">
                              Preparing the website inspection tool.
                            </p>
                          </div>
                        );
                      }

                      if (part.state === "input-available") {
                        return (
                          <div
                            key={index}
                            className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4"
                          >
                            <div className="font-semibold text-blue-300">
                              🔍 Tool Input
                            </div>

                            <p className="mt-2 text-sm text-blue-100/70">
                              Inspecting:
                            </p>

                            <code className="mt-2 block break-all rounded-lg bg-slate-950 p-3 text-sm text-blue-200">
                              {(part.input as { url: string }).url}
                            </code>
                          </div>
                        );
                      }

                      if (part.state === "output-available") {
                        const result = part.output as {
                          url: string;
                          status: number;
                          title: string;
                          description: string;
                          success: boolean;
                        };

                        return (
                          <div
                            key={index}
                            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 sm:p-5"
                          >
                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <div className="font-semibold text-emerald-300">
                                  ✓ Website Inspection Complete
                                </div>

                                <div className="mt-1 break-all text-xs text-emerald-100/60">
                                  {result.url}
                                </div>
                              </div>

                              <div className="w-fit rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                                HTTP {result.status}
                              </div>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                              <div className="rounded-lg border border-slate-700 bg-slate-950/60 p-4">
                                <div className="text-xs uppercase text-slate-500">
                                  Page Title
                                </div>

                                <div className="mt-2 font-medium text-white">
                                  {result.title}
                                </div>
                              </div>

                              <div className="rounded-lg border border-slate-700 bg-slate-950/60 p-4">
                                <div className="text-xs uppercase text-slate-500">
                                  Description
                                </div>

                                <div className="mt-2 text-sm text-slate-300">
                                  {result.description}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      if (part.state === "output-error") {
                        return (
                          <div
                            key={index}
                            className="rounded-xl border border-red-500/30 bg-red-500/10 p-5"
                          >
                            <div className="font-semibold text-red-300">
                              ✕ Tool Execution Failed
                            </div>

                            <p className="mt-2 text-sm leading-6 text-red-100/70">
                              The website could not be inspected. Please check
                              the URL and try again.
                            </p>

                            <button
                              type="button"
                              onClick={handleRetry}
                              disabled={status === "streaming"}
                              className="mt-4 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Retry inspection
                            </button>
                          </div>
                        );
                      }
                    }

                    return null;
                  })}
                </div>
              </div>
            ))}

            {/* Loading / Skeleton */}
            {status === "streaming" && (
              <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-3 w-32 rounded bg-purple-300/20" />
                  <div className="h-3 w-full rounded bg-purple-300/10" />
                  <div className="h-3 w-3/4 rounded bg-purple-300/10" />
                </div>

                <div className="mt-3 text-sm text-purple-300">
                  AI is working...
                </div>
              </div>
            )}
          </section>
        )}

        {/* Chat Error */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-semibold text-red-300">
                  ✕ AI response failed
                </div>

                <p className="mt-1 text-sm leading-6 text-red-100/70">
                  The response was interrupted. Your previous message is still
                  here, so you can retry it.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRetry}
                disabled={status === "streaming"}
                className="w-full rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-2 sm:mt-8 sm:flex-row sm:gap-3 sm:p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Inspect https://example.com"
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-white outline-none placeholder:text-slate-600"
          />

          <button
            type="submit"
            disabled={status === "streaming" || !input.trim()}
            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "streaming" ? "Working..." : "Inspect"}
          </button>
        </form>
      </div>
    </main>
  );
}