# Implementation Plan: Popular Prompts Dynamic Display

## Overview

Replace the hardcoded prompts in the "Prompts ยอดนิยม" (Popular Prompts) section on the landing page with real prompts fetched from Directus. When users click on a prompt card, they should be directed to either:
- `/prompts/[id]` - Individual prompt detail page
- `/prompts` - Prompt library page (as fallback)

## Research Summary

- Current implementation: `app/page.tsx` has hardcoded prompt data in `PromptsGridBlock` component
- Prompt fetching: `lib/services/prompts.ts` has `getPrompts()` function that fetches published prompts
- Access control: First 3 prompts (by ID order) are free, rest are premium (via `lib/utils/access-control.ts`)
- Block component: `components/blocks/PromptsGridBlock.tsx` accepts `PromptsGridBlock` type from `types/blocks.ts`
- Prompt detail route: `/prompts/[id]` exists and displays individual prompts
- No `/execute` route exists - user likely meant `/prompts/[id]`

## Tasks

### Task 1: Create Service Function for Popular Prompts

**File**: `chatgpt-bible-frontend/lib/services/prompts.ts`
**Lines**: After `getPromptsBySubcategory()` function (around line 447)

**BEFORE**:
```typescript
// No function exists yet
```

**AFTER**:
```typescript
/**
 * Fetch popular prompts for landing page
 * Returns the most recent published prompts (limited count)
 * Fetches prompts with subcategory relationship for category tags
 * 
 * @param limit - Number of prompts to fetch (default: 6)
 * @returns Array of PromptCard objects suitable for PromptsGridBlock
 */
export async function getPopularPrompts(limit: number = 6): Promise<PromptCard[]> {
  try {
    const prompts = await directus.request(
      readItems('prompts', {
        filter: {
          status: { _eq: 'published' },
        },
        fields: [
          'id',
          'title_th',
          'title_en',
          'description',
          'difficulty_level',
          'subcategory_id.id',
          'subcategory_id.name_th',
          'subcategory_id.name_en',
          'subcategory_id.category_id.id',
          'subcategory_id.category_id.name',
          'subcategory_id.category_id.name_th',
          'subcategory_id.category_id.name_en',
          'subcategory_id.category_id.slug',
        ],
        limit,
        sort: ['-id'], // Most recent first
      })
    );

    return prompts as unknown as PromptCard[];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
    console.error('Error fetching popular prompts:', errorMsg, error);
    return [];
  }
}
```

**Notes**: 
- Fetches published prompts only
- Sorts by ID descending (newest first)
- Includes subcategory relationship with category for tags
- Returns empty array on error (graceful degradation)

### Task 2: Create Helper Function to Transform Prompts to Block Format

**File**: `chatgpt-bible-frontend/lib/services/prompts.ts`
**Lines**: After `getPopularPrompts()` function

**BEFORE**:
```typescript
// No helper function exists
```

**AFTER**:
```typescript
import type { PromptCard as BlockPromptCard } from '@/types/blocks';
import { isPromptInFreeTier } from '@/lib/utils/access-control';

/**
 * Transform PromptCard to PromptsGridBlock format
 * Handles badge determination, icon extraction, tag generation, and link creation
 * 
 * @param prompt - PromptCard from Directus
 * @param index - 0-based index of prompt (for premium/free determination)
 * @returns BlockPromptCard formatted for PromptsGridBlock component
 */
export async function transformPromptToBlockCard(
  prompt: PromptCard,
  index: number
): Promise<BlockPromptCard> {
  // Determine badge (free or premium)
  const isFree = await isPromptInFreeTier(prompt.id);
  const badge: 'free' | 'premium' = isFree ? 'free' : 'premium';

  // Get title (prioritize Thai, fallback to English)
  const title = prompt.title_th || prompt.title_en || 'Untitled Prompt';

  // Extract tags from subcategory's category
  const tags: string[] = [];
  
  // Get category from subcategory relationship
  if (prompt.subcategory_id && typeof prompt.subcategory_id === 'object') {
    const subcategory = prompt.subcategory_id;
    const category = subcategory.category_id;
    
    if (category && typeof category === 'object') {
      // Prefer Thai name, fallback to English, then name
      const categoryName = category.name_th || category.name_en || category.name;
      if (categoryName && !tags.includes(categoryName)) {
        tags.push(categoryName);
      }
    }
    
    // Add subcategory name as tag if available
    const subcategoryName = subcategory.name_th || subcategory.name_en;
    if (subcategoryName && !tags.includes(subcategoryName)) {
      tags.push(subcategoryName);
    }
  }

  // Extract icon and color based on category
  // For now, we'll use default icons based on category or a generic icon
  // This can be enhanced later to use actual prompt_type.icon field
  let icon: string | undefined;
  let iconColor: string = 'purple';

  // Simple icon color selection based on category from subcategory
  if (prompt.subcategory_id && typeof prompt.subcategory_id === 'object') {
    const category = prompt.subcategory_id.category_id;
    if (category && typeof category === 'object') {
      // Map categories to icon colors based on slug
      const categorySlug = category.slug?.toLowerCase() || '';
      if (categorySlug.includes('business')) {
        iconColor = 'purple';
      } else if (categorySlug.includes('marketing')) {
        iconColor = 'blue';
      } else if (categorySlug.includes('ai') || categorySlug.includes('tech')) {
        iconColor = 'green';
      } else if (categorySlug.includes('education')) {
        iconColor = 'pink';
      } else if (categorySlug.includes('data')) {
        iconColor = 'cyan';
      }
    }
  }

  // Default icon (can be replaced with prompt_type.icon if available)
  icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-file-text w-6 h-6"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>`;

  // Create link to prompt detail page
  const link = `/prompts/${prompt.id}`;

  return {
    title,
    description: prompt.description || undefined,
    icon,
    icon_color: iconColor,
    tags: tags.slice(0, 3), // Limit to 3 tags
    badge,
    views: 0, // TODO: Add view_count field to prompts collection
    link,
  };
}
```

**Notes**:
- Uses `isPromptInFreeTier()` to determine badge
- Extracts tags from categories and job_roles
- Provides default icon (can be enhanced with prompt_type.icon later)
- Limits tags to 3 for UI consistency
- Views default to 0 (can be added later when view_count field exists)

### Task 3: Update Landing Page to Fetch Real Prompts

**File**: `chatgpt-bible-frontend/app/page.tsx`
**Lines**: 95-162 (Popular Prompts Section)

**BEFORE**:
```typescript
// Popular Prompts Section
<PromptsGridBlock
  data={{
    id: 'prompts-1',
    heading: 'Prompts ยอดนิยม',
    description: 'ค้นพบ prompts ที่ได้รับความนิยมสูงสุดจากผู้ใช้ของเรา',
    columns: 3,
    show_view_all: true,
    view_all_text: 'ดู Prompts ทั้งหมด',
    view_all_link: '/prompts',
    prompts: [
      {
        title: 'Business Consultant',
        tags: ['ธุรกิจ', 'GPT'],
        badge: 'free',
        views: 1892,
        link: '/prompts/business-consultant',
        icon: '<svg...',
        icon_color: 'purple',
      },
      // ... more hardcoded prompts
    ],
  }}
