import CategorySection from './CategorySection';
import type { CategoryWithSubcategories } from '@/lib/services/categories';

interface CategoryListProps {
  categories: CategoryWithSubcategories[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 mb-6 bg-zinc-800 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-3">No categories found</h2>
        <p className="text-zinc-400 max-w-md">
          Check back soon for new content!
        </p>
      </div>
    );
  }

  // Calculate total prompts across all categories
  const totalPrompts = categories.reduce(
    (sum, cat) => sum + cat.subcategories.reduce((subSum, sub) => subSum + (sub.prompt_count || 0), 0),
    0
  );

  // Calculate total subcategories
  const totalSubcategories = categories.reduce(
    (sum, cat) => sum + cat.subcategories.length,
    0
  );

  return (
    <div>
      {/* Quick Stats */}
      <div className="flex items-center gap-6 mb-8 p-4 bg-zinc-900/30 border border-white/5 rounded-xl">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-sm text-zinc-400">
            <span className="text-white font-medium">{totalPrompts}</span> prompts
          </span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span className="text-sm text-zinc-400">
            <span className="text-white font-medium">{totalSubcategories}</span> subcategories
          </span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span className="text-sm text-zinc-400">
            <span className="text-white font-medium">{categories.length}</span> categories
          </span>
        </div>
      </div>

      {/* Category Sections */}
      {categories.map((category) => (
        <CategorySection key={category.id} category={category} />
      ))}
    </div>
  );
}
