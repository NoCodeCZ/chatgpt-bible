'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCopyToClipboard } from './useCopyToClipboard';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import { canAccessPrompt } from '@/lib/auth';
import type { PromptCard as PromptCardType } from '@/types/Prompt';
import type { User } from '@/types/User';

interface SubcategoryData {
  id: number;
  name_th?: string | null;
  name_en?: string | null;
  slug?: string;
  category_id?: {
    id: string;
    name_th?: string | null;
    name_en?: string | null;
    slug?: string;
  } | null;
}

// Use Omit to avoid conflict with Subcategory type
interface PromptWithCategory extends Omit<PromptCardType, 'subcategory_id'> {
  subcategory_id?: SubcategoryData | null;
}

interface PromptGroup {
  typeSlug: string;
  typeName: string;
  prompts: PromptWithCategory[];
}

interface GroupedPromptListProps {
  prompts: PromptCardType[];
  user?: User | null;
}

/**
 * GroupedPromptList Component
 *
 * Displays prompts grouped by prompt type (Fill-in-the-blank, Open-ended, Question-based)
 * with collapsible dropdown sections for each prompt type.
 *
 * Structure:
 * ### PROMPT แบบเติมคำ (FILL-IN-THE-BLANK PROMPTS) [Collapsible]
 *   - Prompt 1
 *   - Prompt 2
 *
 * ### PROMPT เชิงคำถาม (QUESTIONS-BASED PROMPTS) [Collapsible]
 *   - Prompt 3
 *   - Prompt 4
 */
export default function GroupedPromptList({
  prompts,
  user = null,
}: GroupedPromptListProps) {
  const { copy, isCopied, reset } = useCopyToClipboard();

  // Group prompts by prompt_type.slug (memoized for performance)
  const groups = useMemo(() => {
    const grouped = prompts.reduce<Record<string, PromptGroup>>((acc, prompt) => {
      const typeSlug = prompt.prompt_type?.slug || 'uncategorized';
      const typeName = prompt.prompt_type?.name_th || 'Unknown';

      if (!acc[typeSlug]) {
        acc[typeSlug] = {
          typeSlug,
          typeName,
          prompts: [],
        };
      }

      acc[typeSlug].prompts.push(prompt as PromptWithCategory);
      return acc;
    }, {});

    return Object.values(grouped);
  }, [prompts]);

  // State to track which sections are open (all open by default)
  const [openSections, setOpenSections] = useState<Set<string>>(() =>
    new Set(groups.map(g => g.typeSlug))
  );

  // Sync open sections when groups change (but preserve user toggle state)
  useEffect(() => {
    setOpenSections(prev => {
      const allTypeSlugs = new Set(groups.map(g => g.typeSlug));
      // Add any new sections that weren't in the previous state
      const updated = new Set(prev);
      allTypeSlugs.forEach(slug => updated.add(slug));
      return updated;
    });
  }, [groups]);

  // Toggle section open/closed
  const toggleSection = (typeSlug: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(typeSlug)) {
        next.delete(typeSlug);
      } else {
        next.add(typeSlug);
      }
      return next;
    });
  };

  // Expand all sections
  const expandAll = () => {
    setOpenSections(new Set(groups.map(g => g.typeSlug)));
  };

  // Collapse all sections
  const collapseAll = () => {
    setOpenSections(new Set());
  };

  if (groups.length === 0 || prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
          <svg
            className="h-8 w-8 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h2 className="mb-3 text-2xl font-semibold text-white">
          No prompts found
        </h2>
        <p className="max-w-md text-zinc-500">
          Check back soon for new prompts in this subcategory!
        </p>
      </div>
    );
  }

  // Handle copy for individual prompts
  const handleCopy = (promptText: string) => {
    reset();
    copy(promptText);
  };

  return (
    <div className="space-y-4">
      {/* Expand/Collapse All Buttons */}
      <div className="flex items-center justify-end gap-3 mb-6">
        <button
          onClick={expandAll}
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          Expand All
        </button>
        <span className="text-zinc-600">|</span>
        <button
          onClick={collapseAll}
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          Collapse All
        </button>
      </div>

      {groups.map((group) => {
        const isOpen = openSections.has(group.typeSlug);

        return (
          <CollapsibleSection
            key={group.typeSlug}
            group={group}
            isOpen={isOpen}
            onToggle={() => toggleSection(group.typeSlug)}
            user={user}
            isCopied={isCopied}
            onCopy={handleCopy}
          />
        );
      })}
    </div>
  );
}

