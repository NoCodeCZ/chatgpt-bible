## 1. Core Principles

- **Type safety**: All app code in `app/`, `components/`, `lib/`, and `types/` is written in TypeScript. Prefer explicit types on exported functions, props, and public APIs.
- **App Router first**: Use Next.js App Router patterns (`app/` structure, `generateMetadata`, `generateStaticParams`, `revalidate`, server vs client components) consistently.
- **Separation of concerns**: 
  - **Data fetching & Directus access** live in `lib/` and `scripts/`, not inside UI components.
  - **Presentational components** (in `components/`) receive fully shaped props and do not call Directus directly.
- **Environment configuration**: All Directus URLs and other environment values must come from `process.env` with early validation (see `lib/directus.ts`).
- **Error handling**: Catch and log errors at service boundaries; UI surfaces friendly fallbacks (e.g. `notFound()` or skeleton components) rather than raw error messages.
- **Accessibility & semantics**: Use semantic HTML tags (`main`, `section`, `footer`, `h1`–`h3`) and ARIA roles/labels where appropriate (as in `app/page.tsx`).
- **Tailwind-first styling**: Use Tailwind utility classes for layout and design. Avoid inline styles except when strictly necessary.
- **Consistency over cleverness**: Follow existing patterns in this repo (naming, folder structure, hook usage) even if they're slightly more verbose.
- **Documentation in code**: Use short, focused comments and JSDoc-style docblocks for non-trivial functions, especially in `lib/` and `scripts/`.
- **No silent failures**: Service functions must never fail silently; they either throw or log with clear context.

## 2. Tech Stack

- **Runtime & Framework**
  - **Frontend**: Next.js **16.0.1** (App Router) on React **19.2.0**.
  - **Language**: TypeScript **^5** for app code; Node.js CommonJS for migration scripts.
- **Styling**
  - **Tailwind CSS** **^3.4.18** with PostCSS **^8.5.6** and Autoprefixer **^10.4.21**.
- **CMS / Backend**
  - **Directus** via `@directus/sdk` **^20.1.1** using REST transport.
- **Linting & Formatting**
  - **ESLint** **^9** with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` (`eslint.config.mjs`).
  - Use Prettier-compatible formatting (2 spaces, single quotes) as seen in existing files.
- **Package Manager & Scripts**
  - **Package manager**: npm (see `package-lock.json`).
  - **Core scripts** (from `package.json`):
    - `npm run dev` → `next dev --webpack`
    - `npm run build` → `next build --webpack`
    - `npm start` → `next start`
    - `npm run lint` → `eslint`
    - `npm run migrate` → `node scripts/migrate-prompts.js`
    - `npm run migrate:dry-run` → `node scripts/migrate-prompts.js --dry-run`
    - `npm run validate` → `node scripts/validate-migration.js`

## 3. Architecture

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

## 4. Code Style

- **General**
  - **Imports**: Framework imports (`next`, `react`) first, then third-party, then absolute app imports (`@/lib/...`, `@/components/...`), then relative.
  - **Naming**:
    - Components: `PascalCase` (e.g. `PromptCard`, `HeroBlock`).
    - Functions & variables: `camelCase` (e.g. `getPageWithBlocks`, `truncateDescription`).
    - Types & interfaces: `PascalCase` with `Type` suffix only when disambiguation is needed.

- **React components**
  - Use function components with explicit props interfaces:

```tsx
'use client';

import Link from 'next/link';
import type { PromptCard as PromptCardType } from '@/types/Prompt';
import DifficultyBadge from '@/components/ui/DifficultyBadge';

interface PromptCardProps {
  prompt: PromptCardType;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const truncateDescription = (text: string, maxLength: number = 100): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  // ...
}
```

  - Use `"use client";` only where hooks, browser APIs, or client-only libraries are needed.
  - Keep components focused: single responsibility, with derived data computed inside (e.g. `subcategoryName`, `displayCategories`).

- **Docstrings & comments**
  - Use JSDoc-style headers for non-trivial utilities, especially in `lib/` and `scripts/`:

```ts
/**
 * Fetch a page with all its blocks (complete page data)
 */
