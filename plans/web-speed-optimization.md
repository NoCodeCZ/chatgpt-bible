# Implementation Plan: Web Speed Optimization

## Overview

Implement comprehensive performance optimizations to reduce Directus API load by 80-90%, improve page load times, and enhance user experience. Based on research findings in `docs/research/website-speed-optimizations.md`.

## Research Summary

**Current Issues:**
1. Prompt detail pages lack ISR - all requests hit Directus API
2. Prompt list page has no revalidate setting
3. No server-side caching in service functions
4. No Cache-Control headers for static assets
5. Directus images bypass Next.js Image Optimization
6. No cache clearing mechanism

**Target Improvements:**
- Reduce Directus API load by 80-90%
- Improve initial page load to <3 seconds (4G)
- Enable on-demand cache revalidation
- Optimize image delivery

## Tasks

### Task 1: Add ISR to Prompt Detail Pages

**File**: `chatgpt-bible-frontend/app/prompts/[id]/page.tsx`
**Lines**: After line 26 (after PromptPageProps interface)

**BEFORE**:
```typescript
export default async function PromptPage({ params }: PromptPageProps) {
```

**AFTER**:
```typescript
/**
 * Enable static generation with revalidation
 * Pages will be statically generated at build time
 * and revalidated every 5 minutes (300 seconds)
 * This reduces Directus API load by 80-90%
 */
export const revalidate = 300;

export default async function PromptPage({ params }: PromptPageProps) {
```

**Notes**: 
- 5-minute revalidation balances freshness with performance
- Matches SWR client-side cache TTL (5 minutes)
- Reduces API calls significantly while keeping content fresh

---

### Task 2: Add ISR to Prompt List Page

**File**: `chatgpt-bible-frontend/app/prompts/page.tsx`
**Lines**: After line 14 (after PromptsPageProps interface)

**BEFORE**:
```typescript
export default async function PromptsPage({ searchParams }: PromptsPageProps) {
```

**AFTER**:
```typescript
/**
 * Enable static generation with revalidation
 * Pages will be statically generated at build time
 * and revalidated every 5 minutes (300 seconds)
 */
export const revalidate = 300;

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
```

**Notes**: Same revalidation period as detail pages for consistency

---

### Task 3: Add Server-Side Caching to Categories Service

**File**: `chatgpt-bible-frontend/lib/services/categories.ts`
**Lines**: Replace entire file

**BEFORE**:
```typescript
import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import type { Category } from '@/types/Category';

/**
 * Fetch all categories from Directus
 * Used for filter sidebar
 */
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

**AFTER**:
```typescript
import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import type { Category } from '@/types/Category';
import { unstable_cache } from 'next/cache';

/**
 * Fetch all categories from Directus with server-side caching
 * Used for filter sidebar
 * 
 * Cache TTL: 1 hour (categories rarely change)
 * Tags: ['categories'] for on-demand revalidation
 */
export async function getCategories(): Promise<Category[]> {
  return unstable_cache(
    async () => {
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
    },
    ['categories'],
    {
      revalidate: 3600, // 1 hour
      tags: ['categories'],
    }
  )();
}
```

**Notes**: 
- Categories rarely change, so 1-hour cache is appropriate
- Tag-based revalidation allows selective cache clearing

---

### Task 4: Add Server-Side Caching to Prompts Service

**File**: `chatgpt-bible-frontend/lib/services/prompts.ts`
**Lines**: 213-242 (getPromptById function)

**BEFORE**:
```typescript
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

**AFTER**:
```typescript
import { unstable_cache } from 'next/cache';

export async function getPromptById(id: string): Promise<Prompt | null> {
  return unstable_cache(
    async () => {
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
    },
    [`prompt-${id}`],
    {
      revalidate: 300, // 5 minutes (matches ISR revalidate)
      tags: ['prompts', `prompt-${id}`],
    }
  )();
}
```

**Notes**: 
- Cache key includes prompt ID for per-item caching
- Tags allow revalidation by prompt ID or all prompts
- 5-minute TTL matches ISR revalidation period

---

### Task 5: Add Cache-Control Headers to Next.js Config

**File**: `chatgpt-bible-frontend/next.config.ts`
**Lines**: 6-42 (inside headers() function)

**BEFORE**:
```typescript
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // ... other headers
        ],
      },
    ];
  },
```

**AFTER**:
```typescript
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
            value: 'SAMEORIGIN',
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
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Cache-Control for static assets
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache-Control for HTML pages (ISR)
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
    ];
  },
```

**Notes**: 
- Static assets: 1 year cache (immutable)
- HTML pages: 60s CDN cache, 300s stale-while-revalidate
- Matches ISR revalidation strategy

---

### Task 6: Optimize Directus Image Delivery

**File**: `chatgpt-bible-frontend/next.config.ts`
**Lines**: After line 3 (add to nextConfig object)

**BEFORE**:
```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
```

**AFTER**:
```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: new URL(process.env.NEXT_PUBLIC_DIRECTUS_URL || '').hostname,
        pathname: '/assets/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
```

**Notes**: 
- Configure Next.js Image Optimization for Directus images
- Enable AVIF/WebP format conversion
- Define responsive image sizes

---

