import { Suspense } from 'react';
import { getSubcategories, getSubcategoriesByCategory } from '@/lib/services/subcategories';
import { getCategories } from '@/lib/services/categories';
import SubcategoryList from '@/components/prompts/SubcategoryList';
import PromptListSkeleton from '@/components/prompts/PromptListSkeleton';
import PromptFilters from '@/components/prompts/PromptFilters';
import PromptFiltersMobile from '@/components/prompts/PromptFiltersMobile';
import SearchBar from '@/components/prompts/SearchBar';

interface PromptsPageProps {
  searchParams: Promise<{
    categories?: string;
  }>;
}

/**
 * Enable static generation with revalidation
 * Pages will be statically generated at build time
 * and revalidated every 5 minutes (300 seconds)
 */
export const revalidate = 300;

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
  const params = await searchParams;

  // Parse filter parameters
  const categoryFilter = params.categories ? params.categories.split(',').filter(Boolean) : [];

  // Fetch data
  let subcategories;
  if (categoryFilter.length > 0) {
    // Fetch subcategories for selected category
    const subcategoriesByCategory = await Promise.all(
      categoryFilter.map((cat) => getSubcategoriesByCategory(cat))
    );
    subcategories = subcategoriesByCategory.flat();
  } else {
    // Fetch all subcategories
    subcategories = await getSubcategories();
  }

  const categoriesData = await getCategories();
  const total = subcategories.length;

  return (
    <div className="min-h-screen bg-black text-zinc-100 antialiased selection:bg-purple-500/30 selection:text-purple-200">
      {/* Aura Background */}
      <div className="fixed top-0 w-full h-screen -z-10 pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-[1400px] mx-auto">
        {/* Header & Search */}
        <div className="mb-10 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2 text-white">
                Prompt Library
              </h1>
              <p className="text-base text-zinc-400">
                Browse {total} subcategories of professionally-crafted ChatGPT prompts
              </p>
            </div>
            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <PromptFiltersMobile categories={categoriesData} jobRoles={[]} />
            </div>
          </div>
          
          {/* Search Bar */}
          <SearchBar />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="sticky top-24">
              <PromptFilters categories={categoriesData} jobRoles={[]} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <Suspense fallback={<PromptListSkeleton />}>
              <SubcategoryList 
                subcategories={subcategories} 
                hasActiveFilters={categoryFilter.length > 0}
              />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

// Metadata for SEO
export const metadata = {
  title: 'Prompt Library | CharGPT Bible',
  description: 'Browse our curated library of job-specific ChatGPT prompts',
};
