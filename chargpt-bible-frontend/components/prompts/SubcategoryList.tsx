import type { SubcategoryWithCount } from '@/lib/services/subcategories';
import SubcategoryCard from './SubcategoryCard';

interface SubcategoryListProps {
  subcategories: SubcategoryWithCount[];
  hasActiveFilters?: boolean;
}

export default function SubcategoryList({ subcategories, hasActiveFilters = false }: SubcategoryListProps) {
  if (subcategories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 mb-6 bg-zinc-800 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-3">No subcategories found</h2>
        <p className="text-zinc-400 max-w-md">
          {hasActiveFilters
            ? 'Try adjusting your filters to see more subcategories.'
            : 'Check back soon for new content!'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {subcategories.map((subcategory) => (
        <SubcategoryCard key={subcategory.id} subcategory={subcategory} />
      ))}
    </div>
  );
}

