# Implementation Plan: Subcategory Page Prompt Grouping by Type

**Date:** 2026-01-02
**Status:** Ready for Implementation
**Research:** `docs/research/subcategory-prompt-grouping.md`

---

## Overview

Group prompts in the subcategory page by prompt type (Fill-in-the-blank, Open-ended, Question-based) with section headers, matching the markdown file structure.

---

## Implementation Steps

### Step 1: Clean Up Duplicate Prompt Types in Database

**Problem:** Multiple `prompt_types` entries share the same slug.

**Action:** Remove duplicate entries, keeping only one per slug.

| Slug to Keep | IDs to Remove |
|---|---|
| fill-in-blank | Keep `a2b2511e...`, remove `4ca6b038...` |
| open-ended | Keep `3359228e...`, remove `c9d4ccc8...` |
| question-based | Keep `40976da9...`, remove `7d12f5c7...` |

**Directus Action:**
```sql
-- Find duplicates
SELECT slug, COUNT(*) as count FROM prompt_types GROUP BY slug HAVING count > 1;

-- Delete specific duplicates by ID (example - verify IDs before running)
DELETE FROM prompt_types WHERE id = '4ca6b038-9242-4caa-b429-7b823cfd0bad';
DELETE FROM prompt_types WHERE id = 'c9d4ccc8-a8f3-467d-a9bc-00f6de1ff61c';
DELETE FROM prompt_types WHERE id = '7d12f5c7-5858-44cc-8a44-014e551fcacb';
```

**Verification:** After deletion, verify each slug appears only once.

---

### Step 2: Update Service to Sort by Prompt Type

**File:** `lib/services/prompts.ts`

**Current:** `sort: ['-id']`

**Change to:** Sort by prompt_type.sort first, then by id

```typescript
// In getPromptsBySubcategory()
const prompts = await directus.request(
  readItems('prompts', {
    filter: {
      status: { _eq: 'published' },
      subcategory_id: { _eq: subcategoryId },
    },
    fields: [...], // existing fields
    limit,
    offset,
    // NEW: Sort by prompt type first, then by id
    sort: ['prompt_type_id.sort', 'id'],
  })
);
```

**Note:** Need to add `prompt_type_id.sort` to fields array if not already there.

---

### Step 3: Create Grouped Prompt List Component

**New File:** `components/prompts/GroupedPromptList.tsx`

```tsx
'use client';

import PromptListItem from './PromptListItem';
import { canAccessPrompt } from '@/lib/auth';
import type { PromptCard as PromptCardType } from '@/types/Prompt';
import type { User } from '@/types/User';

interface PromptGroup {
  typeSlug: string;
  typeName: string; // Thai name for display
  prompts: PromptCardType[];
}

interface GroupedPromptListProps {
  prompts: PromptCardType[];
  user?: User | null;
}

/**
 * Group prompts by type and display with section headers
 * Matches markdown structure: Fill-in-the-blank → Open-ended → Question-based
 */
export default function GroupedPromptList({
  prompts,
  user = null,
}: GroupedPromptListProps) {
  // Group prompts by prompt_type.slug
  const grouped = prompts.reduce<Record<string, PromptGroup>>((acc, prompt) => {
    const typeSlug = prompt.prompt_type?.slug || 'uncategorized';
    const typeName = prompt.prompt_type?.name_th || 'Unknown';

    if (!acc[typeSlug]) {
      acc[typeSlug] = {
        typeSlug,
        typeName,
        prompts: [],
      };
    }

    acc[typeSlug].prompts.push(prompt);
    return acc;
  }, {});

  // Convert to array and sort by prompt_type.sort (implicit order from DB)
  const groups = Object.values(grouped);

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <h2 className="mb-3 text-2xl font-semibold text-white">No prompts found</h2>
        <p className="max-w-md text-zinc-500">Check back soon for new prompts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.typeSlug}>
          {/* Section Header */}
          <h2 className="text-xl font-semibold text-zinc-100 mb-4 pb-2 border-b border-white/10">
            {group.typeName}
          </h2>

          {/* Prompts in this group */}
          <div className="space-y-4">
            {group.prompts.map((prompt, index) => {
              const isLocked = !canAccessPrompt(user, index);
              return (
                <PromptListItem
                  key={prompt.id}
                  prompt={prompt as any}
                  isLocked={isLocked}
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
```

---

### Step 4: Update Subcategory Page to Use Grouped Component

**File:** `app/prompts/subcategory/[id]/page.tsx`

```tsx
// Change import
import GroupedPromptList from '@/components/prompts/GroupedPromptList';

// In JSX, replace PromptListExpanded with GroupedPromptList
<Suspense fallback={<PromptListSkeleton />}>
  <GroupedPromptList prompts={prompts} user={user} />
</Suspense>
```

---

### Step 5: Update Types (if needed)

**File:** `types/Prompt.ts`

Verify `PromptCard` includes prompt type fields:

```typescript
export interface PromptCard {
  // ... existing fields
  prompt_type?: PromptType | null; // Already present ✓
  prompt_type_id?: string | null; // Already present ✓
}
```

**Status:** Types are already correct. No changes needed.

---

## Before/After Comparison

### Before (Current)
```
[Prompt 1 - Open-ended]
[Prompt 2 - Fill-in-blank]
[Prompt 3 - Open-ended]
[Prompt 4 - Fill-in-blank]
```

### After (Proposed)
```
### PROMPT แบบเติมคำ (Fill-in-the-blank Prompts)
[Prompt 2 - Fill-in-blank]
[Prompt 4 - Fill-in-blank]

### PROMPT แบบปลายเปิด (Open-ended Prompts)
[Prompt 1 - Open-ended]
[Prompt 3 - Open-ended]
```

---

## Testing Checklist

- [ ] Duplicate prompt types removed from database
- [ ] Prompts sort by prompt_type.sort first
- [ ] Section headers display Thai names correctly
- [ ] All prompts appear in correct groups
- [ ] Free/premium access control still works
- [ ] Copy buttons work for each prompt
- [ ] Pagination still functions (if applicable)
- [ ] Empty state displays correctly

---

## Edge Cases to Handle

1. **Prompts without prompt_type:** Group as "Uncategorized"
2. **Only one prompt type:** Don't show section header if only one group? (Optional)
3. **Empty groups:** Don't render sections with no prompts

---

## Rollback Plan

If issues arise:
1. Revert `lib/services/prompts.ts` sort order
2. Replace `GroupedPromptList` with `PromptListExpanded` in page
3. Keep database changes (they're improvements anyway)

---

## Future Enhancements

1. Add collapsible sections for each prompt type
2. Add prompt count badge in section headers
3. Add anchor links to jump between sections
4. Add "Copy all prompts in section" button
