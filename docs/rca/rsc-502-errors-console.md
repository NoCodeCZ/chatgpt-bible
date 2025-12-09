# Root Cause Analysis: React Server Component 502 Errors

## Issue Summary

Multiple 502 (Bad Gateway) errors occurring on React Server Component (RSC) requests, causing pages to fail loading. Errors observed in browser console:

```
prompts?_rsc=lbpy5:1  Failed to load resource: the server responded with a status of 502 ()
prompts?_rsc=13fii:1  Failed to load resource: the server responded with a status of 502 ()
?_rsc=ivliq:1  Failed to load resource: the server responded with a status of 502 ()
prompts/subcategory/68?_rsc=kbqn0:1  Failed to load resource: the server responded with a status of 502 ()
```

Additionally, one `ERR_BLOCKED_BY_CLIENT` error (likely browser extension blocking a tracking script).

## Symptoms

1. **502 errors on RSC requests** - React Server Component payload requests failing
2. **Pages not loading** - User sees loading states that never resolve
3. **Intermittent failures** - Errors occur on multiple routes:
   - `/prompts` (prompt list page)
   - `/prompts/subcategory/[id]` (subcategory page)
   - Root route navigation

## Reproduction Steps

1. Navigate to `/prompts` page
2. Open browser DevTools Console
3. Observe 502 errors on `?_rsc=...` requests
4. Page may fail to load or show incomplete content
5. Navigate to `/prompts/subcategory/68` (or any subcategory)
6. Observe additional 502 errors

## Investigation

### Code Path Analysis

**Affected Pages:**
1. `app/prompts/page.tsx` - Prompt list page
2. `app/prompts/subcategory/[id]/page.tsx` - Subcategory page
3. `app/prompts/[id]/page.tsx` - Prompt detail page (has ISR, less likely affected)

**Service Functions Called:**
- `getPrompts()` - Complex query with multiple Directus requests
- `getPromptsBySubcategory()` - Direct query to Directus
- `getSubcategoryById()` - Uses aggregate query (expensive)
- `getCategories()` - Simple query

### Root Cause

**Primary Issue: Directus API Timeouts**

1. **No timeout handling in service functions**
   - All Directus requests use default timeout (typically 30-60 seconds)
   - Long-running queries can exceed timeout, causing 502 errors
   - No retry logic or graceful degradation

2. **Expensive aggregate queries**
   - `getSubcategoryById()` uses `aggregate()` which can be slow on large datasets
   - `getSubcategories()` performs aggregate queries for each subcategory in parallel
   - No caching for aggregate results

3. **Missing ISR on subcategory page**
   - `app/prompts/subcategory/[id]/page.tsx` has no `revalidate` export
   - Page is fully dynamic, hitting Directus on every request
   - Increases load on Directus API

4. **No error boundaries for RSC failures**
   - When server component throws, Next.js returns 502
   - No graceful error handling or fallback UI

5. **Complex query patterns**
   - `getPrompts()` performs multiple sequential/parallel queries
   - Junction table lookups for categories/job roles
   - Search functionality adds additional query complexity

**Secondary Issue: ERR_BLOCKED_BY_CLIENT**

- Browser extension (ad blocker) blocking a tracking/analytics script
- Hash `vcd15cbe7772f49c399c6a5babf22c1241717689176015` suggests third-party script
- Not a code issue, but indicates potential analytics/tracking integration

## Code References

### Missing ISR Configuration

```15:75:chatgpt-bible-frontend/app/prompts/subcategory/[id]/page.tsx
export default async function SubcategoryPage({ params, searchParams }: SubcategoryPageProps) {
  // No revalidate export - page is fully dynamic
  const { id } = await params;
  // ... fetches data on every request
}
```

### Expensive Aggregate Query

```96:139:chatgpt-bible-frontend/lib/services/subcategories.ts
export async function getSubcategoryById(id: string): Promise<SubcategoryWithCount | null> {
  try {
    const subcategory = await directus.request(
      readItem('subcategories', id, {
        // ... fields
      })
    );

    // Get prompt count - expensive aggregate query
    const countResult = await directus.request(
      aggregate('prompts', {
        aggregate: { count: '*' },
        query: {
          filter: {
            subcategory_id: { _eq: id },
            status: { _eq: 'published' },
          },
        },
      })
    );
    // No timeout, no caching, no error handling for slow queries
  }
}
```

