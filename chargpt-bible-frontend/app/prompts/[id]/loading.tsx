import PromptDetailSkeleton from '@/components/prompts/PromptDetailSkeleton';

/**
 * Loading UI for Prompt Detail Page
 *
 * Automatically displayed by Next.js while page.tsx Server Component is fetching.
 * Shows skeleton placeholder matching the prompt detail layout.
 */
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PromptDetailSkeleton />
    </div>
  );
}
