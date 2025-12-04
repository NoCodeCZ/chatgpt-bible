/**
 * Prompt Detail Loading Skeleton
 *
 * Displays a loading placeholder while Server Component fetches prompt data.
 * Matches the layout structure of PromptDetail component.
 *
 * Features:
 * - Pulse animation for loading effect
 * - Matches content layout (title, description, metadata, prompt block, button)
 * - Responsive sizing
 * - Gray color scheme for skeleton elements
 */
export default function PromptDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="h-12 bg-gray-300 rounded w-3/4"></div>

      {/* Description skeleton */}
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-full"></div>
        <div className="h-6 bg-gray-200 rounded w-5/6"></div>
      </div>

      {/* Metadata skeleton */}
      <div className="flex gap-4">
        <div className="h-8 bg-blue-200 rounded-full w-24"></div>
        <div className="h-8 bg-purple-200 rounded-full w-24"></div>
        <div className="h-8 bg-green-200 rounded-full w-20"></div>
      </div>

      {/* Prompt text skeleton */}
      <div className="mt-8">
        <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-11/12"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-10/12"></div>
          </div>
        </div>
      </div>

      {/* Button skeleton */}
      <div className="h-14 bg-blue-300 rounded-lg w-full md:w-48"></div>
    </div>
  );
}
