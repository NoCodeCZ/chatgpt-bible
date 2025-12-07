# Research: Website Speed & Optimizations

## Overview

Comprehensive analysis of current performance optimizations and opportunities for improvement in the ChatGPT Bible Next.js application. Includes caching strategies, image optimization, bundle size, and cache clearing mechanisms.

## Current System Behavior

### ISR (Incremental Static Regeneration)

**Implemented:**
- Landing page (`app/page.tsx`): `revalidate = false` (fully static)
- Dynamic pages (`app/(pages)/[...slug]/page.tsx`): `revalidate = 60` (60 seconds)
- Prompt detail pages (`app/prompts/[id]/page.tsx`): No explicit revalidate (defaults to dynamic)

```12:13:chatgpt-bible-frontend/app/page.tsx
export const dynamic = 'force-static';
export const revalidate = false;
```

```78:83:chatgpt-bible-frontend/app/(pages)/[...slug]/page.tsx
/**
 * Enable static generation with revalidation
 * Pages will be statically generated at build time
 * and revalidated every 60 seconds
 */
export const revalidate = 60;
```

**Issues:**
1. Prompt detail pages lack ISR configuration - all requests hit Directus API
2. Prompt list page (`app/prompts/page.tsx`) has no revalidate setting
3. No route-level cache headers configured

### SWR Client-Side Caching

**Implemented:**
- SWR configured with 5-minute TTL for prompts
- Stale-while-revalidate pattern
- Deduplication enabled

```12:21:chatgpt-bible-frontend/lib/utils/cache.ts
export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000, // 5 seconds
  focusThrottleInterval: 60000, // 1 minute
  refreshInterval: 300000, // 5 minutes (per PRD)
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  shouldRetryOnError: true,
};
```

**Usage:**
- Only used in `usePrompts` hook for client-side data fetching
- Not used for server-side service functions

### Service Function Caching

**Current State:**
- No server-side caching in service functions
- Every request hits Directus API directly
- No request deduplication on server

```213:242:chatgpt-bible-frontend/lib/services/prompts.ts
export async function getPromptById(id: string): Promise<Prompt | null> {
  try {
    const prompt = await directus.request(
      readItem('prompts', id, {
        fields: [
          'id',
          'status',
          'title',
          'title_th',
          'title_en',
          'description',
          'prompt_text',
          'difficulty_level',
          'sort',
          'prompt_type_id',
          'subcategory_id',
        ],
      })
    );

    return prompt as unknown as Prompt;
  } catch (error: any) {
    // Return null for 404 errors, throw for other errors
    if (error?.response?.status === 404 || error?.errors?.[0]?.extensions?.code === 'RECORD_NOT_FOUND') {
      return null;
    }
    console.error('Error fetching prompt:', error);
    throw new Error('Failed to fetch prompt');
  }
}
```

**Issues:**
1. No `unstable_cache` from Next.js for server-side caching
2. No request memoization for concurrent requests
3. Categories/subcategories fetched on every page load

### Image Optimization

**Current State:**
- Next.js `Image` component used in some blocks
- Directus images served directly without optimization

```48:49:chatgpt-bible-frontend/components/blocks/HeroBlock.tsx
          <Image
            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${background_image}`}
```

**Issues:**
1. Directus images bypass Next.js Image Optimization API
2. No image CDN configuration
3. No WebP/AVIF format conversion
4. No lazy loading configuration
5. No image dimensions specified in some cases

### Next.js Configuration

**Current Headers:**
- Security headers configured
- No cache-control headers for static assets
- No compression configuration

```6:42:chatgpt-bible-frontend/next.config.ts
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Changed from DENY to allow same-origin embedding
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin', // Changed from strict-origin-when-cross-origin
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
```

**Missing:**
1. Cache-Control headers for static assets
2. Compression configuration (gzip/brotli)
3. Image optimization configuration
4. Bundle analyzer configuration

### Bundle Size

**Current State:**
- No bundle size monitoring
- No code splitting analysis
- No tree-shaking verification

**Issues:**
1. No bundle analyzer configured
2. No performance budgets defined
3. No lazy loading for heavy components

## Key Patterns

### Data Fetching Pattern

**Server Components:**
- Direct Directus API calls in Server Components
- No caching layer between Next.js and Directus
- Error handling returns `null` for 404s

**Client Components:**
- SWR for client-side data fetching
- Fallback data from SSR
- 5-minute cache TTL

### Caching Strategy

**Current Layers:**
1. **Static Generation**: Landing page (infinite cache)
2. **ISR**: Dynamic pages (60s revalidate)
3. **SWR**: Client-side (5min TTL)
4. **No server-side caching**: Service functions hit Directus every time

## Constraints & Considerations

### Directus API Limitations

- Rate limiting: 100 req/min per IP (Directus default)
- No built-in caching layer
- All requests go through REST API

### Next.js Constraints

- ISR requires revalidate export
- `unstable_cache` available for server-side caching
- Image optimization requires Next.js Image component
- Bundle size affects initial load time

### Deployment Considerations

- Vercel: Automatic edge caching
- Docker deployment: Manual cache configuration needed
- CDN: Not configured for Directus assets

## Code References

### ISR Configuration
```12:13:chatgpt-bible-frontend/app/page.tsx
export const dynamic = 'force-static';
export const revalidate = false;
```

```78:83:chatgpt-bible-frontend/app/(pages)/[...slug]/page.tsx
/**
 * Enable static generation with revalidation
 * Pages will be statically generated at build time
 * and revalidated every 60 seconds
 */