export async function getPageWithBlocks(permalink: string): Promise<PageWithBlocks | null> { /* ... */ }
```

  - Use inline comments to explain *why*, not *what*, when the intent is non-obvious.

## 5. Logging

- **Frontend logging**
  - Use `console.error`/`console.warn` in server utilities (`lib/`) when external services (Directus) fail.
  - Do **not** spam logs from react components; handle errors via fallbacks (e.g. conditional rendering, `notFound()`).

- **Service logging pattern** (from `lib/directus-pages.ts`):

```ts
try {
  const blocks = await directus.request(/* ... */);
  return (blocks || []) as unknown as PageBlock[];
} catch (error) {
  console.error('Error fetching page blocks:', error);
  return [];
}
```

- **Script logging** (from `scripts/migrate-prompts.js`):
  - Use a centralized logger with timestamps and types:

```js
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = { info: '📝', success: '✅', error: '❌', warning: '⚠️', progress: '📊', dryrun: '🔍' }[type] || '📝';
  console.log(`${prefix} [${timestamp}] ${message}`);
}
```

  - Always include contextual fields in messages (prompt title, collection name, file name, IDs).

- **Sensitive data**
  - Never log secrets, access tokens, or raw environment variables. You may log that a required variable is missing by name, but not its value.

## 6. Testing

> Note: There is no dedicated testing setup yet; when adding tests, follow these conventions.

- **Frameworks**
  - Use **Vitest** or **Jest** for unit tests and **Testing Library** for React component tests (prefer React Testing Library).
- **Structure & naming**
  - Place tests next to the file under test:
    - `components/prompts/PromptCard.tsx` → `components/prompts/PromptCard.test.tsx`
    - `lib/directus-pages.ts` → `lib/directus-pages.test.ts`
  - Use `.test.ts` / `.test.tsx` suffixes.
- **Patterns**
  - Test service functions with mocked Directus client.
  - Test components by rendering with meaningful props and asserting on visible text and ARIA attributes.
- **Commands**
  - When tests are added, define:
    - `npm test` → unit test runner.
    - `npm run test:watch` → watch mode.

## 7. API Contracts (Next.js ↔ Directus)

- **Types vs CMS models**
  - Define shared types in `types/` that mirror Directus collections (e.g. `Prompt`, `Page`, `PageBlock`, `PageWithBlocks`).
  - Service functions returning data from Directus must cast to these types before returning, as in:

```ts
return pages[0] as unknown as Page;
```

  - When adding fields in Directus, update the `fields` arrays in service functions and the corresponding TypeScript types together.

- **Error handling across boundary**
  - Service functions talking to Directus:
    - Either return `null`/empty arrays on failure and log errors, or throw explicit errors.
    - Callers (like route handlers) must handle these cases (e.g. `if (!page) notFound();`).

- **Example contract (Page + blocks)**

```ts
// Service
export async function getPageWithBlocks(permalink: string): Promise<PageWithBlocks | null> { /* ... */ }

