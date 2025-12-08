# Research: Prompt Search Functionality

## Overview

Analysis of why the search functionality on the `/prompts` page doesn't work when users type a query and press enter. The search bar updates the URL with a `search` parameter, but the page doesn't use it to filter prompts.

**Scope**: Search bar component, prompts page, service layer, and data flow.

---

## Current System Behavior

### Search Bar Component

**Location**: `components/prompts/SearchBar.tsx`

**Current Implementation:**
```1:29:chatgpt-bible-frontend/components/prompts/SearchBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  // Debounce search input (500ms as per Story 2.4 requirements)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      if (query.trim()) {
        params.set('search', query.trim());
      } else {
        params.delete('search');
      }

      // Reset to page 1 on new search
      params.delete('page');

      router.push(`/prompts?${params.toString()}`);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query, router, searchParams]);
```

**Behavior:**
- ✅ Reads `search` parameter from URL on mount
- ✅ Updates URL with `?search=...` when user types (debounced 500ms)
- ✅ Clears search parameter when input is empty
- ✅ Resets page to 1 on new search
- ❌ **Missing**: No `onSubmit` handler for Enter key press

**Issue**: The search bar only updates the URL via debounced `useEffect`. When user presses Enter, it doesn't trigger an immediate search - it waits for the 500ms debounce.

### Prompts Page

**Location**: `app/prompts/page.tsx`

**Current Implementation:**
```23:43:chatgpt-bible-frontend/app/prompts/page.tsx
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
```

**Behavior:**
- ✅ Reads `categories` parameter from URL
- ❌ **Missing**: Does NOT read `search` parameter
- ❌ **Missing**: Does NOT call `getPrompts()` service function
- ❌ **Missing**: Only displays subcategories, not individual prompts
- ❌ **Missing**: No conditional logic to show prompts when search is active

**Issue**: The page completely ignores the `search` parameter and only displays subcategories, not search results.

### Service Layer

**Location**: `lib/services/prompts.ts`

**Current Implementation:**
```44:332:chatgpt-bible-frontend/lib/services/prompts.ts
export async function getPrompts(
  filters: GetPromptsFilters = {}
): Promise<GetPromptsResult> {
  try {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;
    
    // Step 1: Get prompt IDs filtered by categories/job roles if needed
    let filteredPromptIds: number[] | null = null;
    let searchMatchedPromptIds: number[] | null = null;

    // If search is provided, also search in related categories and job roles
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.trim();
      const searchMatchedIds: number[] = [];

      // Search in categories and job roles (parallel queries for performance)
      const [matchingCategories, matchingJobRoles] = await Promise.all([
        directus.request(
          readItems('categories', {
            filter: {
              _or: [
                { name: { _icontains: searchTerm } },
                { name_th: { _icontains: searchTerm } },
                { name_en: { _icontains: searchTerm } },
                { slug: { _icontains: searchTerm } },
              ],
            },
            fields: ['id'],
          })
        ),
        directus.request(
          readItems('job_roles', {
            filter: {
              _or: [
                { name: { _icontains: searchTerm } },
                { slug: { _icontains: searchTerm } },
              ],
            },
            fields: ['id'],
          })
        ),
      ]);
```

**Behavior:**
- ✅ Fully implements search functionality
- ✅ Searches in `title_th`, `title_en`, `description`, `prompt_text`
- ✅ Searches in related categories and job roles
- ✅ Uses case-insensitive partial matching (`_icontains`)
- ✅ Returns paginated results with total count
- ✅ Supports combining search with category/job role filters

**Status**: Service layer is complete and ready to use.

### PromptList Component

**Location**: `components/prompts/PromptList.tsx`

**Current Implementation:**
```12:63:chatgpt-bible-frontend/components/prompts/PromptList.tsx
export default function PromptList({
  prompts,
  hasActiveFilters = false,
  user = null,
}: PromptListProps) {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
          <svg
            className="h-8 w-8 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h2 className="mb-3 text-2xl font-semibold text-white">
          No prompts found
        </h2>
        <p className="max-w-md text-zinc-400">
          {hasActiveFilters
            ? 'Try adjusting your filters or search terms to see more results.'
            : 'Check back soon for new prompts!'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {prompts.map((prompt, index) => {
        const isLocked = !canAccessPrompt(user, index);
        return (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            isLocked={isLocked}
            isAuthenticated={!!user}
            promptIndex={index}
          />
        );
      })}
    </div>
  );
}
```

**Behavior:**
- ✅ Displays list of prompts in grid layout
- ✅ Shows empty state when no prompts found
- ✅ Handles access control (locked prompts for free users)
- ✅ Accepts user object for access control