/>
```

**AFTER**:
```typescript
import { getPopularPrompts } from '@/lib/services/prompts';
import { transformPromptToBlockCard } from '@/lib/services/prompts';

// ... existing imports ...

export default async function LandingPage() {
  // Fetch popular prompts
  const popularPromptsData = await getPopularPrompts(6);
  
  // Transform to block format
  const blockPrompts = await Promise.all(
    popularPromptsData.map((prompt, index) => 
      transformPromptToBlockCard(prompt, index)
    )
  );

  return (
    <main className="text-white antialiased relative min-h-screen">
      {/* ... existing sections ... */}

      {/* Popular Prompts Section */}
      <PromptsGridBlock
        data={{
          id: 'prompts-1',
          heading: 'Prompts ยอดนิยม',
          description: 'ค้นพบ prompts ที่ได้รับความนิยมสูงสุดจากผู้ใช้ของเรา',
          columns: 3,
          show_view_all: true,
          view_all_text: 'ดู Prompts ทั้งหมด',
          view_all_link: '/prompts',
          prompts: blockPrompts,
        }}
      />

      {/* ... rest of sections ... */}
    </main>
  );
}
```

**Notes**:
- Page becomes async to fetch data
- Fetches 6 popular prompts
- Transforms each prompt to block format
- Falls back gracefully if no prompts available (empty array)

### Task 4: Update Page Metadata to Support Async Component

**File**: `chatgpt-bible-frontend/app/page.tsx`
**Lines**: 11-25 (Metadata and page config)

**BEFORE**:
```typescript
// Force static generation for optimal performance
export const dynamic = 'force-static';
export const revalidate = false;
```

**AFTER**:
```typescript
// Enable ISR for dynamic prompt data
export const revalidate = 300; // Revalidate every 5 minutes
```

**Notes**:
- Remove `dynamic = 'force-static'` to allow data fetching
- Set `revalidate = 300` to cache for 5 minutes (matches other prompt pages)
- This ensures prompts update regularly without rebuilding the entire site

## Complete Chain Checklist

- [x] TypeScript Interface - `PromptCard` in `types/blocks.ts` already exists
- [x] Service Function - Creating `getPopularPrompts()` and `transformPromptToBlockCard()` in `lib/services/prompts.ts`
- [x] Component Usage - Updating `app/page.tsx` to use service functions
- [ ] Directus Collection - No changes needed (using existing `prompts` collection)
- [ ] Validation - Run lint, type check, and build

## Directus Setup Checklist

**No Directus changes required** - Using existing collections:
- ✅ `prompts` collection (already exists)
- ✅ `categories` collection (for tags)
- ✅ `job_roles` collection (for tags)
- ⚠️ `prompt_types` collection exists but icon field may need verification

**Optional Enhancement (Future)**:
- Add `view_count` field to `prompts` collection for tracking popularity
- Verify `prompt_types.icon` field exists for dynamic icon support

## Validation Steps

1. **Linting**: `npm run lint`
2. **Type Check**: `npx tsc --noEmit`
3. **Build**: `npm run build`
4. **Manual Testing**:
   - Visit homepage (`/`)
   - Verify "Prompts ยอดนิยม" section displays real prompts
   - Click on a prompt card - should navigate to `/prompts/[id]`
   - Verify free/premium badges are correct (first 3 = free)
   - Verify tags display correctly
   - Verify "ดู Prompts ทั้งหมด" button links to `/prompts`

## Edge Cases to Handle

1. **No prompts available**: Empty array is handled gracefully by component
2. **Prompt without categories/job_roles**: Tags array will be empty (acceptable)
3. **Prompt without title**: Falls back to "Untitled Prompt"
4. **Access control error**: `isPromptInFreeTier()` returns false on error (conservative)
5. **Service function error**: Returns empty array, component handles gracefully

## Future Enhancements

1. Add `view_count` field to prompts and sort by views instead of ID
2. Use `prompt_types.icon` for dynamic icons instead of defaults
3. Add caching for popular prompts using `unstable_cache`
4. Add loading skeleton while prompts fetch
5. Add error boundary for prompt fetching failures

