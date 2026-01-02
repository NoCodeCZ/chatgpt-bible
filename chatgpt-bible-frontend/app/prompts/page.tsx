import { Suspense } from 'react';
import { getCategoriesWithSubcategories, getCategories } from '@/lib/services/categories';
import { getPrompts, type GetPromptsFilters } from '@/lib/services/prompts';
import { getServerUser } from '@/lib/auth/server';
import CategoryList from '@/components/prompts/CategoryList';
import PromptList from '@/components/prompts/PromptList';
import PromptListSkeleton from '@/components/prompts/PromptListSkeleton';
import PromptFilters from '@/components/prompts/PromptFilters';
import PromptFiltersMobile from '@/components/prompts/PromptFiltersMobile';
import SearchBar from '@/components/prompts/SearchBar';
import Pagination from '@/components/prompts/Pagination';

interface PromptsPageProps {
  searchParams: Promise<{
    categories?: string;
    search?: string;
    page?: string;
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
  const searchQuery = params.search?.trim() || '';
  const currentPage = parseInt(params.page || '1', 10);
  const page = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

  // Conditionally fetch data based on search query
  const categoriesData = await getCategories();
  let searchResults = null;
  let categoriesWithSubcategories = null;
  let total = 0;
  let totalSubcategories = 0;
  let user = null;

  if (searchQuery) {
    // Search mode: Fetch prompts matching search query
    const filters: GetPromptsFilters = {
      search: searchQuery,
      page: page,
      limit: 20,
    };

    // Add category filter if present
    if (categoryFilter.length > 0) {
      filters.categories = categoryFilter;
    }

    searchResults = await getPrompts(filters);
    total = searchResults.total;

    // Get user for access control
    user = await getServerUser();
  } else {
    // Browse mode: Fetch categories with subcategories
    let allCategories = await getCategoriesWithSubcategories();

    // Debug logging
    console.log('Categories fetched:', allCategories.length, allCategories);

    // Filter categories if category filter is applied
    if (categoryFilter.length > 0) {
      categoriesWithSubcategories = allCategories.filter((cat) =>
        categoryFilter.includes(cat.slug)
      );
    } else {
      categoriesWithSubcategories = allCategories;
    }

    // Calculate totals
    total = categoriesWithSubcategories.reduce(
      (sum, cat) => sum + cat.subcategories.reduce((subSum, sub) => subSum + (sub.prompt_count || 0), 0),
      0
    );
    totalSubcategories = categoriesWithSubcategories.reduce(
      (sum, cat) => sum + cat.subcategories.length,
      0
    );
  }

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
                {searchQuery ? 'Search Results' : 'Prompt Library'}
              </h1>
              <p className="text-base text-zinc-400">
                {searchQuery
                  ? `Found ${total} ${total === 1 ? 'prompt' : 'prompts'} matching "${searchQuery}"`
                  : `Browse ${total} professionally-crafted ChatGPT prompts across ${totalSubcategories} subcategories`}
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
              {searchQuery && searchResults ? (
                <>
                  <PromptList
                    prompts={searchResults.data}
                    hasActiveFilters={categoryFilter.length > 0 || !!searchQuery}
                    user={user}
                  />
                  {searchResults.totalPages > 1 && (
                    <div className="mt-10">
                      <Pagination
                        currentPage={page}
                        totalPages={searchResults.totalPages}
                        baseUrl="/prompts"
                        searchParams={{
                          search: searchQuery,
                          categories: categoryFilter.length > 0 ? categoryFilter.join(',') : undefined,
                        }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <CategoryList
                  categories={categoriesWithSubcategories || []}
                  hasActiveFilters={categoryFilter.length > 0}
                />
              )}
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
