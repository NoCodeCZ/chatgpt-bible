import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPromptById } from '@/lib/services/prompts';
import { getRelatedPrompts } from '@/lib/services/related-prompts';
import PromptDetail from '@/components/prompts/PromptDetail';
import PromptDetailSkeleton from '@/components/prompts/PromptDetailSkeleton';
import RelatedPrompts from '@/components/prompts/RelatedPrompts';
import { getServerUser, isPaidUser } from '@/lib/auth/server';
import { canAccessPrompt } from '@/lib/utils/access-control';
import type { Metadata } from 'next';

interface PromptPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Prompt Detail Page - Server Component
 *
 * Dynamic route that displays full prompt details at /prompts/[id].
 * This page now uses the new dark "GPT Bible" detail layout with:
 * - Ambient gradient background
 * - Breadcrumb navigation
 * - Two-column layout (content + sidebar)
 * - Related prompts grid at the bottom
 */

/**
 * Enable static generation with revalidation
 * Pages will be statically generated at build time
 * and revalidated every 5 minutes (300 seconds)
 * This reduces Directus API load by 80-90%
 */
export const revalidate = 300;

export default async function PromptPage({ params }: PromptPageProps) {
  const { id } = await params;

  // Validate ID format (numeric)
  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const prompt = await getPromptById(id);

  if (!prompt) {
    notFound();
  }

  // Only show published prompts (enforce access control)
  if (prompt.status !== 'published') {
    notFound();
  }

  // Check authentication and access control
  const user = await getServerUser();
  const hasAccess = await canAccessPrompt(user, prompt.id);

  // Allow public viewing - show locked state for premium prompts
  // Only redirect to login if user tries to access locked content
  // (This allows public browsing of free prompts)

  // Fetch related prompts: same subcategory, excluding current
  const relatedPrompts = await getRelatedPrompts(prompt.id, prompt.subcategory_id);

  const primaryCategory = prompt.categories?.[0]?.categories_id;
  const displayTitle =
    prompt.title_en || prompt.title_th || prompt.title || 'Untitled Prompt';

  return (
    <div className="relative min-h-screen">
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-purple-900/20 blur-[120px] opacity-40" />
        <div className="absolute -bottom-[10%] right-[10%] h-[600px] w-[600px] rounded-full bg-blue-900/10 blur-[120px] opacity-30" />
      </div>

      <main className="mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 text-xs text-zinc-500">
          <Link
            href="/"
            className="flex items-center gap-1 text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <span>Home</span>
          </Link>
          <span className="text-zinc-700">{'>'}</span>
          <Link
            href="/prompts"
            className="transition-colors hover:text-zinc-300"
          >
            Prompts
          </Link>
          {primaryCategory && (
            <>
              <span className="text-zinc-700">{'>'}</span>
              <span className="text-zinc-500">
                {primaryCategory.name_th || primaryCategory.name}
              </span>
            </>
          )}
          <span className="text-zinc-700">{'>'}</span>
          <span className="text-zinc-300">{displayTitle}</span>
        </nav>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Prompt Content */}
          <div className="space-y-6 lg:col-span-8">
            <Suspense fallback={<PromptDetailSkeleton />}>
              <PromptDetail
                prompt={prompt}
                hasAccess={hasAccess}
                isPaidUser={isPaidUser(user)}
              />
            </Suspense>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            {/* Actions Box */}
            <div className="sticky top-24 rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-2xl">
              <h3 className="mb-6 text-sm font-medium text-white">Actions</h3>

              <Link
                href="/prompts"
                className="mb-8 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3.5 text-sm font-medium text-white shadow-lg shadow-purple-600/30 transition-all hover:-translate-y-0.5 hover:bg-purple-500"
              >
                <span>เริ่มใช้ Prompt เลย</span>
              </Link>

              <div className="mb-8">
                <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  ใช้ได้กับ
                </h4>
                <div className="flex items-center gap-3">
                  <div className="group flex cursor-pointer flex-col items-center gap-1.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/10 text-green-500 transition-colors group-hover:bg-green-500/20">
                      <span className="text-xs">GPT</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">ChatGPT</span>
                  </div>
                  <div className="group flex cursor-pointer flex-col items-center gap-1.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-500/20">
                      <span className="text-xs">G</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">Gemini</span>
                  </div>
                  <div className="group flex cursor-pointer flex-col items-center gap-1.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-500 transition-colors group-hover:bg-orange-500/20">
                      <span className="text-xs">C</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">Claude</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="group flex w-full items-center justify-between rounded-xl border border-white/5 bg-zinc-800/30 px-4 py-3 text-left text-xs text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-white">
                  <span className="flex items-center gap-2">
                    <span className="text-zinc-600 transition-colors group-hover:text-pink-500">
                      ♥
                    </span>
                    Like
                  </span>
                  <span className="rounded-md border border-white/5 bg-zinc-900/50 px-2 py-0.5 text-xs text-zinc-600 group-hover:text-zinc-400">
                    (0)
                  </span>
                </button>
                <button className="group flex w-full items-center justify-between rounded-xl border border-white/5 bg-zinc-800/30 px-4 py-3 text-left text-xs text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-white">
                  <span className="flex items-center gap-2">
                    <span className="text-zinc-600 transition-colors group-hover:text-blue-500">
                      ★
                    </span>
                    Save
                  </span>
                  <span className="rounded-md border border-white/5 bg-zinc-900/50 px-2 py-0.5 text-xs text-zinc-600 group-hover:text-zinc-400">
                    (0)
                  </span>
                </button>
                <button className="group flex w-full items-center justify-between rounded-xl border border-white/5 bg-zinc-800/30 px-4 py-3 text-left text-xs text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-white">
                  <span className="flex items-center gap-2">
                    <span className="text-zinc-600 transition-colors group-hover:text-purple-500">
                      ↗
                    </span>
                    Share
                  </span>
                  <span className="rounded-md border border-white/5 bg-zinc-900/50 px-2 py-0.5 text-xs text-zinc-600 group-hover:text-zinc-400">
                    (0)
                  </span>
                </button>
              </div>
            </div>

            {/* Difficulty Box */}
            <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-2xl">
              <h3 className="mb-4 text-sm font-medium text-white">Difficulty</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                {prompt.difficulty_level === 'beginner' && 'Beginner'}
                {prompt.difficulty_level === 'intermediate' && 'Intermediate'}
                {prompt.difficulty_level === 'advanced' && 'Advanced'}
              </span>
            </div>
          </div>
        </div>

        {/* Related Prompts Section (shows even if empty, with fallback message) */}
        <RelatedPrompts
          prompts={relatedPrompts}
          currentPromptId={prompt.id}
        />
      </main>
    </div>
  );
}

/**
 * Generate Dynamic Metadata for SEO
 *
 * Creates page-specific meta tags for each prompt:
 * - Title: "{prompt.title} | CharGPT Bible"
 * - Description: Truncated prompt description (160 chars)
 */
export async function generateMetadata({
  params,
}: PromptPageProps): Promise<Metadata> {
  const { id } = await params;

  // Validate ID format
  if (!/^\d+$/.test(id)) {
    return {
      title: 'Prompt Not Found | CharGPT Bible',
    };
  }

  const prompt = await getPromptById(id);

  if (!prompt) {
    return {
      title: 'Prompt Not Found | CharGPT Bible',
    };
  }

  // Use title_en if available, fallback to title_th
  const displayTitle =
    prompt.title_en || prompt.title_th || prompt.title || 'Prompt';

  return {
    title: `${displayTitle} | CharGPT Bible`,
    description: prompt.description.slice(0, 160),
  };
}
