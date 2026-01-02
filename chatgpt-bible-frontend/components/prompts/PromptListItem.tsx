'use client';

import { useCopyToClipboard } from './useCopyToClipboard';
import DifficultyBadge from '@/components/ui/DifficultyBadge';

interface SubcategoryData {
  id: number;
  name_th: string;
  name_en: string;
  category_id: {
    id: string;
    name_th: string;
    name_en: string;
    slug: string;
  };
}

interface PromptListItemProps {
  prompt: {
    id: number;
    title_th: string;
    title_en: string;
    description: string;
    prompt_text: string;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    subcategory_id: SubcategoryData;
  };
  isLocked?: boolean;
}

/**
 * PromptListItem Component
 *
 * Displays a single prompt in expanded format with one-click copy functionality.
 * Used on the subcategory page to show all prompts with copy buttons.
 */
export default function PromptListItem({ prompt, isLocked = false }: PromptListItemProps) {
  const { copy, isCopied } = useCopyToClipboard();

  const handleCopy = () => {
    copy(prompt.prompt_text);
  };

  // Get category name
  const categoryName = prompt.subcategory_id?.category_id?.name_th ||
                       prompt.subcategory_id?.category_id?.name_en ||
                       'Category';

  // Get prompt title
  const title = prompt.title_th || prompt.title_en || 'Untitled Prompt';

  // Get description
  const description = prompt.description || '';

  return (
    <article className="group bg-zinc-900/60 border border-white/10 hover:border-purple-500/20 rounded-2xl p-6 transition-all duration-300">
      {/* Header: Badges + Copy Button */}
      <div className="flex items-start justify-between gap-4 mb-4">
        {/* Left: Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Badge */}
          <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
            {categoryName}
          </span>

          {/* Difficulty Badge */}
          <DifficultyBadge level={prompt.difficulty_level} />
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          disabled={isLocked}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${isLocked
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : isCopied
                ? 'bg-green-600 text-white'
                : 'bg-purple-600 hover:bg-purple-500 text-white'
            }
          `}
        >
          {isCopied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Title */}
      <h3 className="text-lg font-medium text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
          {description}
        </p>
      )}

      {/* Prompt Code Block */}
      <div className={`relative rounded-xl overflow-hidden ${isLocked ? 'blur-sm' : ''}`}>
        {/* Code block header */}
        <div className="flex items-center justify-between bg-white/5 px-4 py-2 border-b border-white/5">
          <span className="text-xs text-zinc-500 font-medium">Prompt Template</span>
          <span className="text-[10px] text-zinc-600">Ready to use</span>
        </div>

        {/* Prompt text */}
        <div className="bg-black/40 p-4">
          <pre className="font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
            {prompt.prompt_text}
          </pre>
        </div>

        {/* Lock Overlay for Premium Content */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
                  <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-amber-400">Prompt locked</p>
              <p className="mt-1 text-xs text-zinc-500">Upgrade to unlock</p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
