import PromptDetailSkeleton from '@/components/prompts/PromptDetailSkeleton';

/**
 * Loading UI for Prompt Detail Page
 *
 * Automatically displayed by Next.js while page.tsx Server Component is fetching.
 * Shows skeleton placeholder matching the prompt detail layout.
 */
export default function Loading() {
  return (
    <div className="relative min-h-screen bg-black">
      {/* Ambient Background (matches page.tsx) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-purple-900/20 blur-[120px] opacity-40" />
        <div className="absolute -bottom-[10%] right-[10%] h-[600px] w-[600px] rounded-full bg-blue-900/10 blur-[120px] opacity-30" />
      </div>

      <main className="mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8">
        <PromptDetailSkeleton />
      </main>
    </div>
  );
}
