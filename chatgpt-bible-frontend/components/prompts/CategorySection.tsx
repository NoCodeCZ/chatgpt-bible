import Link from 'next/link';
import type { CategoryWithSubcategories, SubcategoryWithCount } from '@/lib/services/categories';
import SubcategoryCard from './SubcategoryCard';

interface CategorySectionProps {
  category: CategoryWithSubcategories;
}

function SubcategoryListItem({ subcategory }: { subcategory: SubcategoryWithCount }) {
  const truncateText = (text: string | undefined | null, maxLength: number = 100): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  const subcategoryName = subcategory.name_th || subcategory.name_en || 'Subcategory';
  const description = subcategory.description_th || subcategory.description_en || '';

  return (
    <Link href={`/prompts/subcategory/${subcategory.id}`}>
      <article className="group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-zinc-900/30 border border-white/5 hover:border-purple-500/20 rounded-xl transition-all duration-200 hover:bg-zinc-900/50 min-h-[60px] sm:min-h-0">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 sm:w-10 sm:h-10 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-1">
            <h3 className="text-base sm:text-sm font-medium text-zinc-100 group-hover:text-purple-300 transition-colors">
              {subcategoryName}
            </h3>
            <span className="text-xs sm:text-xs text-zinc-500">{subcategory.prompt_count} prompts</span>
          </div>
          <p className="text-sm sm:text-xs text-zinc-500 line-clamp-1 sm:line-clamp-1">
            {truncateText(description, 80) || 'Browse prompts in this subcategory'}
          </p>
        </div>

        {/* Arrow */}
        <svg className="flex-shrink-0 w-4 h-4 text-zinc-600 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </article>
    </Link>
  );
}

export default function CategorySection({ category }: CategorySectionProps) {
  const categoryName = category.name_th || category.name_en || category.name || 'Category';
  const totalPrompts = category.subcategories.reduce((sum, sub) => sum + (sub.prompt_count || 0), 0);

  return (
    <section className="mb-12 scroll-mt-28" id={`category-${category.slug}`}>
      {/* Category Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">{categoryName}</h2>
            <span className="text-sm sm:text-sm text-zinc-500">{totalPrompts} prompts</span>
          </div>
          {category.description_th && (
            <p className="text-sm sm:text-sm text-zinc-400">{category.description_th}</p>
          )}
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      </div>

      {/* Subcategories Grid/List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {category.subcategories.map((subcategory) => (
          <SubcategoryListItem key={subcategory.id} subcategory={subcategory} />
        ))}
      </div>
    </section>
  );
}
