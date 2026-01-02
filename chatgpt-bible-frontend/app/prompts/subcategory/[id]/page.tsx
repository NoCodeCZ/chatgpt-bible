import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPromptsBySubcategory } from '@/lib/services/prompts';
import { getSubcategoryById } from '@/lib/services/subcategories';
import PromptListExpanded from '@/components/prompts/PromptListExpanded';
import PromptListSkeleton from '@/components/prompts/PromptListSkeleton';
import Pagination from '@/components/prompts/Pagination';
import { getServerUser } from '@/lib/auth/server';

/**
 * Enable static generation with revalidation
 * Pages will be statically generated at build time
 * and revalidated every 5 minutes (300 seconds)
 * This reduces Directus API load and prevents 502 timeout errors
 */
export const revalidate = 300;

interface SubcategoryPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function SubcategoryPage({ params, searchParams }: SubcategoryPageProps) {
   
  try {
    const { id } = await params;
    const searchParamsResolved = await searchParams;
    
    const currentPage = parseInt(searchParamsResolved.page || '1', 10);
    const page = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

    // Fetch subcategory to verify it exists
    const subcategory = await getSubcategoryById(id);
    if (!subcategory) {
      notFound();
    }

    // Fetch prompts for this subcategory
    const { data: prompts, total, totalPages } = await getPromptsBySubcategory(id, page, 20);

    // Get current user for access control
    const user = await getServerUser();

     
    return (
    <div className="min-h-screen bg-black text-zinc-100 antialiased selection:bg-purple-500/30 selection:text-purple-200">
      {/* Aura Background */}
      <div className="fixed top-0 w-full h-screen -z-10 pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-10 max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2 text-white">
            {subcategory.name_th || subcategory.name_en || 'Subcategory'}
          </h1>
          <p className="text-base text-zinc-400">
            {subcategory.description_th || subcategory.description_en || 'Browse prompts in this subcategory'}
          </p>
          <p className="text-sm text-zinc-500 mt-2">
            {total} {total === 1 ? 'prompt' : 'prompts'} available
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<PromptListSkeleton />}>
            <PromptListExpanded prompts={prompts} user={user} />
          </Suspense>

          {totalPages > 1 && (
            <div className="mt-10">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl={`/prompts/subcategory/${id}`}
              />
            </div>
          )}
        </div>
      </main>
    </div>
    );
  } catch (error) {
    // Log error for debugging
    console.error('Error loading subcategory page:', error);
    
    // Return error UI instead of throwing (prevents 502 errors)
    // Note: This catch block only handles data fetching errors, not rendering errors
     
    return (
      <div className="min-h-screen bg-black text-zinc-100 antialiased">
        <div className="fixed top-0 w-full h-screen -z-10 pointer-events-none">
          <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
        </div>
        <main className="pt-24 pb-20 px-4 sm:px-6 max-w-[1400px] mx-auto">
          <div className="max-w-7xl mx-auto text-center py-20">
            <h1 className="text-3xl font-semibold mb-4 text-white">
              Failed to Load Subcategory
            </h1>
            <p className="text-zinc-400 mb-8">
              We encountered an error while loading this page. Please try again later.
            </p>
            <Link
              href="/prompts"
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Back to Prompts
            </Link>
          </div>
        </main>
      </div>
    );
  }
}

// Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const subcategory = await getSubcategoryById(id);

  if (!subcategory) {
    return {
      title: 'Subcategory Not Found | CharGPT Bible',
    };
  }

  return {
    title: `${subcategory.name_th || subcategory.name_en || 'Subcategory'} | CharGPT Bible`,
    description: subcategory.description_th || subcategory.description_en || 'Browse prompts in this subcategory',
  };
}
