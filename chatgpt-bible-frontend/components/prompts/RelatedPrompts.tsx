'use client';

import Link from 'next/link';
import type { PromptCard } from '@/types/Prompt';
import type { SubcategoryCategory } from '@/types/Prompt';

interface RelatedPromptsProps {
  prompts: PromptCard[];
  currentPromptId: number;
}

export default function RelatedPrompts({
  prompts,
  currentPromptId,
}: RelatedPromptsProps) {
  // Filter out current prompt (safety check)
  const relatedPrompts = prompts.filter((p) => p.id !== currentPromptId);
  const hasRelated = relatedPrompts.length > 0;

  const truncateText = (text: string | undefined | null, maxLength: number = 150): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  // Get category name from subcategory relationship
  const getCategoryName = (prompt: PromptCard): string | null => {
    const subcategory = prompt.subcategory_id;
    if (!subcategory || typeof subcategory !== 'object') return null;
    const categoryData = subcategory.category_id;
    if (!categoryData) return null;
    
    if (typeof categoryData === 'object') {
      const cat = categoryData as SubcategoryCategory;
      return cat.name_en || cat.name_th || cat.name || null;
    }
    return null;
  };

  // Get subcategory Thai name
  const getSubcategoryTH = (prompt: PromptCard): string | null => {
    const subcategory = prompt.subcategory_id;
    if (!subcategory || typeof subcategory !== 'object') return null;
    return subcategory.name_th || null;
  };

  // Difficulty badge configuration
  const getDifficultyConfig = (level: string) => {
    const configs: Record<string, { color: string; label: string }> = {
      beginner: { color: 'green', label: 'Beginner' },
      intermediate: { color: 'yellow', label: 'Intermediate' },
      advanced: { color: 'red', label: 'Advanced' },
    };
    return configs[level] || configs.beginner;
  };

  return (
    <section className="mt-16 sm:mt-24">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-medium tracking-tight text-white">
        เกี่ยวข้อง
        <span className="ml-4 h-px flex-1 bg-white/10" />
      </h2>
      {hasRelated ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {relatedPrompts.map((prompt) => {
            const promptTitle = prompt.title_th || prompt.title_en || '';
            const categoryName = getCategoryName(prompt);
            const subcategoryTH = getSubcategoryTH(prompt);
            const difficultyConfig = getDifficultyConfig(prompt.difficulty_level);

            return (
              <Link key={prompt.id} href={`/prompts/${prompt.id}`}>
                <article className="group bg-zinc-900/40 border border-white/10 hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/10 hover:-translate-y-1 flex flex-col justify-between h-full backdrop-blur-md">
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

                    {/* Category Badge */}
                    <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300 mb-4">
                      {categoryName || 'Category'}
                    </div>

                    {/* Prompt Title */}
                    <h3 className="text-lg font-medium text-zinc-100 mb-3 leading-snug line-clamp-2">
                      {truncateText(promptTitle, 80) || 'Untitled Prompt'}
                    </h3>

                    {/* Prompt Description */}
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
                      ดูรายละเอียด
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">
          ยังไม่มี Prompts ที่เกี่ยวข้องสำหรับหมวดหมู่นี้ในตอนนี้
        </p>
      )}
    </section>
  );
}