### Complex Query Pattern

```44:332:chatgpt-bible-frontend/lib/services/prompts.ts
export async function getPrompts(
  filters: GetPromptsFilters = {}
): Promise<GetPromptsResult> {
  // Multiple sequential queries:
  // 1. Search in categories/job roles
  // 2. Get prompt IDs from junction tables
  // 3. Fetch prompts with filters
  // 4. Get total count
  // No timeout handling, can take 10+ seconds on large datasets
}
```

### No Timeout Configuration

```58:65:chatgpt-bible-frontend/lib/directus.ts
function createClient() {
  const url = getDirectusUrl();
  return directusToken
    ? createDirectus(url).with(staticToken(directusToken)).with(rest())
    : createDirectus(url).with(rest());
  // No timeout configuration
  // No retry logic
  // No error handling for network issues
}
```

## Proposed Fix

### 1. Add ISR to Subcategory Page (Quick Win)

**File**: `app/prompts/subcategory/[id]/page.tsx`

Add revalidation to reduce Directus load:

```typescript
/**
 * Enable static generation with revalidation
 * Pages will be statically generated at build time
 * and revalidated every 5 minutes (300 seconds)
 */
export const revalidate = 300;
```

### 2. Add Timeout Handling to Directus Client

**File**: `lib/directus.ts`

Configure request timeouts:

```typescript
import { createDirectus, rest, staticToken } from '@directus/sdk';

// Add timeout configuration
const REQUEST_TIMEOUT = 10000; // 10 seconds

function createClient() {
  const url = getDirectusUrl();
  const client = directusToken
    ? createDirectus(url).with(staticToken(directusToken)).with(rest())
    : createDirectus(url).with(rest());
  
  // Configure timeout via fetch options
  // Note: @directus/sdk doesn't expose timeout directly
  // May need to use AbortController or wrapper
  return client;
}
```

### 3. Cache Aggregate Queries

**File**: `lib/services/subcategories.ts`

Add caching to `getSubcategoryById()`:

```typescript
export async function getSubcategoryById(id: string): Promise<SubcategoryWithCount | null> {
  return unstable_cache(
    async () => {
      // ... existing query logic
    },
    [`subcategory-${id}`],
    {
      revalidate: 300, // 5 minutes
      tags: ['subcategories', `subcategory-${id}`],
    }
  )();
}
```

### 4. Add Error Boundaries

**File**: `app/prompts/subcategory/[id]/page.tsx`

Wrap data fetching in try-catch with graceful fallback:

```typescript
export default async function SubcategoryPage({ params, searchParams }: SubcategoryPageProps) {
  try {
    const { id } = await params;
    const subcategory = await getSubcategoryById(id);
    // ... rest of component
  } catch (error) {
    console.error('Error loading subcategory page:', error);
    // Return error UI instead of throwing
    return <ErrorUI message="Failed to load subcategory" />;
  }
}
```

### 5. Optimize Aggregate Queries

Consider:
- Pre-computing prompt counts in Directus (computed field or trigger)
- Using database views instead of aggregate queries
- Adding database indexes on `subcategory_id` and `status`

### 6. Add Request Retry Logic

Implement exponential backoff for failed requests:

```typescript
async function requestWithRetry<T>(
  requestFn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error('Max retries exceeded');
}
```

## Potential Side Effects

1. **ISR changes**: May cause stale data for up to 5 minutes
2. **Caching**: May mask data freshness issues
3. **Timeout reduction**: May cause more failures if Directus is genuinely slow
4. **Error boundaries**: May hide underlying infrastructure issues

## Related Issues

- Performance optimization plan: `plans/web-speed-optimization.md`
- Research on speed optimizations: `docs/research/website-speed-optimizations.md`
- Missing ISR on prompt list page (already has `revalidate = 300`)

## Next Steps

1. **Immediate**: Add ISR to subcategory page
2. **Short-term**: Add caching to aggregate queries
3. **Medium-term**: Implement timeout handling and retry logic
4. **Long-term**: Optimize database queries and add monitoring

## Monitoring Recommendations

- Add logging for Directus request durations
- Track 502 error rates
- Monitor Directus API response times
- Set up alerts for high error rates