// Route usage
export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const permalink = slug ? `/${slug.join('/')}` : '/';
  const page = await getPageWithBlocks(permalink);
  if (!page) notFound();
  return (
    <main className="min-h-screen">
      {page.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </main>
  );
}
```

## 8. Common Patterns

- **Backend-like service pattern (Directus data fetching)**

```ts
export async function getAllPages(): Promise<Page[]> {
  try {
    const pages = await directus.request(
      readItems('pages', {
        filter: { status: { _eq: 'published' } },
        fields: ['id', 'title', 'permalink', 'page_type', 'published_date'],
        sort: ['sort', 'published_date'],
        limit: -1,
      }),
    );
    return (pages || []) as unknown as Page[];
  } catch (error) {
    console.error('Error fetching all pages:', error);
    return [];
  }
}
```

- **Frontend component pattern (card/list UI)**

```tsx
export default function PromptCard({ prompt }: PromptCardProps) {
  const subcategory = prompt.subcategory_id;
  const subcategoryName =
    subcategory && typeof subcategory === 'object' && subcategory !== null
      ? subcategory.name_en || subcategory.name_th || null
      : null;

  const displayCategories = prompt.categories?.slice(0, 3) || [];
  const displayTitle = prompt.title_en || prompt.title_th || 'Untitled Prompt';

  return (
    <Link href={`/prompts/${prompt.id}`}>
      <article className="group block h-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-blue-400 transition-all duration-200 cursor-pointer flex flex-col">
        {/* ... */}
      </article>
    </Link>
  );
}
```

- **Migration script pattern**
  - Use a clearly documented CLI entry, env loading, and logger:

```js
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not installed, use process.env directly
}
```

  - Validate inputs, process in batches, and track results in an object (`migrationResult`).

## 9. Development Commands

- **Setup**
  - **Install dependencies**: `npm install`
- **Local development**
  - **Run dev server**: `npm run dev` (Next.js dev on the default port; see `next.config.ts` for customizations if any).
- **Build & serve**
  - **Build**: `npm run build`
  - **Start production server**: `npm start`
- **Linting**
  - **Run ESLint**: `npm run lint`
  - Fix issues using editor auto-fix or `eslint --fix` when necessary (keep changes small and focused).
- **Data migration & validation**
  - **Dry-run prompt migration**: `npm run migrate:dry-run`
  - **Run prompt migration**: `npm run migrate`
  - **Validate migration data**: `npm run validate`

## 10. Reference Guides

**CRITICAL: Always consult the reference guides in `docs/reference/` before starting any coding task.**

On-demand reference guides provide step-by-step instructions for essential development tasks:

- **[Service Functions Guide](chargpt-bible-frontend/docs/reference/service-functions-guide.md)** - Creating Directus service functions
- **[React Components Guide](chargpt-bible-frontend/docs/reference/react-components-guide.md)** - Creating Server/Client components
- **[Custom Hooks Guide](chargpt-bible-frontend/docs/reference/custom-hooks-guide.md)** - Creating SWR hooks and UI state hooks
- **[TypeScript Types Guide](chargpt-bible-frontend/docs/reference/typescript-types-guide.md)** - Defining types for Directus collections
- **[App Router Pages Guide](chargpt-bible-frontend/docs/reference/app-router-pages-guide.md)** - Creating Next.js pages with metadata/static generation
- **[API Routes Guide](chargpt-bible-frontend/docs/reference/api-routes-guide.md)** - Creating serverless API routes
- **[Migration Scripts Guide](chargpt-bible-frontend/docs/reference/migration-scripts-guide.md)** - Creating Directus migration scripts
- **[HTML to Next.js + Directus Guide](chargpt-bible-frontend/docs/reference/html-to-nextjs-directus-guide.md)** - Converting HTML files to Next.js components and integrating with Directus
- **[Directus + Next.js Workflow](chargpt-bible-frontend/docs/reference/directus-nextjs-workflow.md)** - Complete workflow for collections, blocks, and components

**Workflow:** Before coding, identify the task type → Read the relevant reference guide → Follow the checklist → Implement using patterns from the guide.

## 11. AI Coding Assistant Instructions

- **ALWAYS check `docs/reference/` guides first** - Read the relevant reference guide for the task type before writing any code. Follow the step-by-step instructions and checklists.
- **Always read this `CLAUDE.md` and existing code in the relevant directory before making changes**; match the patterns you see.
- **Use TypeScript consistently**, adding or updating types in `types/` whenever you introduce new Directus fields or component props. See [TypeScript Types Guide](chargpt-bible-frontend/docs/reference/typescript-types-guide.md).
- **Keep Directus access inside `lib/` and `scripts/`**, not inside React components; UI components should consume typed data passed as props. See [Service Functions Guide](chargpt-bible-frontend/docs/reference/service-functions-guide.md).
- **Preserve and extend error-handling and logging patterns**, especially for Directus interactions; never introduce silent failures.
- **Prefer small, focused components and utilities**, following examples like `PromptCard` and `directus-pages` functions. See [React Components Guide](chargpt-bible-frontend/docs/reference/react-components-guide.md).
- **Respect server vs client component boundaries**, only adding `"use client";` when React hooks or browser APIs are required. See [React Components Guide](chargpt-bible-frontend/docs/reference/react-components-guide.md) and [App Router Pages Guide](chargpt-bible-frontend/docs/reference/app-router-pages-guide.md).
- **Run `npm run lint` before concluding non-trivial changes** and fix any new issues you introduce.
- **When adding tests**, colocate them next to the files they cover, and keep them aligned with the patterns described in Section 6.
- **When integrating new Directus collections or fields**, update service `fields` arrays and TypeScript types together, and keep API contracts explicit. See [Directus + Next.js Workflow](chargpt-bible-frontend/docs/reference/directus-nextjs-workflow.md).
- **Document new patterns in this file (or a close variant) when they become common**, keeping the document under 500 lines and focused on actionable guidance.
