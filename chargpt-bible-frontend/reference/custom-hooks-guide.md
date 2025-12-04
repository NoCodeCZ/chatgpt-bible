# Custom Hooks Reference

**Purpose:** Create reusable React hooks for client-side data fetching and state management. Use SWR for API caching, standard hooks for UI state.

## Overall Pattern

```
SWR Hook → Service Function → Cache Key → Fallback Data → Return Typed Result
```

## Step 1: Create SWR Hook for API Data

```typescript
// lib/hooks/usePrompts.ts
'use client';

import useSWR from 'swr';
import { getPrompts } from '@/lib/services/prompts';
import { getPromptsCacheKey, swrConfig } from '@/lib/utils/cache';
import type { GetPromptsFilters, GetPromptsResult } from '@/lib/services/prompts';

/**
 * SWR Hook for Prompts
 * 
 * Provides client-side caching and revalidation for prompts
 * Uses SSR data for initial render, then SWR for client-side updates
 */
export function usePrompts(
  filters: GetPromptsFilters = {}, 
  fallbackData?: GetPromptsResult
) {
  const cacheKey = getPromptsCacheKey(filters);

  const { data, error, isLoading, mutate } = useSWR<GetPromptsResult>(
    cacheKey,
    () => getPrompts(filters),
    {
      ...swrConfig,
      fallbackData, // Use SSR data as initial value
    }
  );

  return {
    prompts: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}
```

**Rules:** Always use `'use client'` directive, import service functions (not Directus SDK), create cache key helper, use fallbackData for SSR hydration, return normalized data shape.

## Step 2: Create Cache Key Utility

```typescript
// lib/utils/cache.ts
import type { GetPromptsFilters } from '@/lib/services/prompts';

export function getPromptsCacheKey(filters: GetPromptsFilters): string {
  const params = new URLSearchParams();
  
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.categories?.length) params.set('categories', filters.categories.join(','));
  if (filters.search) params.set('search', filters.search);
  
  return `prompts?${params.toString()}`;
}

export const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000, // 5 seconds
};
```

**Rules:** Create unique cache key from filters, use URLSearchParams for consistency, include all relevant filter params, define shared SWR config.

## Step 3: Create UI State Hook

```typescript
// lib/hooks/useSearch.ts
'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function useSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const updateSearch = useCallback((query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams.toString());
    
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    
    router.push(`/prompts?${params.toString()}`);
  }, [router, searchParams]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`/prompts?${params.toString()}`);
  }, [router, searchParams]);

  return {
    searchQuery,
    updateSearch,
    clearSearch,
  };
}
```

**Rules:** Use `useState` for local state, sync with URL params, use `useCallback` for memoized functions, update URL on state change.

## Step 4: Use Hook in Component

```typescript
// components/prompts/SearchBar.tsx
'use client';

import { useSearch } from '@/lib/hooks/useSearch';

export default function SearchBar() {
  const { searchQuery, updateSearch } = useSearch();

  return (
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => updateSearch(e.target.value)}
      placeholder="Search prompts..."
      className="w-full px-4 py-2 border rounded-lg"
    />
  );
}
```

**Rules:** Call hook at top level of component, destructure returned values, use in JSX/event handlers.

## Step 5: Combine with SSR Data

```typescript
// app/prompts/page.tsx (Server Component)
import PromptList from '@/components/prompts/PromptList';

export default async function PromptsPage({ searchParams }) {
  // Fetch on server
  const promptsResult = await getPrompts({ page: 1 });

  return (
    <div>
      <PromptList initialPrompts={promptsResult} />
    </div>
  );
}

// components/prompts/PromptList.tsx (Client Component)
'use client';

import { usePrompts } from '@/lib/hooks/usePrompts';

export default function PromptList({ initialPrompts }) {
  // Use SSR data as fallback, SWR handles updates
  const { prompts, isLoading } = usePrompts({ page: 1 }, initialPrompts);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
}
```

**Rules:** Fetch data in Server Component, pass as `fallbackData` to hook, hook handles client-side updates, user sees SSR content immediately.

## Quick Checklist

- [ ] Added `'use client'` directive at top
- [ ] Imported service functions (not Directus SDK)
- [ ] Created cache key utility function (if using SWR)
- [ ] Defined hook with descriptive name (`useXxx`)
- [ ] Used SWR config from shared utility (if applicable)
- [ ] Returned normalized data shape with loading/error states
- [ ] Used `fallbackData` for SSR hydration
- [ ] Memoized callbacks with `useCallback` (if needed)
- [ ] Synced state with URL params (if applicable)
- [ ] Exported hook from `lib/hooks/`
- [ ] Tested with and without SSR fallback data
- [ ] Verified caching behavior
