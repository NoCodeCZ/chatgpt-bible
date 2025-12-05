import PromptListSkeleton from '@/components/prompts/PromptListSkeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <header className="mb-8">
        <div className="h-10 bg-gray-300 rounded w-64 mb-2 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-96 animate-pulse"></div>
      </header>

      <PromptListSkeleton />
    </div>
  );
}
