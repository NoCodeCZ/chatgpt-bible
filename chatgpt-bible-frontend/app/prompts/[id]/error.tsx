'use client';

import { useEffect } from 'react';

/**
 * Error Boundary for Prompt Detail Page
 *
 * Catches runtime errors (e.g., Directus API failures) and displays user-friendly message.
 * Provides retry option to attempt fetching again.
 *
 * Note: This is a Client Component as required by Next.js error boundaries.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Prompt detail error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-6 text-6xl">⚠️</div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Something went wrong
        </h1>
        <p className="text-lg text-zinc-400 mb-8">
          Failed to load prompt. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-purple-500/25"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
