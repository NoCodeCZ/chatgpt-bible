import Link from 'next/link';

/**
 * 404 Not Found Page for Prompt Detail Route
 *
 * Displayed when:
 * - Invalid ID format (non-numeric)
 * - Non-existent prompt ID
 * - Prompt status is not 'published'
 *
 * Provides user-friendly message and navigation back to prompt library.
 */
export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Prompt Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        The prompt you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/prompts"
        className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        Back to Prompt Library
      </Link>
    </div>
  );
}
