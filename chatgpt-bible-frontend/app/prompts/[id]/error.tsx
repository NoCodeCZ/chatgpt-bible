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
    <div className="container mx-auto px-4 py-16 text-center max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Something went wrong
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Failed to load prompt. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