export const revalidate = 60;
```

### SWR Configuration
```12:21:chatgpt-bible-frontend/lib/utils/cache.ts
export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000, // 5 seconds
  focusThrottleInterval: 60000, // 1 minute
  refreshInterval: 300000, // 5 minutes (per PRD)
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  shouldRetryOnError: true,
};
```

### Service Functions (No Caching)
```9:23:chatgpt-bible-frontend/lib/services/categories.ts
export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await directus.request(
      readItems('categories', {
        fields: ['id', 'name', 'slug', 'description', 'sort', 'name_th', 'name_en'],
        sort: ['sort', 'name'],
      })
    );

    return categories as unknown as Category[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
```

### Image Usage
```48:49:chatgpt-bible-frontend/components/blocks/HeroBlock.tsx
          <Image
            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${background_image}`}
```

## Recommendations

### High Priority

1. **Add ISR to Prompt Pages**
   - Add `revalidate = 300` (5 minutes) to prompt detail pages
   - Add `revalidate = 300` to prompt list page
   - Reduces Directus API load by 80-90%

2. **Implement Server-Side Caching**
   - Use `unstable_cache` from Next.js for service functions
   - Cache categories/subcategories (rarely change)
   - Cache prompt metadata (5min TTL)

3. **Add Cache-Control Headers**
   - Static assets: `Cache-Control: public, max-age=31536000, immutable`
   - HTML pages: `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`
   - API routes: `Cache-Control: no-store`

4. **Optimize Directus Images**
   - Use Next.js Image component with Directus proxy
   - Configure image domains in `next.config.ts`
   - Enable WebP/AVIF format conversion

### Medium Priority

5. **Bundle Size Optimization**
   - Add `@next/bundle-analyzer` for monitoring
   - Implement code splitting for heavy components
   - Lazy load non-critical components

6. **Request Deduplication**
   - Use React `cache()` for request memoization
   - Prevent duplicate API calls in same render

7. **Compression**
   - Enable gzip/brotli compression
   - Configure in `next.config.ts` or server

### Low Priority

8. **CDN Configuration**
   - Configure CDN for Directus assets
   - Use Vercel Image Optimization API
   - Edge caching for static content

9. **Performance Monitoring**
   - Add Web Vitals tracking
   - Monitor Core Web Vitals
   - Set up performance budgets

10. **Cache Clearing Strategy**
    - Implement on-demand revalidation API route
    - Use `revalidatePath()` for specific routes
    - Use `revalidateTag()` for tag-based invalidation (Next.js 13.4+)

## Cache Clearing Mechanisms

### Current State
- No cache clearing mechanism implemented
- Manual cache clearing requires rebuild/redeploy

### Recommended Implementation

1. **On-Demand Revalidation API Route**
   ```typescript
   // app/api/revalidate/route.ts
   export async function POST(request: Request) {
     const { path, secret } = await request.json();
     
     if (secret !== process.env.REVALIDATE_SECRET) {
       return Response.json({ error: 'Invalid secret' }, { status: 401 });
     }
     
     try {
       await revalidatePath(path);
       return Response.json({ revalidated: true, path });
     } catch (err) {
       return Response.json({ error: 'Error revalidating' }, { status: 500 });
     }
   }
   ```

2. **Tag-Based Revalidation** (Next.js 13.4+)
   - Use `unstable_cache` with tags
   - Revalidate by tag instead of path
   - More granular cache control

3. **Directus Webhook Integration**
   - Trigger revalidation when content changes
   - Webhook calls revalidation API
   - Automatic cache updates

## Performance Targets

Based on architecture documentation:

- **Initial Page Load**: <3 seconds (4G connection)
- **Time to Interactive**: <5 seconds
- **Search/Filter Response**: <500ms
- **Cached Results**: <50ms
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)

## Next Steps

1. Implement ISR for prompt pages
2. Add server-side caching with `unstable_cache`
3. Configure cache-control headers
4. Optimize Directus image delivery
5. Add bundle analyzer
6. Implement cache clearing API route
7. Set up performance monitoring