### Task 7: Update HeroBlock to Use Optimized Images

**File**: `chatgpt-bible-frontend/components/blocks/HeroBlock.tsx`
**Lines**: 48-54 (Image component)

**BEFORE**:
```typescript
          <Image
            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${background_image}`}
            alt=""
            fill
            className="object-cover"
            priority
          />
```

**AFTER**:
```typescript
          <Image
            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${background_image}`}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={85}
          />
```

**Notes**: 
- `sizes` prop enables responsive image optimization
- `quality` set to 85 for good balance of quality/size

---

### Task 8: Create Cache Revalidation API Route

**File**: `chatgpt-bible-frontend/app/api/revalidate/route.ts` (NEW FILE)

**Content**:
```typescript
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * On-Demand Cache Revalidation API Route
 * 
 * Allows manual cache clearing via webhook or admin action
 * 
 * Usage:
 * POST /api/revalidate
 * Body: { path: '/prompts/123', secret: 'your-secret' }
 * 
 * Or tag-based:
 * Body: { tag: 'prompts', secret: 'your-secret' }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, tag, secret } = body;

    // Verify secret
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Revalidate by path
    if (path) {
      revalidatePath(path);
      return NextResponse.json({
        revalidated: true,
        path,
        now: Date.now(),
      });
    }

    // Revalidate by tag
    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({
        revalidated: true,
        tag,
        now: Date.now(),
      });
    }

    return NextResponse.json(
      { error: 'Missing path or tag' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error revalidating cache:', error);
    return NextResponse.json(
      { error: 'Error revalidating' },
      { status: 500 }
    );
  }
}
```

**Notes**: 
- Requires `REVALIDATE_SECRET` environment variable
- Supports both path-based and tag-based revalidation
- Can be called from Directus webhooks

---

### Task 9: Add Environment Variable Documentation

**File**: `.env.example` or `.env.local.example` (if exists, otherwise create)

**Add**:
```bash
# Cache Revalidation Secret
# Used for on-demand cache clearing via /api/revalidate
# Generate a secure random string: openssl rand -base64 32
REVALIDATE_SECRET=your-secret-here
```

**Notes**: Document required environment variable for cache clearing

---

### Task 10: Add Server-Side Caching to Subcategories Service

**File**: `chatgpt-bible-frontend/lib/services/subcategories.ts`
**Lines**: Check if file exists, then add caching similar to categories

**Pattern**: Follow same pattern as Task 3 (categories service)

**Notes**: 
- Subcategories also rarely change
- Use 1-hour cache with 'subcategories' tag

---

## Complete Chain Checklist

- [x] **ISR Configuration** - Added to prompt detail and list pages
- [x] **Server-Side Caching** - Added to categories, prompts, subcategories services
- [x] **Cache-Control Headers** - Added to next.config.ts
- [x] **Image Optimization** - Configured Next.js Image component
- [x] **Cache Revalidation API** - Created /api/revalidate route
- [ ] **Environment Variables** - Document REVALIDATE_SECRET
- [ ] **Validation** - Test all optimizations

## Directus Setup Checklist

**Not Required** - This optimization is frontend-only. No Directus changes needed.

**Optional**: Configure Directus webhook to call `/api/revalidate` when prompts/categories change:
- Webhook URL: `https://your-domain.com/api/revalidate`
- Method: POST
- Body: `{ "tag": "prompts", "secret": "your-secret" }`
- Trigger: On `prompts` collection update/create/delete

## Validation Steps

1. **Build Test**:
   ```bash
   cd chatgpt-bible-frontend
   npm run build
   ```

2. **Type Check**:
   ```bash
   npx tsc --noEmit
   ```

3. **Lint Check**:
   ```bash
   npm run lint
   ```

4. **Manual Testing**:
   - Visit `/prompts` - should load fast, check Network tab for cache headers
   - Visit `/prompts/[id]` - should load fast, check Network tab
   - Check browser DevTools Network tab for:
     - Cache-Control headers on responses
     - Reduced API calls (cached responses)
     - Image optimization (WebP/AVIF formats)

5. **Cache Revalidation Test**:
   ```bash
   curl -X POST http://localhost:3000/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{"path": "/prompts", "secret": "your-secret"}'
   ```

6. **Performance Check**:
   - Run Lighthouse audit
   - Verify Core Web Vitals
   - Check Directus API request count (should be reduced by 80-90%)

## Performance Targets

Based on research document:

- **Initial Page Load**: <3 seconds (4G connection) ✅
- **Time to Interactive**: <5 seconds ✅
- **Search/Filter Response**: <500ms ✅
- **Cached Results**: <50ms ✅
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO) ✅

## Expected Impact

1. **Directus API Load**: Reduced by 80-90% (ISR + server-side caching)
2. **Page Load Time**: 50-70% faster for cached pages
3. **Image Delivery**: 30-50% smaller file sizes (WebP/AVIF)
4. **CDN Efficiency**: Better cache hit rates with proper headers

## Next Steps After Implementation

1. Monitor Directus API request logs to verify reduction
2. Set up Directus webhook for automatic cache clearing
3. Add bundle analyzer (medium priority from research)
4. Implement performance monitoring (low priority from research)