**Status**: Component is ready to use.

---

## Key Patterns

### Similar Implementation: Subcategory Page

**Location**: `app/prompts/subcategory/[id]/page.tsx`

```15:32:chatgpt-bible-frontend/app/prompts/subcategory/[id]/page.tsx
export default async function SubcategoryPage({ params, searchParams }: SubcategoryPageProps) {
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
```

**Pattern:**
1. Read search params (page number)
2. Fetch data using service function
3. Get current user for access control
4. Pass prompts to `PromptList` component

This pattern should be replicated in the main prompts page for search functionality.

### Server-Side User Access

**Location**: `lib/auth/server.ts`

```typescript
export async function getServerUser(): Promise<User | null>
```

**Usage Pattern:**
- Call `getServerUser()` in Server Components
- Pass user to `PromptList` for access control
- User can be `null` for unauthenticated users (public browsing)

---

## Constraints & Considerations

### 1. Page Display Logic

**Current**: Page always shows subcategories.

**Required**: Page should conditionally show:
- **Subcategories** when no search query (current behavior)
- **Search results** (prompts) when search query exists

### 2. Search Bar Enter Key

**Current**: Only debounced URL update (500ms delay).

**Required**: Immediate search on Enter key press.

### 3. URL Parameter Handling

**Current**: Page only reads `categories` parameter.

**Required**: Page must read:
- `search` - Search query string
- `page` - Pagination (for search results)
- `categories` - Category filter (can combine with search)

### 4. Access Control

**Current**: Subcategory page uses `getServerUser()` for access control.

**Required**: Same pattern for search results - get user server-side and pass to `PromptList`.

### 5. Pagination

**Current**: Search results support pagination via `getPrompts()`.

**Required**: Add pagination UI when displaying search results.

---

## Code References

### Search Bar
- `components/prompts/SearchBar.tsx` - Search input component

### Prompts Page
- `app/prompts/page.tsx` - Main prompts listing page (needs update)

### Service Functions
- `lib/services/prompts.ts` - `getPrompts()` function with search support
- `lib/services/subcategories.ts` - Subcategory fetching

### Components
- `components/prompts/PromptList.tsx` - Prompt grid display component
- `components/prompts/SubcategoryList.tsx` - Subcategory grid display component

### Auth
- `lib/auth/server.ts` - `getServerUser()` for server-side user access
- `lib/auth.ts` - `canAccessPrompt()` for access control logic

### Similar Implementation
- `app/prompts/subcategory/[id]/page.tsx` - Example of prompt listing with pagination

---

## Recommendations

### 1. Update Prompts Page

**Add search parameter handling:**
```typescript
const searchQuery = params.search?.trim() || '';
const currentPage = parseInt(params.page || '1', 10);
```

**Conditional data fetching:**
- If `searchQuery` exists: Call `getPrompts({ search: searchQuery, page: currentPage })`
- If no search: Show subcategories (current behavior)

**Conditional rendering:**
- If search: Render `PromptList` with search results
- If no search: Render `SubcategoryList` (current behavior)

### 2. Enhance Search Bar

**Add Enter key handler:**
```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    // Clear debounce timer
    // Immediately update URL
  }
};
```

**Add to input:**
```typescript
<input
  onKeyDown={handleKeyDown}
  // ... existing props
/>
```

### 3. Add Pagination

**When displaying search results:**
- Use `totalPages` from `getPrompts()` result
- Add pagination component (similar to subcategory page)
- Update URL with `page` parameter

### 4. Combine Filters

**Support combining search with category filters:**
- Read both `search` and `categories` parameters
- Pass both to `getPrompts()` function
- Service layer already supports this combination

---

## Implementation Priority

1. **High**: Update prompts page to read `search` parameter and call `getPrompts()`
2. **High**: Add conditional rendering (subcategories vs search results)
3. **Medium**: Add Enter key handler to search bar
4. **Medium**: Add pagination for search results
5. **Low**: Add loading states for search results

---

## Summary

**Root Cause**: The `/prompts` page doesn't read the `search` URL parameter or call the `getPrompts()` service function. It only displays subcategories regardless of search query.

**Solution**: Update the prompts page to:
1. Read `search` parameter from URL
2. Conditionally call `getPrompts()` when search exists
3. Display `PromptList` for search results, `SubcategoryList` for browsing
4. Get server-side user for access control
5. Add pagination for search results

**Service Layer**: Already complete and ready to use.

**Components**: `PromptList` component exists and is ready to use.

