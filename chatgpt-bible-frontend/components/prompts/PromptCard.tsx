'use client';

import Link from 'next/link';
import type { PromptCard as PromptCardType, SubcategoryCategory } from '@/types/Prompt';
import LockedPromptOverlay from './LockedPromptOverlay';
import PromptMethodBadge from './PromptMethodBadge';

interface PromptCardProps {
  prompt: PromptCardType;
  isLocked?: boolean;
  isAuthenticated?: boolean;
  promptIndex?: number;
}

export default function PromptCard({ 
  prompt, 
  isLocked = false,
  isAuthenticated = false,
  promptIndex = 0,
}: PromptCardProps) {
  const truncateText = (text: string | undefined | null, maxLength: number = 150): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  // Get subcategory data
  const subcategory = prompt.subcategory_id;
  
  // Get category name from subcategory relationship
  const getCategoryName = (): string | null => {
    if (!subcategory || typeof subcategory !== 'object') return null;
    const categoryData = subcategory.category_id;
    if (!categoryData) return null;
    
    // If it's an object (populated relationship)
    if (typeof categoryData === 'object') {
      const cat = categoryData as SubcategoryCategory;
      return cat.name_en || cat.name_th || cat.name || null;
    }
    return null;
  };

  // Get subcategory Thai name
  const getSubcategoryTH = (): string | null => {
    if (!subcategory || typeof subcategory !== 'object') return null;
    return subcategory.name_th || null;
  };

  // Get subcategory description (prioritize Thai, fallback to English)
  const getSubcategoryDescription = (): string => {
    if (!subcategory || typeof subcategory !== 'object') return '';
    return subcategory.description_th || subcategory.description_en || '';
  };

  // Get prompt title (prefer short_title for card display, falls back to full title)
  const getPromptTitle = (): string => {
    // Prefer short_title for card display (falls back to full title)
    return prompt.short_title_en || prompt.short_title_th ||
           prompt.title_en || prompt.title_th || 'Untitled Prompt';
  };

  // Difficulty badge configuration
  const getDifficultyConfig = () => {
    const configs = {
      beginner: { color: 'green', label: 'Beginner' },
      intermediate: { color: 'yellow', label: 'Intermediate' },
      advanced: { color: 'red', label: 'Advanced' },
    };
    return configs[prompt.difficulty_level] || configs.beginner;
  };

  const categoryName = getCategoryName();
  const subcategoryTH = getSubcategoryTH();
  const promptTitle = getPromptTitle();
  const difficultyConfig = getDifficultyConfig();

  // When locked, don't wrap in Link to avoid nested <a> tags
  const cardContent = (
    <article className="group bg-zinc-900/40 border border-white/10 hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/10 hover:-translate-y-1 flex flex-col justify-between h-full backdrop-blur-md relative">
      <div>
        {/* Header: Subcategory name (context) + Bookmark */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
            {subcategoryTH || 'Subcategory'}
          </span>
          <button 
            className="text-zinc-500 hover:text-white transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* Method Badge - Show prompt type first */}
        {prompt.prompt_type && (
          <div className="mb-3">
            <PromptMethodBadge promptType={prompt.prompt_type} size="sm" />
          </div>
        )}

        {/* Category Badge */}
        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300 mb-4">
          {categoryName || 'Category'}
        </div>

        {/* Prompt Title (unique per card) */}
        <h3 className="text-lg font-medium text-zinc-100 mb-3 leading-snug line-clamp-2">
          {truncateText(promptTitle, 80) || 'Untitled Prompt'}
        </h3>

        {/* Prompt Description (unique per card) */}
        <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 mb-6 font-light">
          {truncateText(prompt.prompt_text, 120) || 'Click to view prompt'}
        </p>
      </div>

      {/* Footer: Difficulty + View */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[11px] font-medium
          ${difficultyConfig.color === 'green' 
            ? 'border-green-500/20 bg-green-500/5 text-green-400' 
            : difficultyConfig.color === 'yellow'
            ? 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400'
            : 'border-red-500/20 bg-red-500/5 text-red-400'
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full
            ${difficultyConfig.color === 'green' 
              ? 'bg-green-500' 
              : difficultyConfig.color === 'yellow'
              ? 'bg-yellow-500'
              : 'bg-red-500'
            }`}
          />
          {difficultyConfig.label}
        </span>
        <span className="flex items-center gap-1 text-xs text-zinc-500 hover:text-purple-400 transition-colors font-medium group-hover:translate-x-0.5 duration-300">
          View
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>

      {/* Lock Overlay */}
      {isLocked && (
        <LockedPromptOverlay isAuthenticated={isAuthenticated} />
      )}
    </article>
  );

  // Only wrap in Link if not locked (to avoid nested <a> tags)
  if (isLocked) {
    return (
      <div className="block relative">
        {cardContent}
      </div>
    );
  }

  return (
    <Link 
      href={`/prompts/${prompt.id}`}
      className="block relative"
    >
      {cardContent}
    </Link>
  );
}
