"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="max-w-md rounded-xl border border-line-strong bg-surface p-6 text-center">
        <h1 className="text-lg font-semibold">Repositories konnten nicht geladen werden</h1>
        <p className="mt-2 text-sm text-muted">
          Die GitHub-API ist gerade nicht erreichbar oder das Rate-Limit ist erschöpft. Ohne GITHUB_TOKEN sind nur 60 Anfragen pro Stunde erlaubt. Bitte in ein paar Minuten erneut versuchen.
        </p>
        <button
          type="button"
          onClick={() => retry()}
          className="mt-5 rounded-md bg-fg px-4 py-2 text-sm font-medium text-canvas transition-opacity hover:opacity-80"
        >
          Erneut versuchen
        </button>
      </div>
    </main>
  );
}
