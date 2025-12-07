'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Prompts page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-6 text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Failed to load prompts
        </h2>
        <p className="text-zinc-400 mb-6">
          We encountered an error while loading the prompts. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-purple-500/25"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
