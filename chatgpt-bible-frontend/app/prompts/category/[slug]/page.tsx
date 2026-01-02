import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug } from '@/lib/services/categories';
import PromptList from '@/components/prompts/PromptList';
import { getServerUser } from '@/lib/auth/server';

/**
 * Enable static generation with revalidation
 * Pages will be statically generated at build time
 * and revalidated every 5 minutes (300 seconds)
 */
export const revalidate = 300;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

/**
 * Generate static params for all categories
 */
export async function generateStaticParams() {
  // This will be populated by categories with actual slugs
  return [{ slug: 'business' }, { slug: 'marketing' }];
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const currentPage = parseInt((await searchParams).page || '1', 10);
  const page = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

  // Fetch category with subcategories
  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  // Calculate total prompts in category
  const totalPrompts = category.subcategories.reduce((sum, sub) => sum + (sub.prompt_count || 0), 0);

  // Get user for access control
  const user = await getServerUser();

  const categoryName = category.name_th || category.name_en || category.name || 'Category';
  const categoryDescription = category.description_th || category.description_en || '';

  return (
    <div className="min-h-screen bg-black text-zinc-100 antialiased selection:bg-purple-500/30 selection:text-purple-200">
      {/* Aura Background */}
      <div className="fixed top-0 w-full h-screen -z-10 pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-[1400px] mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 max-w-7xl mx-auto">
          <ol className="flex items-center gap-2 text-sm text-zinc-500">
            <li>
              <Link href="/prompts" className="hover:text-purple-400 transition-colors">
                Prompts
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-zinc-300">{categoryName}</li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="mb-10 max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-purple-900/20 to-zinc-900/40 border border-purple-500/20 rounded-3xl p-8 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3 text-white">
                  {categoryName}
                </h1>
                {categoryDescription && (
                  <p className="text-base text-zinc-300 max-w-2xl">{categoryDescription}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>{totalPrompts} prompts</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>{category.subcategories.length} subcategories</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subcategories Section */}
        {category.subcategories.length > 0 && (
          <section className="mb-12 max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
              Subcategories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {category.subcategories.map((subcategory) => {
                const subName = subcategory.name_th || subcategory.name_en || 'Subcategory';
                const subDesc = subcategory.description_th || subcategory.description_en || '';

                return (
                  <Link
                    key={subcategory.id}
                    href={`/prompts/subcategory/${subcategory.id}`}
                    className="group bg-zinc-900/40 border border-white/10 hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/10 hover:-translate-y-1 flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
                          {categoryName}
                        </span>
                        <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-full">
                          {subcategory.prompt_count} prompts
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-zinc-100 mb-3">
                        {subName}
                      </h3>
                      <p className="text-sm text-zinc-400 line-clamp-3">
                        {subDesc || 'Browse prompts in this subcategory'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="text-sm text-zinc-400">{subcategory.prompt_count} prompts</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-zinc-500 hover:text-purple-400 transition-colors">
                        Browse
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Prompts Section - Show all prompts in this category */}
        <section className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
            All Prompts in {categoryName}
          </h2>
          {/* Future: Add prompt list for this category */}
          <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-8 text-center">
            <p className="text-zinc-400 mb-4">
              Browse subcategories above to explore prompts in this category.
            </p>
            <p className="text-sm text-zinc-500">
              {totalPrompts} prompts available across {category.subcategories.length} subcategories
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

// Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found | GPT Bible',
    };
  }

  const categoryName = category.name_th || category.name_en || category.name || 'Category';
  const description = category.description_th || category.description_en || `Browse prompts in ${categoryName}`;

  return {
    title: `${categoryName} | GPT Bible`,
    description,
  };
}
