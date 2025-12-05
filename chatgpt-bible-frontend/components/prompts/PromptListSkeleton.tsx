export default function PromptListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse"
        >
          <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-1 w-full"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 w-5/6"></div>
          <div className="flex gap-2 mb-3">
            <div className="h-6 bg-blue-200 rounded w-16"></div>
            <div className="h-6 bg-purple-200 rounded w-16"></div>
          </div>
          <div className="h-6 bg-green-200 rounded w-20"></div>
        </div>
      ))}
    </div>
  );
}
