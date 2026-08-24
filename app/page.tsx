"use client";

import { useState } from "react";

type ButtonState = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [state, setState] = useState<ButtonState>("idle");

  const runGenerate = () => {
    if (state === "loading") return;

    setState("loading");

    const delay = 1200 + Math.random() * 1600;

    setTimeout(() => {
      const failed = Math.random() < 0.2;
      setState(failed ? "error" : "success");

      setTimeout(() => {
        setState("idle");
      }, 1600);
    }, delay);
  };

  const buttonLabel = {
    idle: "Generate",
    loading: "Generating...",
    success: "Generated!",
    error: "Try again",
  }[state];

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <section className="w-full max-w-xl text-center">
        <div className="mb-3 text-sm font-medium text-cyan-400">
          FE-AA1 · Buttons with a Brain
        </div>

        <h1 className="text-4xl font-bold tracking-tight">
          Motion & State Micro-interactions
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-slate-400">
          A button should communicate what is happening, not just look good.
          Try generating something below.
        </p>

        <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-10">
          <button
            type="button"
            onClick={runGenerate}
            disabled={state === "loading"}
            aria-live="polite"
            className={`
              group relative inline-flex min-w-44 items-center justify-center
              gap-2 overflow-hidden rounded-xl px-6 py-3.5
              font-semibold shadow-lg
              transition-all duration-300 ease-out
              focus:outline-none focus-visible:ring-2
              focus-visible:ring-cyan-400 focus-visible:ring-offset-2
              focus-visible:ring-offset-slate-900
              hover:-translate-y-0.5 hover:scale-[1.02]
              active:scale-95
              disabled:cursor-wait
              disabled:hover:translate-y-0
              disabled:hover:scale-100
              ${
                state === "idle"
                  ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                  : ""
              }
              ${
                state === "loading"
                  ? "bg-slate-700 text-slate-200"
                  : ""
              }
              ${
                state === "success"
                  ? "bg-emerald-400 text-slate-950"
                  : ""
              }
              ${
                state === "error"
                  ? "bg-red-500 text-white hover:bg-red-400"
                  : ""
              }
            `}
          >
            {state === "loading" && (
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-transparent"
                aria-hidden="true"
              />
            )}

            {state === "success" && (
              <span
                className="text-lg transition-transform duration-300"
                aria-hidden="true"
              >
                ✓
              </span>
            )}

            {state === "error" && (
              <span
                className="text-lg transition-transform duration-300"
                aria-hidden="true"
              >
                !
              </span>
            )}

            <span className="transition-all duration-300 ease-out">
              {buttonLabel}
            </span>
          </button>

          <div className="mt-6 text-sm text-slate-500">
            Current state:{" "}
            <span className="font-medium text-slate-300">{state}</span>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-left">
          <h2 className="font-semibold text-white">
            Motion decisions
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Transitions use a 300ms duration with an ease-out curve so state
            changes feel quick but intentional. Transform and opacity-friendly
            transitions are used instead of layout-heavy animation. The
            loading state prevents repeated clicks, while keyboard focus has a
            visible ring.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            The simulated request takes a random amount of time and has a 20%
            chance of failure, making both success and error states testable.
          </p>
        </div>
      </section>

      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}