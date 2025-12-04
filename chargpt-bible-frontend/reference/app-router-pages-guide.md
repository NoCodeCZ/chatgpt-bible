# Next.js App Router Pages Reference

**Purpose:** Create pages in `app/` directory using App Router patterns. Default to Server Components for data fetching, use client components only for interactivity.

## Overall Pattern

```
app/[route]/page.tsx → generateMetadata → generateStaticParams → Async Server Component → Fetch Data → Render
```

## Step 1: Create Basic Page Structure

```typescript
// app/prompts/page.tsx
import { getPrompts } from '@/lib/services/prompts';
import PromptList from '@/components/prompts/PromptList';

interface PromptsPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
  }>;
}

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);

  const promptsResult = await getPrompts({ page, limit: 20 });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Prompts</h1>
      <PromptList prompts={promptsResult.data} />
    </div>
  );
}

// Metadata for SEO
export const metadata = {
  title: 'Prompts | My App',
  description: 'Browse our collection of prompts',
};
```

**Rules:** Use async function component by default, await `searchParams` (Next.js 15+), fetch data in Server Component, pass data to child components, export `metadata` for SEO.

## Step 2: Handle Dynamic Routes

```typescript
// app/prompts/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getPromptById } from '@/lib/services/prompts';
import PromptDetail from '@/components/prompts/PromptDetail';

interface PromptDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
  const { id } = await params;
  
  const prompt = await getPromptById(id);
  
  if (!prompt) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PromptDetail prompt={prompt} />
    </div>
  );
}

// Dynamic metadata
export async function generateMetadata({ params }: PromptDetailPageProps) {
  const { id } = await params;
  const prompt = await getPromptById(id);

  if (!prompt) {
    return {
      title: 'Prompt Not Found',
    };
  }

  return {
    title: `${prompt.title_en || prompt.title_th} | My App`,
    description: prompt.description,
  };
}
```

**Rules:** Await `params` object, validate data exists, use `notFound()` for 404s, implement `generateMetadata` for dynamic SEO, handle missing data gracefully.

## Step 3: Implement Static Generation

```typescript
// app/prompts/[id]/page.tsx

// Generate static params at build time
export async function generateStaticParams() {
  const prompts = await getAllPromptIds(); // Fetch all IDs
  
  return prompts.map((prompt) => ({
    id: String(prompt.id),
  }));
}

// Revalidate every hour
export const revalidate = 3600;
```

**Rules:** Use `generateStaticParams` for dynamic routes, return array of param objects, use `revalidate` for ISR, fetch minimal data (IDs only) in generateStaticParams.

## Step 4: Handle Loading and Error States

```typescript
// app/prompts/[id]/loading.tsx
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}

// app/prompts/[id]/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}

// app/prompts/[id]/not-found.tsx
export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Prompt not found</h2>
      <p>The prompt you're looking for doesn't exist.</p>
    </div>
  );
}
```

**Rules:** Create `loading.tsx` for Suspense boundaries, create `error.tsx` with reset function (must be client component), create `not-found.tsx` for 404s, use skeleton UI in loading state.

## Step 5: Use Suspense for Data Fetching

```typescript
// app/prompts/page.tsx
import { Suspense } from 'react';
import PromptList from '@/components/prompts/PromptList';
import PromptListSkeleton from '@/components/prompts/PromptListSkeleton';

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Prompts</h1>
      
      <Suspense fallback={<PromptListSkeleton />}>
        <PromptListWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function PromptListWrapper({ searchParams }: PromptsPageProps) {
  const params = await searchParams;
  const promptsResult = await getPrompts({ page: parseInt(params.page || '1', 10) });
  
  return <PromptList prompts={promptsResult.data} />;
}
```

**Rules:** Wrap async data fetching in Suspense, provide skeleton fallback, separate data fetching into wrapper component, improve perceived performance.

## Quick Checklist

- [ ] Created page file in `app/[route]/page.tsx`
- [ ] Used async function component (default)
- [ ] Awaited `searchParams` and `params` (Next.js 15+)
- [ ] Fetched data using service functions (not Directus directly)
- [ ] Exported `metadata` for SEO (static or dynamic)
- [ ] Implemented `generateMetadata` for dynamic routes (if needed)
- [ ] Implemented `generateStaticParams` for static generation (if needed)
- [ ] Set `revalidate` for ISR (if applicable)
- [ ] Created `loading.tsx` with skeleton UI
- [ ] Created `error.tsx` with reset button (client component)
- [ ] Created `not-found.tsx` for 404s
- [ ] Used Suspense for async data (if needed)
- [ ] Handled missing data with `notFound()`
- [ ] Passed data to presentational components
- [ ] Tested with valid and invalid routes
