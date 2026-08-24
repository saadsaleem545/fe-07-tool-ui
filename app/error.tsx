"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-2xl">
          !
        </div>

        <h1 className="text-2xl font-semibold">
          Something went wrong
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          We couldn't load this page. You can try again without losing your
          current session.
        </p>

        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
        >
          Try again
        </button>
      </div>
    </main>
  );
}