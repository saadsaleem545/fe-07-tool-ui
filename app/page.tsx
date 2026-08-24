"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    await sendMessage({
      text: input,
    });

    setInput("");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-10">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-2 text-sm font-medium text-cyan-400">
            FE-07 · Generative UI
          </div>

          <h1 className="text-4xl font-bold tracking-tight">
            Tool Results Demo
          </h1>

          <p className="mt-3 text-slate-400">
            Ask the AI to inspect a website and watch the tool lifecycle.
          </p>
        </header>

        {/* Messages */}
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

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
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
                          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-emerald-300">
                                ✓ Website Inspection Complete
                              </div>

                              <div className="mt-1 text-xs text-emerald-100/60">
                                {result.url}
                              </div>
                            </div>

                            <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
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

                          <p className="mt-2 text-sm text-red-100/70">
                            The website could not be inspected. Please check
                            the URL and try again.
                          </p>
                        </div>
                      );
                    }
                  }

                  return null;
                })}
              </div>
            </div>
          ))}

          {status === "streaming" && (
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
              <div className="text-sm text-purple-300">
                AI is working...
              </div>
            </div>
          )}
        </section>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Inspect https://example.com"
            className="flex-1 bg-transparent px-3 py-3 text-white outline-none placeholder:text-slate-600"
          />

          <button
            type="submit"
            disabled={status === "streaming"}
            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Inspect
          </button>
        </form>
      </div>
    </main>
  );
}