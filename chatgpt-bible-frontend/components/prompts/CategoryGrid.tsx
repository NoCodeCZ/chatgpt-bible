import Link from 'next/link';
import type { CategoryWithSubcategories } from '@/lib/services/categories';

interface CategoryGridProps {
  categories: CategoryWithSubcategories[];
  limit?: number;
}

export default function CategoryGrid({ categories, limit = 6 }: CategoryGridProps) {
  const displayCategories = categories.slice(0, limit);

  if (displayCategories.length === 0) {
    return null;
  }

  // Color schemes for category cards
  const colorSchemes = [
    { gradient: 'from-purple-500/20 to-purple-900/10', border: 'border-purple-500/30', icon: 'text-purple-400', text: 'text-purple-300' },
    { gradient: 'from-blue-500/20 to-blue-900/10', border: 'border-blue-500/30', icon: 'text-blue-400', text: 'text-blue-300' },
    { gradient: 'from-green-500/20 to-green-900/10', border: 'border-green-500/30', icon: 'text-green-400', text: 'text-green-300' },
    { gradient: 'from-pink-500/20 to-pink-900/10', border: 'border-pink-500/30', icon: 'text-pink-400', text: 'text-pink-300' },
    { gradient: 'from-cyan-500/20 to-cyan-900/10', border: 'border-cyan-500/30', icon: 'text-cyan-400', text: 'text-cyan-300' },
    { gradient: 'from-orange-500/20 to-orange-900/10', border: 'border-orange-500/30', icon: 'text-orange-400', text: 'text-orange-300' },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
          Browse by Category
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Explore our curated collection of AI prompts organized by professional categories
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCategories.map((category, index) => {
          const colors = colorSchemes[index % colorSchemes.length];
          const categoryName = category.name_th || category.name_en || category.name || 'Category';
          const totalPrompts = category.subcategories.reduce((sum, sub) => sum + (sub.prompt_count || 0), 0);
          const subcategoryCount = category.subcategories.length;

          return (
            <Link
              key={category.id}
              href={`/prompts/category/${category.slug}`}
              className="group block"
            >
              <article className={`relative h-full bg-gradient-to-br ${colors.gradient} border ${colors.border} rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-${colors.icon.split('-')[1]}-900/10 hover:-translate-y-1`}>
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-white/5 border ${colors.border} flex items-center justify-center mb-4`}>
                  <svg className={`w-6 h-6 ${colors.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>

                {/* Content */}
                <h3 className={`text-xl font-semibold ${colors.text} mb-2 group-hover:text-white transition-colors`}>
                  {categoryName}
                </h3>
                <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                  {category.description_th || category.description_en || `Browse ${totalPrompts} professionally crafted prompts`}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>{totalPrompts} prompts</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>{subcategoryCount} subcategories</span>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className={`absolute bottom-6 right-6 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${colors.icon}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </article>
            </Link>
          );
        })}
      </div>

      {/* View All Link */}
      {limit < categories.length && (
        <div className="text-center mt-12">
          <Link
            href="/prompts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors"
          >
            View All Categories
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </section>
  );
}
