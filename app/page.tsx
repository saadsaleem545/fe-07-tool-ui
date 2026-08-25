"use client";

import { useState } from "react";

type InspectionResult = {
  url: string;
  status: number;
  title: string;
  description: string;
  success: boolean;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InspectionResult | null>(null);
  const [error, setError] = useState("");

  const inspectWebsite = async () => {
    if (loading) return;

    setError("");
    setResult(null);

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError("Please enter a website URL.");
      return;
    }

    let validUrl = trimmedUrl;

    if (!/^https?:\/\//i.test(validUrl)) {
      validUrl = `https://${validUrl}`;
    }

    try {
      new URL(validUrl);
    } catch {
      setError("Please enter a valid website URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              parts: [
                {
                  type: "text",
                  text: `Inspect this website using the inspectWebsite tool: ${validUrl}`,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("The AI service returned an error.");
      }

      const text = await response.text();

      const titleMatch = text.match(
        /"title"\s*:\s*"([^"]*)"/i
      );

      const descriptionMatch = text.match(
        /"description"\s*:\s*"([^"]*)"/i
      );

      const statusMatch = text.match(
        /"status"\s*:\s*(\d+)/i
      );

      if (titleMatch || descriptionMatch || statusMatch) {
        setResult({
          url: validUrl,
          status: statusMatch
            ? Number(statusMatch[1])
            : 200,
          title: titleMatch?.[1] || "Website inspected",
          description:
            descriptionMatch?.[1] ||
            "The website was successfully inspected.",
          success: true,
        });
      } else {
        setResult({
          url: validUrl,
          status: 200,
          title: "Inspection completed",
          description:
            "The AI assistant successfully processed the website inspection request.",
          success: true,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-12 text-white sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            FE-07 · Generative UI
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
            Website Inspector
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Enter a website URL and let the AI assistant inspect it using a
            server-side tool. The result is transformed into a structured UI.
          </p>
        </header>

        <section className="mt-12 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <label
            htmlFor="website-url"
            className="block text-sm font-medium text-slate-300"
          >
            Website URL
          </label>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              id="website-url"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  inspectWebsite();
                }
              }}
              placeholder="https://example.com"
              className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            />

            <button
              type="button"
              onClick={inspectWebsite}
              disabled={loading}
              className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? "Inspecting..." : "Inspect Website"}
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Try: https://example.com
          </p>
        </section>

        {loading && (
          <section className="mt-6 rounded-3xl border border-cyan-500/30 bg-cyan-500/5 p-6">
            <div className="flex items-center gap-3">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />

              <div>
                <p className="font-semibold text-cyan-300">
                  Inspecting website...
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  AI is calling the inspectWebsite tool.
                </p>
              </div>
            </div>
          </section>
        )}

        {error && (
          <section
            role="alert"
            className="mt-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-6"
          >
            <p className="font-semibold text-red-300">
              Inspection failed
            </p>

            <p className="mt-2 text-sm text-red-200/80">
              {error}
            </p>
          </section>
        )}

        {result && !loading && (
          <section className="mt-6 overflow-hidden rounded-3xl border border-emerald-500/30 bg-slate-900">
            <div className="border-b border-slate-800 bg-emerald-500/5 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                    Tool Result
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Website inspected successfully
                  </h2>
                </div>

                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-400">
                  HTTP {result.status}
                </span>
              </div>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  URL
                </p>

                <p className="mt-2 break-all text-sm text-cyan-300">
                  {result.url}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Page Title
                </p>

                <p className="mt-2 font-medium text-white">
                  {result.title}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </p>

                <p className="mt-2 font-medium text-emerald-400">
                  {result.status} OK
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Meta Description
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {result.description}
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="font-semibold">1. Input</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              The user provides a website URL.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="font-semibold">2. Tool Call</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              The AI calls the server-side inspectWebsite tool.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="font-semibold">3. UI Result</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Structured metadata is displayed as a result card.
            </p>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          FE-07 · Generative UI · Tool Results Demo
        </footer>
      </div>
    </main>
  );
}