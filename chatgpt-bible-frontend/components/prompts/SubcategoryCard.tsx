'use client';

import Link from 'next/link';
import type { SubcategoryWithCount } from '@/lib/services/subcategories';

interface SubcategoryCardProps {
  subcategory: SubcategoryWithCount;
}

export default function SubcategoryCard({ subcategory }: SubcategoryCardProps) {
  const truncateText = (text: string | undefined | null, maxLength: number = 150): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  // Get category name
  const categoryName = subcategory.category?.name_en || subcategory.category?.name || 'Category';
  
  // Get subcategory name (Thai)
  const subcategoryName = subcategory.name_th || subcategory.name_en || 'Subcategory';
  
  // Get description
  const description = subcategory.description_th || subcategory.description_en || '';

  return (
    <Link href={`/prompts/subcategory/${subcategory.id}`}>
      <article className="group bg-zinc-900/40 border border-white/10 hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/10 hover:-translate-y-1 flex flex-col justify-between h-full backdrop-blur-md">
        <div>
          {/* Header: Category name + Prompt count */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
              {categoryName}
            </span>
            <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-full">
              {subcategory.prompt_count} prompts
            </span>
          </div>

          {/* Category Badge */}
          <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300 mb-4">
            {categoryName}
          </div>

          {/* Subcategory Name (Thai) */}
          <h3 className="text-lg font-medium text-zinc-100 mb-3 leading-snug">
            {subcategoryName}
          </h3>

          {/* Description */}
          <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 mb-6 font-light">
            {truncateText(description, 120) || 'Browse prompts in this subcategory'}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-sm text-zinc-400">
              {subcategory.prompt_count} prompts
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs text-zinc-500 hover:text-purple-400 transition-colors font-medium group-hover:translate-x-0.5 duration-300">
            Browse
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}

