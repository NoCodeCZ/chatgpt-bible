# Research: Subcategory Page Prompt Grouping by Type

**Date:** 2026-01-02
**Status:** Research Complete
**Related Issue:** Subcategory page should group prompts by type (Fill-in-the-blank, Open-ended, Question-based)

---

## Current Implementation

### Page: `/app/prompts/subcategory/[id]/page.tsx`

```tsx
// Fetches prompts and displays in a flat list
const { data: prompts, total, totalPages } = await getPromptsBySubcategory(id, page, 20);

// Displays prompts using PromptListExpanded
<PromptListExpanded prompts={prompts} user={user} />
```

### Component: `PromptListExpanded` (`components/prompts/PromptListExpanded.tsx`)

```tsx
// Simply maps through all prompts without grouping
<div className="grid grid-cols-1 gap-6">
  {prompts.map((prompt, index) => (
    <PromptListItem key={prompt.id} prompt={prompt} isLocked={isLocked} />
  ))}
</div>
```

### Component: `PromptListItem` (`components/prompts/PromptListItem.tsx`)

Shows individual prompt with:
- Category badge (from subcategory.category_id)
- Difficulty badge
- Title (`title_th` or `title_en`)
- Description
- Prompt text code block with copy button

---

## Data Structure

### Prompt Types in Directus

Current `prompt_types` collection has **duplicate slugs**:

| ID | name_th | name_en | slug | sort |
|---|---|---|---|---|
| a2b2511e... | PROMPT แบบเติมคำ | Fill-in-the-blank Prompts | fill-in-blank | 1 |
| 4ca6b038... | เติมคำว่าง | Fill-in-the-Blank | fill-in-blank | 1 |
| c9d4ccc8... | ร่วมคิด | Open-Ended | open-ended | 2 |
| 3359228e... | PROMPT แบบปลายเปิด | Open-ended Prompts | open-ended | 2 |
| 7d12f5c7... | คำถามนำ | Question-Based | question-based | 3 |
| 40976da9... | PROMPT เชิงคำถาม | Question-based Prompts | question-based | 5 |

**Problem:** Multiple prompt_type IDs share the same slug, causing potential grouping issues.

### Prompts Query

From `lib/services/prompts.ts` - `getPromptsBySubcategory()`:

```typescript
const prompts = await directus.request(
  readItems('prompts', {
    filter: {
      status: { _eq: 'published' },
      subcategory_id: { _eq: subcategoryId },
    },
    fields: [
      'id', 'title_th', 'title_en', 'short_title_th', 'short_title_en',
      'description', 'prompt_text', 'difficulty_level',
      'prompt_type_id', 'prompt_type_id.id', 'prompt_type_id.name_th',
      'prompt_type_id.name_en', 'prompt_type_id.slug', 'prompt_type_id.icon',
      // ... subcategory fields
    ],
    limit, offset, sort: ['-id'],
  })
);
```

---

## Desired Structure (from Markdown)

The markdown file structure for each subcategory:

```markdown
### **2.1 การสร้างวิสัยทัศน์ธุรกิจของคุณ (Creating Your Business Vision)**

**PROMPT แบบเติมคำ (FILL-IN-THE-BLANK PROMPTS):**

* โปรดแสดงตัวอย่าง 5 รูปแบบ...
* โปรดระบุตัวชี้วัด...

**PROMPT แบบปลายเปิด (OPEN-ENDED PROMPTS):**

1. "คุณช่วยแนะนำขั้นตอน..."
2. "อะไรคือตัวชี้วัดที่จำเป็น..."
```

**Key Points:**
1. Prompts are grouped by type (Fill-in-the-blank, then Open-ended)
2. Each group has a clear section header
3. Prompts are displayed in order within each group

---

## Issues Summary

### 1. Database: Duplicate Prompt Types
- Multiple `prompt_types` entries share the same `slug`
- Need to consolidate or use `slug` for grouping instead of ID

### 2. UI: No Grouping by Prompt Type
- Current `PromptListExpanded` shows flat list
- Need to group prompts by `prompt_type.slug`
- Need section headers for each prompt type

### 3. Sort Order
- Currently sorts by `['-id']` (newest first)
- Should sort by prompt type first, then by some order

---

## Technical Constraints

1. **Type Safety:** Must use TypeScript types from `types/Prompt.ts`
2. **Server Components:** Page is a Server Component, `PromptListExpanded` is Client Component
3. **ISR:** Page uses `export const revalidate = 300`
4. **Pagination:** Current implementation uses pagination (20 per page)
5. **Access Control:** Free/premium prompt logic with `canAccessPrompt()`

---

## Potential Approaches

### Approach A: Group on Server (Recommended)
- Group prompts in the service function or page component
- Pass grouped data to `PromptListExpanded`
- Pros: Server-side processing, less client JS
- Cons: More complex data structure

### Approach B: Group in Client Component
- Pass flat list to `PromptListExpanded`
- Group by `prompt_type.slug` in the component
- Pros: Simpler service layer
- Cons: More client-side processing

### Approach C: Hybrid
- Server pre-sorts by prompt type
- Client handles rendering with section headers
- Pros: Clean separation, minimal client work

---

## Recommended Solution

**Use Approach A + sort by prompt_type.sort**

1. Clean up duplicate prompt types in database (or use slug for grouping)
2. Modify `getPromptsBySubcategory()` to sort by `prompt_type.sort` first
3. Create new component or modify `PromptListExpanded` to:
   - Group prompts by `prompt_type.slug`
   - Render section headers for each prompt type
   - Display prompts in order within each group

---

## Files to Modify

1. **Database:** `prompt_types` collection - remove duplicates
2. **Service:** `lib/services/prompts.ts` - update sort order
3. **Component:** `components/prompts/PromptListExpanded.tsx` - add grouping logic
4. **Type:** `types/Prompt.ts` - may need grouped type definition

---

## Questions for User

1. Should we remove duplicate prompt types from database?
2. What order should prompt types appear? (Fill-in-blank → Open-ended → Question-based?)
3. Should pagination apply per group or overall?