/**
 * Collapsible section for a prompt type group
 */
interface CollapsibleSectionProps {
  group: PromptGroup;
  isOpen: boolean;
  onToggle: () => void;
  user: User | null;
  isCopied: boolean;
  onCopy: (promptText: string) => void;
}

function CollapsibleSection({ group, isOpen, onToggle, user, isCopied, onCopy }: CollapsibleSectionProps) {
  return (
    <section className="border border-white/10 rounded-2xl overflow-hidden bg-zinc-900/40">
      {/* Collapsible Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-zinc-800/40 hover:bg-zinc-800/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Chevron Icon */}
          <svg
            className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>

          {/* Type Name */}
          <h2 className="text-lg font-semibold text-zinc-100">
            {group.typeName}
          </h2>

          {/* Prompt Count */}
          <span className="text-sm font-normal text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded-full">
            {group.prompts.length} {group.prompts.length === 1 ? 'prompt' : 'prompts'}
          </span>
        </div>

        {/* Expand/Collapse Indicator */}
        <span className="text-xs text-zinc-500">
          {isOpen ? 'Click to collapse' : 'Click to expand'}
        </span>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="px-6 py-4 space-y-4 border-t border-white/5">
          {group.prompts.map((prompt) => {
            const isLocked = !canAccessPrompt(user, prompt.id - 1);
            return (
              <PromptItem
                key={prompt.id}
                prompt={prompt}
                isLocked={isLocked}
                isCopied={isCopied}
                onCopy={() => onCopy(prompt.prompt_text || '')}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

/**
 * Individual prompt item with copy functionality
 */
interface PromptItemProps {
  prompt: PromptWithCategory;
  isLocked: boolean;
  isCopied: boolean;
  onCopy: () => void;
}

function PromptItem({ prompt, isLocked, isCopied, onCopy }: PromptItemProps) {
  // Get prompt title
  const title = prompt?.title_th || prompt?.title_en || 'Untitled Prompt';

  // Get prompt text
  const promptText = prompt?.prompt_text || 'No prompt text available';

  // Get difficulty
  const difficulty = prompt?.difficulty_level || 'beginner';

  // Get category name (for badge)
  const categoryName = prompt?.subcategory_id?.category_id?.name_th ||
                       prompt?.subcategory_id?.category_id?.name_en ||
                       null;

  return (
    <article className="bg-zinc-900/60 border border-white/10 hover:border-purple-500/20 rounded-xl p-4 transition-all duration-300">
      {/* Header: Title + Badges + Copy Button */}
      <div className="flex items-start justify-between gap-4 mb-3">
        {/* Left: Title + Badges */}
        <div className="flex-1 min-w-0">
          {/* Category Badge (if exists) */}
          {categoryName && (
            <span className="inline-block rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-0.5 text-[11px] font-medium text-purple-300 mb-2">
              {categoryName}
            </span>
          )}

          {/* Prompt Title */}
          <h3 className="text-base font-medium text-white pr-4">
            {title}
          </h3>
        </div>

        {/* Right: Difficulty + Copy */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Difficulty Badge */}
          <DifficultyBadge level={difficulty} />

          {/* Copy Button */}
          <button
            onClick={onCopy}
            disabled={isLocked}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex-shrink-0
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
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Prompt Text - Code Block Style */}
      <div className={`relative rounded-lg overflow-hidden ${isLocked ? 'blur-sm' : ''}`}>
        <div className="bg-black/40 p-4 border border-white/5">
          <pre className="font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
            {promptText}
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
