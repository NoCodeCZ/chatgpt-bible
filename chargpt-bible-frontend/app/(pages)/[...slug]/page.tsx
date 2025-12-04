import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPageWithBlocks, getAllPagePermalinks } from '@/lib/directus-pages';
import { BlockRenderer } from '@/components/blocks';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

/**
 * Generate static params for all pages
 * This enables static generation at build time
 */
export async function generateStaticParams() {
  const permalinks = await getAllPagePermalinks();

  return permalinks.map((permalink) => ({
    slug: permalink === '/' ? [] : permalink.split('/').filter(Boolean),
  }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const permalink = slug ? `/${slug.join('/')}` : '/';
  const page = await getPageWithBlocks(permalink);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.seo_title || page.title,
    description: page.seo_description,
    openGraph: {
      title: page.seo_title || page.title,
      description: page.seo_description || undefined,
      images: page.seo_image
        ? [`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${page.seo_image}`]
        : undefined,
    },
  };
}

/**
 * Dynamic Page Component
 * Renders any page from Directus with its blocks
 */
export default async function DynamicPage({ params }: PageProps) {
  // Await params and convert slug array to permalink
  const { slug } = await params;
  const permalink = slug ? `/${slug.join('/')}` : '/';

  // Fetch page with all blocks
  const page = await getPageWithBlocks(permalink);

  // 404 if page not found
  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      {/* Render all blocks */}
      {page.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </main>
  );
}

/**
 * Enable static generation with revalidation
 * Pages will be statically generated at build time
 * and revalidated every 60 seconds
 */
export const revalidate = 60;
