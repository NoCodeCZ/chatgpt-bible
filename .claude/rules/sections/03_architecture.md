- **High-level structure**
  - **`app/`**: Next.js App Router entrypoints, layouts, and route segments.
    - `app/page.tsx`: marketing landing page.
    - `app/prompts/*`: prompt listing & detail pages (data from Directus).
    - `app/(pages)/[...slug]/page.tsx`: dynamic page builder integrated with Directus.
  - **`components/`**:
    - `components/blocks/*`: reusable page-builder blocks rendered by `BlockRenderer`.
    - `components/prompts/*`: presentational components for the prompt catalog (cards, lists, filters).
    - `components/layout/*`: site-level shared UI like `Navbar`.
    - `components/ui/*`: low-level UI primitives like `DifficultyBadge`.
  - **`lib/`**:
    - `directus.ts`: Directus client initialization (URL validation, REST transport).
    - `directus-pages.ts`: page builder service functions (`getPageByPermalink`, `getPageBlocks`, `getPageWithBlocks`, etc.).
    - `lib/services/` & `lib/hooks/`: feature-specific services and hooks (follow existing filename patterns).
  - **`types/`**: shared TypeScript types (`Prompt`, `Category`, `Navigation`, `blocks` types).
  - **`scripts/`**: Node-based migration and data utilities targeting Directus.

- **Patterns**
  - **Service pattern for Directus** (example from `lib/directus-pages.ts`):

```ts
export async function getPageByPermalink(permalink: string): Promise<Page | null> {
  try {
    const pages = await directus.request(
      readItems('pages', {
        filter: { permalink: { _eq: permalink }, status: { _eq: 'published' } },
        fields: ['id', 'title', 'permalink', 'seo_title', 'seo_description', 'seo_image', 'page_type', 'priority', 'tags', 'published_date', 'status'],
        limit: 1,
      }),
    );
    if (!pages || pages.length === 0) return null;
    return pages[0] as unknown as Page;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}
```

  - **Page builder route**: `app/(pages)/[...slug]/page.tsx` uses:
    - `generateStaticParams()` → uses `getAllPagePermalinks()`.
    - `generateMetadata()` → derives SEO fields from Directus `pages`.
    - Default export → calls `getPageWithBlocks()` and renders via `BlockRenderer`.

