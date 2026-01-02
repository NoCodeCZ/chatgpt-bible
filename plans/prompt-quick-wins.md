# Implementation Plan: Prompt Quick Wins (Phase 1)

> High-impact, low-effort improvements to prompt display based on user journey research

**Date:** 2026-01-02
**Research Document:** `docs/research/prompt-schema-ux-research.md`
**Estimated Tasks:** 10 (Task 0-9)
**Complexity:** Low-Medium

---

## Overview

Implement Phase 1 "Quick Wins" from the prompt UX research:
1. **CRITICAL FIX**: Add `short_title` field - current cards all show the same full prompt text as title
2. Populate `prompt_types` collection with 4 core types
3. Update prompts service to fetch and expose `prompt_type_id`
4. Add visual badges (📝/💡/📚) to prompt cards
5. Add filter by prompt type in the sidebar

---

## ⚠️ Critical Issue Found: Current Card Display Problem

**Current Data Problem:**
All prompts in the same subcategory look nearly identical because:
- `title_th`, `title_en`, `description`, and `prompt_text` are ALL THE SAME (full prompt text)
- The card header shows the same subcategory name for all prompts
- The card title is way too long (full prompt instead of short title)

**Example from Directus (subcategory: "การวิเคราะห์คู่แข่ง"):**
```
Card 1: title = "นี่คือรายชื่อคู่แข่งสำคัญใน **[ระบุอุตสาหกรรม]**..."
Card 2: title = "นี่คือรายการสินค้าและบริการหลักจากคู่แข่ง..."
Card 3: title = "โปรดระบุช่องทางการตลาดที่คู่แข่ง..."
```

All 3 cards show:
- Header: "การวิเคราะห์คู่แข่ง" (same for all)
- Title: Full prompt text (too long, hard to scan)

**Solution:** Add `short_title_th` and `short_title_en` fields for card display.

---

## Research Summary

From the research, the Thai content teaches users **3 methods** of using prompts:

| Method | Icon | Prompt Type | Use Case |
|--------|------|-------------|----------|
| สูตรสำเร็จ (The Recipe) | 📝 | Fill-in-the-Blank | Quick templates for urgent tasks |
| คู่คิดระดมสมอง (Brainstorming) | 💡 | Open-Ended | Explore ideas through conversation |
| ตำราเรียนเชิงกลยุทธ์ (Strategic) | 📚 | Educational | Study prompt patterns |

The `prompt_types` collection already exists in Directus but needs to be populated with proper values.

---

## Current System Behavior

- **Directus**: Has `prompt_types` collection (empty or not properly populated)
- **Frontend**: `PromptCard` component shows difficulty badge only
- **Filters**: Only Categories, Job Roles, and Difficulty filters exist
- **Service**: `getPrompts()` doesn't fetch `prompt_type_id` field

---

## Tasks

### Task 0: Add short_title Fields to Directus (CRITICAL FIX)

**Why this is first:** Current prompt cards all look the same because the `title` field contains the full prompt text. We need short, unique titles for card display.

**Action:** Add two new fields to the `prompts` collection in Directus

| Field | Type | Required? | Purpose | Example Value |
|-------|------|-----------|---------|---------------|
| `short_title_th` | string (256) | No | Short Thai title for cards | "รายชื่อคู่แข่ง" |
| `short_title_en` | string (256) | No | Short English title for cards | "Competitor List" |

**Directus Setup (via MCP or Admin):**

**Option 1: Via MCP**
```typescript
// Use mcp__directus__create-field tool
{
  "collection": "prompts",
  "data": {
    "field": "short_title_th",
    "type": "string",
    "meta": {
      "interface": "input",
      "options": {},
      "display": "raw",
      "display_options": {},
      "readonly": false,
      "hidden": false,
      "required": false,
      "sort": null
    },
    "schema": {
      "is_nullable": true,
      "max_length": 256
    }
  }
}

// Repeat for short_title_en
```

**Option 2: Via Directus Admin**
- [ ] Log into Directus admin
- [ ] Navigate to Settings → Data Model → `prompts` collection
- [ ] Click "Add Field" → select "String" (Input)
- [ ] Field name: `short_title_th`
- [ ] Interface: Input
- [ ] Max Length: 256
- [ ] Required: Off
- [ ] Repeat for `short_title_en`

**Data Migration Strategy:**

After adding fields, populate short titles for existing prompts. Example values for the "การวิเคราะห์คู่แข่ง" subcategory:

| Current title (too long) | short_title_th | short_title_en |
|--------------------------|----------------|----------------|
| "นี่คือรายชื่อคู่แข่งสำคัญใน..." | "รายชื่อคู่แข่ง" | "Competitor List" |
| "นี่คือรายการสินค้าและบริการ..." | "สินค้าและบริการ" | "Products & Services" |
| "โปรดระบุช่องทางการตลาด..." | "ช่องทางการตลาด" | "Marketing Channels" |

**Note:** This can be done manually in Directus admin or via a migration script. Short titles should:
- Be 2-5 words maximum
- Uniquely identify the prompt within its subcategory
- Use user-friendly language (not technical terms)

---

### Task 1: Populate prompt_types Collection in Directus

**Action:** Create 4 prompt type records in Directus via MCP

| Prompt Type | name_th | name_en | slug | icon | use_case |
|-------------|---------|---------|------|------|----------|
| Fill-in-the-Blank | เติมคำ | Fill-in-the-Blank | fill-in-blank | 📝 | quick |
| Open-Ended | ปลายเปิด | Open-Ended | open-ended | 💡 | brainstorm |
| Question-Based | คำถามนำ | Question-Based | question-based | ❓ | brainstorm |
| Educational | ศึกษา | Educational | educational | 📚 | learn |

**Directus Setup Checklist:**
- [ ] Log into Directus admin
- [ ] Navigate to `prompt_types` collection
- [ ] Create 4 records with values above
- [ ] Note the UUIDs created (will be needed for manual data updates)

**Optional**: Add `use_case` field to `prompt_types` if you want to store the use case directly on the type rather than inferring it.

---

### Task 2: Update TypeScript Types for Prompt Type and short_title

**File:** `chatgpt-bible-frontend/types/Prompt.ts`
**Lines:** 24-44 (add new interface) and 73-90 (update PromptCard)

**BEFORE:**
```typescript
export interface Prompt {
  id: number;
  status: PromptStatus;
  title: string | null;
  title_th: string;
  title_en: string;
  description: string;
  prompt_text: string;
  difficulty_level: DifficultyLevel;
  sort: number | null;
  prompt_type_id: string | null;
  subcategory_id: number | null;

  // Relationships
  categories?: Array<{ categories_id: Category; }>;
  job_roles?: Array<{ job_roles_id: JobRole; }>;
}
```

**AFTER:**
```typescript
export type PromptUseCase = 'quick' | 'brainstorm' | 'learn';

export interface PromptType {
  id: string;
  name_th: string;
  name_en: string;
  slug: string;
  icon?: string;
  description_th?: string;
  description_en?: string;
  sort?: number | null;
}

export interface Prompt {
  id: number;
  status: PromptStatus;
  title: string | null;
  title_th: string;
  title_en: string;
  description: string;
  prompt_text: string;
  difficulty_level: DifficultyLevel;
  sort: number | null;
  prompt_type_id: string | null;
  subcategory_id: number | null;

  // Relationships (populated via Directus API deep queries)
  prompt_type?: PromptType | null;  // NEW: Populated prompt type
  categories?: Array<{ categories_id: Category; }>;
  job_roles?: Array<{ job_roles_id: JobRole; }>;
}
```

**BEFORE (PromptCard):**
```typescript
// Optimized type for list views (fewer fields, better performance)
export interface PromptCard {
  id: number;
  title_th: string;
  title_en: string;
  description: string;
  prompt_text?: string; // Full prompt text for expanded display
  difficulty_level: DifficultyLevel;
  // Used for grouping in UI (e.g. related prompts within a subcategory)
  prompt_type_id?: string | null;
  prompt_type_name?: string | null;
  subcategory_id?: Subcategory | null;
  categories?: Array<{ categories_id: Pick<Category, 'id' | 'name' | 'slug'>; }>;
  job_roles?: Array<{ job_roles_id: Pick<JobRole, 'id' | 'name' | 'slug'>; }>;
}
```

**AFTER:**
```typescript
// Optimized type for list views (fewer fields, better performance)
export interface PromptCard {
  id: number;
  title_th: string;
  title_en: string;
  short_title_th?: string | null;   // NEW: Short title for card display
  short_title_en?: string | null;   // NEW: Short English title
  description: string;
  prompt_text?: string;
  difficulty_level: DifficultyLevel;
  prompt_type_id?: string | null;
  prompt_type_name?: string | null;
  prompt_type?: PromptType | null;  // NEW: Full prompt type object for badge rendering
  prompt_type_icon?: string | null; // NEW: Icon for quick access
  subcategory_id?: Subcategory | null;
  categories?: Array<{ categories_id: Pick<Category, 'id' | 'name' | 'slug'>; }>;
  job_roles?: Array<{ job_roles_id: Pick<JobRole, 'id' | 'name' | 'slug'>; }>;
}
```

---

### Task 3: Update getPrompts Service to Fetch Prompt Type and short_title

**File:** `chatgpt-bible-frontend/lib/services/prompts.ts`
**Lines:** 198-218 (update fields array in query)

**BEFORE:**
```typescript
    const query: any = {
      filter,
      limit,
      offset,
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
      sort: ['-id'],
    };
```

**AFTER:**
```typescript
    const query: any = {
      filter,
      limit,
      offset,
      fields: [
        'id',
        'title_th',
        'title_en',
        'short_title_th',          // ADD: Short title for card display
        'short_title_en',          // ADD: Short English title
        'description',
        'difficulty_level',
        'prompt_type_id',           // ADD: Fetch prompt type ID
        'prompt_type_id.id',        // ADD: For deep query
        'prompt_type_id.name_th',   // ADD: For display
        'prompt_type_id.name_en',   // ADD: For display
        'prompt_type_id.slug',      // ADD: For filtering
        'prompt_type_id.icon',      // ADD: For badge icon
        'subcategory_id.id',
        'subcategory_id.name_th',
        'subcategory_id.name_en',
        'subcategory_id.category_id.id',
        'subcategory_id.category_id.name',
        'subcategory_id.category_id.name_th',
        'subcategory_id.category_id.name_en',
        'subcategory_id.category_id.slug',
      ],
      sort: ['-id'],
    };
```

**Also update:** `getPromptsBySubcategory()` function (lines ~418-433) and `getPopularPrompts()` function (lines ~482-496) with the same field additions.

---

### Task 4: Add Prompt Type Badge Component

**File:** `chatgpt-bible-frontend/components/prompts/PromptMethodBadge.tsx` (NEW FILE)

**Create new component:**
```typescript
'use client';

import type { PromptType } from '@/types/Prompt';

interface PromptMethodBadgeProps {
  promptType: PromptType | null;
  size?: 'sm' | 'md';
}

/**
 * Renders a visual badge showing the prompt method type
 * Maps prompt types to their corresponding icons and colors
 */
export default function PromptMethodBadge({
  promptType,
  size = 'sm'
}: PromptMethodBadgeProps) {
  if (!promptType) return null;

  const getBadgeConfig = () => {
    const slug = promptType.slug;

    // Fill-in-the-Blank (The Recipe) - Quick templates
    if (slug === 'fill-in-blank') {
      return {
        icon: '📝',
        label: 'Template',
        color: 'blue',
        bgClass: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
      };
    }

    // Open-Ended (Brainstorming Partner)
    if (slug === 'open-ended') {
      return {
        icon: '💡',
        label: 'Brainstorm',
        color: 'yellow',
        bgClass: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300',
      };
    }

    // Question-Based
    if (slug === 'question-based') {
      return {
        icon: '❓',
        label: 'Questions',
        color: 'purple',
        bgClass: 'bg-purple-500/10 border-purple-500/20 text-purple-300',
      };
    }

    // Educational (Strategic Playbook)
    if (slug === 'educational') {
      return {
        icon: '📚',
        label: 'Learn',
        color: 'green',
        bgClass: 'bg-green-500/10 border-green-500/20 text-green-300',
      };
    }

    // Default fallback
    return {
      icon: '📄',
      label: 'Prompt',
      color: 'zinc',
      bgClass: 'bg-zinc-500/10 border-zinc-500/20 text-zinc-300',
    };
  };

  const config = getBadgeConfig();
  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-[10px]'
    : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${sizeClasses} ${config.bgClass}`}
      title={`Method: ${config.label}`}
    >
      <span className="text-base leading-none">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
```

---

### Task 5: Update PromptCard to Show Method Badge

**File:** `chatgpt-bible-frontend/components/prompts/PromptCard.tsx`
**Lines:** 1-12 (imports) and ~77-97 (header section)

**BEFORE (imports):**
```typescript
'use client';

import Link from 'next/link';
import type { PromptCard as PromptCardType, SubcategoryCategory } from '@/types/Prompt';
import LockedPromptOverlay from './LockedPromptOverlay';
```

**AFTER (imports):**
```typescript
'use client';

import Link from 'next/link';
import type { PromptCard as PromptCardType, SubcategoryCategory } from '@/types/Prompt';
import LockedPromptOverlay from './LockedPromptOverlay';
import PromptMethodBadge from './PromptMethodBadge';  // ADD
```

**BEFORE (card header - lines ~77-97):**
```typescript
      <div>
        {/* Header: Subcategory name (context) + Bookmark */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
            {subcategoryTH || 'Subcategory'}
          </span>
          <button
            className="text-zinc-500 hover:text-white transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* Category Badge */}
        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300 mb-4">
          {categoryName || 'Category'}
        </div>
```

**AFTER (card header):**
```typescript
      <div>
        {/* Header: Subcategory name (context) + Bookmark */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
            {subcategoryTH || 'Subcategory'}
          </span>
          <button
            className="text-zinc-500 hover:text-white transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* Method Badge - NEW: Show prompt type first */}
        {prompt.prompt_type && (
          <div className="mb-3">
            <PromptMethodBadge promptType={prompt.prompt_type} size="sm" />
          </div>
        )}

        {/* Category Badge */}
        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300 mb-4">
          {categoryName || 'Category'}
        </div>
```

**CRITICAL: Update displayTitle to prefer short_title**

Find the `displayTitle` computation in the component (around lines 30-35) and update it:

**BEFORE:**
```typescript
const displayTitle = prompt.title_en || prompt.title_th || 'Untitled Prompt';
```

**AFTER:**
```typescript
// Prefer short_title for card display (falls back to full title)
const displayTitle = prompt.short_title_en || prompt.short_title_th ||
                     prompt.title_en || prompt.title_th || 'Untitled Prompt';
```

This is the key change that fixes the "stupid looking cards" problem - cards will now show short, readable titles instead of the full prompt text.

---

### Task 6: Add Prompt Type Filter to Sidebar

**File:** `chatgpt-bible-frontend/components/prompts/PromptFilters.tsx`
**Lines:** 8-20 (props interface) and ~94-240 (component body)

**BEFORE (interface):**
```typescript
interface PromptFiltersProps {
  categories: Category[];
  jobRoles: JobRole[];
}
```

**AFTER (interface):**
```typescript
interface PromptFiltersProps {
  categories: Category[];
  jobRoles: JobRole[];
  promptTypes?: PromptType[];  // ADD: Optional prompt types array
}

// ADD import at top
import type { PromptType } from '@/types/Prompt';
```

**BEFORE (state - lines ~17-24):**
```typescript
  // Get current filter values from URL
  const currentCategories = searchParams.get('categories')?.split(',') || [];
  const currentJobRoles = searchParams.get('jobRoles')?.split(',') || [];
  const currentDifficulty = searchParams.get('difficulty') || '';

  const [selectedCategories, setSelectedCategories] = useState<string[]>(currentCategories);
  const [selectedJobRoles, setSelectedJobRoles] = useState<string[]>(currentJobRoles);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(currentDifficulty);
```

**AFTER (state):**
```typescript
  // Get current filter values from URL
  const currentCategories = searchParams.get('categories')?.split(',') || [];
  const currentJobRoles = searchParams.get('jobRoles')?.split(',') || [];
  const currentDifficulty = searchParams.get('difficulty') || '';
  const currentPromptType = searchParams.get('promptType') || '';  // ADD

  const [selectedCategories, setSelectedCategories] = useState<string[]>(currentCategories);
  const [selectedJobRoles, setSelectedJobRoles] = useState<string[]>(currentJobRoles);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(currentDifficulty);
  const [selectedPromptType, setSelectedPromptType] = useState<string>(currentPromptType);  // ADD
```

**BEFORE (updateFilters function - lines ~26-54):**
```typescript
  const updateFilters = (newCategories: string[], newJobRoles: string[], newDifficulty: string) => {
    const params = new URLSearchParams(searchParams);

    // Update category filter
    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','));
    } else {
      params.delete('categories');
    }

    // Update job role filter
    if (newJobRoles.length > 0) {
      params.set('jobRoles', newJobRoles.join(','));
    } else {
      params.delete('jobRoles');
    }

    // Update difficulty filter
    if (newDifficulty) {
      params.set('difficulty', newDifficulty);
    } else {
      params.delete('difficulty');
    }

    // Reset to page 1 when filters change
    params.delete('page');

    router.push(`/prompts?${params.toString()}`);
  };
```

**AFTER (updateFilters):**
```typescript
  const updateFilters = (
    newCategories: string[],
    newJobRoles: string[],
    newDifficulty: string,
    newPromptType: string  // ADD parameter
  ) => {
    const params = new URLSearchParams(searchParams);

    // Update category filter
    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','));
    } else {
      params.delete('categories');
    }

    // Update job role filter
    if (newJobRoles.length > 0) {
      params.set('jobRoles', newJobRoles.join(','));
    } else {
      params.delete('jobRoles');
    }

    // Update difficulty filter
    if (newDifficulty) {
      params.set('difficulty', newDifficulty);
    } else {
      params.delete('difficulty');
    }

    // Update prompt type filter - ADD
    if (newPromptType) {
      params.set('promptType', newPromptType);
    } else {
      params.delete('promptType');
    }

    // Reset to page 1 when filters change
    params.delete('page');

    router.push(`/prompts?${params.toString()}`);
  };
```

**BEFORE (toggle handlers - lines ~56-78):**
```typescript
  const handleCategoryToggle = (slug: string) => {
    const newCategories = selectedCategories.includes(slug)
      ? selectedCategories.filter((c) => c !== slug)
      : [...selectedCategories, slug];

    setSelectedCategories(newCategories);
    updateFilters(newCategories, selectedJobRoles, selectedDifficulty);
  };

  const handleJobRoleToggle = (slug: string) => {
    const newJobRoles = selectedJobRoles.includes(slug)
      ? selectedJobRoles.filter((r) => r !== slug)
      : [...selectedJobRoles, slug];

    setSelectedJobRoles(newJobRoles);
    updateFilters(selectedCategories, newJobRoles, selectedDifficulty);
  };

  const handleDifficultyChange = (difficulty: string) => {
    const newDifficulty = selectedDifficulty === difficulty ? '' : difficulty;
    setSelectedDifficulty(newDifficulty);
    updateFilters(selectedCategories, selectedJobRoles, newDifficulty);
  };
```

**AFTER (toggle handlers):**
```typescript
  const handleCategoryToggle = (slug: string) => {
    const newCategories = selectedCategories.includes(slug)
      ? selectedCategories.filter((c) => c !== slug)
      : [...selectedCategories, slug];

    setSelectedCategories(newCategories);
    updateFilters(newCategories, selectedJobRoles, selectedDifficulty, selectedPromptType);
  };

  const handleJobRoleToggle = (slug: string) => {
    const newJobRoles = selectedJobRoles.includes(slug)
      ? selectedJobRoles.filter((r) => r !== slug)
      : [...selectedJobRoles, slug];

    setSelectedJobRoles(newJobRoles);
    updateFilters(selectedCategories, newJobRoles, selectedDifficulty, selectedPromptType);
  };

  const handleDifficultyChange = (difficulty: string) => {
    const newDifficulty = selectedDifficulty === difficulty ? '' : difficulty;
    setSelectedDifficulty(newDifficulty);
    updateFilters(selectedCategories, selectedJobRoles, newDifficulty, selectedPromptType);
  };

  // ADD: Prompt type handler
  const handlePromptTypeChange = (promptTypeSlug: string) => {
    const newPromptType = selectedPromptType === promptTypeSlug ? '' : promptTypeSlug;
    setSelectedPromptType(newPromptType);
    updateFilters(selectedCategories, selectedJobRoles, selectedDifficulty, newPromptType);
  };
```

**BEFORE (clearAllFilters - lines ~80-90):**
```typescript
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedJobRoles([]);
    setSelectedDifficulty('');
    const params = new URLSearchParams(searchParams);
    params.delete('categories');
    params.delete('jobRoles');
    params.delete('difficulty');
    params.delete('page');
    router.push(`/prompts?${params.toString()}`);
  };
```

**AFTER (clearAllFilters):**
```typescript
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedJobRoles([]);
    setSelectedDifficulty('');
    setSelectedPromptType('');  // ADD
    const params = new URLSearchParams(searchParams);
    params.delete('categories');
    params.delete('jobRoles');
    params.delete('difficulty');
    params.delete('promptType');  // ADD
    params.delete('page');
    router.push(`/prompts?${params.toString()}`);
  };
```

**BEFORE (activeFilterCount - line 92):**
```typescript
  const activeFilterCount = selectedCategories.length + selectedJobRoles.length + (selectedDifficulty ? 1 : 0);
```

**AFTER (activeFilterCount):**
```typescript
  const activeFilterCount = selectedCategories.length + selectedJobRoles.length +
    (selectedDifficulty ? 1 : 0) + (selectedPromptType ? 1 : 0);
```

**ADD NEW SECTION** (before the closing `</div>` at line ~240):
```typescript
      {/* Prompt Type Filter - NEW SECTION */}
      {promptTypes && promptTypes.length > 0 && (
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-white mb-4 tracking-wide">Prompt Method</h3>
          <div className="space-y-3">
            {promptTypes.map((promptType) => {
              const isSelected = selectedPromptType === promptType.slug;

              // Get icon and label config
              const getPromptTypeConfig = () => {
                switch (promptType.slug) {
                  case 'fill-in-blank':
                    return { icon: '📝', label: promptType.name_en || 'Template', color: 'blue' };
                  case 'open-ended':
                    return { icon: '💡', label: promptType.name_en || 'Brainstorm', color: 'yellow' };
                  case 'question-based':
                    return { icon: '❓', label: promptType.name_en || 'Questions', color: 'purple' };
                  case 'educational':
                    return { icon: '📚', label: promptType.name_en || 'Learn', color: 'green' };
                  default:
                    return { icon: '📄', label: promptType.name_en || 'Prompt', color: 'zinc' };
                }
              };

              const config = getPromptTypeConfig();

              return (
                <label
                  key={promptType.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                    ${isSelected
                      ? `border-${config.color}-500`
                      : `border-zinc-700 group-hover:border-${config.color}-500/50`
                    }`}
                  >
                    <input
                      type="radio"
                      name="promptType"
                      checked={isSelected}
                      onChange={() => handlePromptTypeChange(promptType.slug)}
                      className="appearance-none w-full h-full cursor-pointer outline-none"
                    />
                    <div className={`w-2 h-2 rounded-full
                      ${isSelected ? `bg-${config.color}-500` : ''}
                    `} />
                  </div>
                  <span className="text-base leading-none mr-1">{config.icon}</span>
                  <span className={`text-sm transition-colors ${isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>
                    {config.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
```

---

### Task 7: Update Prompts Page to Pass Prompt Types to Filters

**File:** `chatgpt-bible-frontend/app/prompts/page.tsx`
**Lines:** 1-12 (imports) and ~126 (filter usage)

**BEFORE (imports):**
```typescript
import { Suspense } from 'react';
import { getCategoriesWithSubcategories, getCategories } from '@/lib/services/categories';
import { getPrompts, type GetPromptsFilters } from '@/lib/services/prompts';
import { getServerUser } from '@/lib/auth/server';
import CategoryList from '@/components/prompts/CategoryList';
import PromptList from '@/components/prompts/PromptList';
import PromptListSkeleton from '@/components/prompts/PromptListSkeleton';
import PromptFilters from '@/components/prompts/PromptFilters';
import PromptFiltersMobile from '@/components/prompts/PromptFiltersMobile';
import SearchBar from '@/components/prompts/SearchBar';
import Pagination from '@/components/prompts/Pagination';
```

**AFTER (imports):**
```typescript
import { Suspense } from 'react';
import { getCategoriesWithSubcategories, getCategories } from '@/lib/services/categories';
import { getPrompts, type GetPromptsFilters, getPromptTypes } from '@/lib/services/prompts';  // ADD getPromptTypes
import { getServerUser } from '@/lib/auth/server';
import CategoryList from '@/components/prompts/CategoryList';
import PromptList from '@/components/prompts/PromptList';
import PromptListSkeleton from '@/components/prompts/PromptListSkeleton';
import PromptFilters from '@/components/prompts/PromptFilters';
import PromptFiltersMobile from '@/components/prompts/PromptFiltersMobile';
import SearchBar from '@/components/prompts/SearchBar';
import Pagination from '@/components/prompts/Pagination';
import type { PromptType } from '@/types/Prompt';  // ADD
```

**BEFORE (data fetching - after line 37):**
```typescript
  // Conditionally fetch data based on search query
  const categoriesData = await getCategories();
  let searchResults = null;
```

**AFTER (data fetching):**
```typescript
  // Conditionally fetch data based on search query
  const categoriesData = await getCategories();
  const promptTypesData = await getPromptTypes();  // ADD: Fetch prompt types
  let searchResults = null;
```

**BEFORE (filter rendering - line ~126):**
```typescript
              <PromptFilters categories={categoriesData} jobRoles={[]} />
```

**AFTER (filter rendering):**
```typescript
              <PromptFilters
                categories={categoriesData}
                jobRoles={[]}
                promptTypes={promptTypesData}  // ADD
              />
```

**BEFORE (mobile filter - line ~114):**
```typescript
            <PromptFiltersMobile categories={categoriesData} jobRoles={[]} />
```

**AFTER (mobile filter):**
```typescript
            <PromptFiltersMobile
              categories={categoriesData}
              jobRoles={[]}
              promptTypes={promptTypesData}  // ADD
            />
```

---

### Task 8: Add getPromptTypes Service Function

**File:** `chatgpt-bible-frontend/lib/services/prompts.ts`
**Lines:** Add after line 595 (end of file)

**ADD NEW FUNCTION:**
```typescript
/**
 * Fetch all prompt types from Directus with server-side caching
 *
 * @returns Array of PromptType objects for filtering and display
 *
 * Query Structure:
 * - Fetches all prompt types
 * - Sorts by sort field (if available)
 * - Returns empty array on error
 */
export async function getPromptTypes(): Promise<PromptType[]> {
  try {
    const promptTypes = await directus.request(
      readItems('prompt_types', {
        fields: ['id', 'name_th', 'name_en', 'slug', 'icon', 'description_th', 'description_en', 'sort'],
        sort: ['sort'],
      })
    );

    return promptTypes as unknown as PromptType[];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
    console.error('Error fetching prompt types:', errorMsg, error);
    return [];
  }
}
```

Also update the import at the top of the file to include `PromptType`:

**BEFORE (line 3):**
```typescript
import type { PromptCard, Prompt } from '@/types/Prompt';
```

**AFTER:**
```typescript
import type { PromptCard, Prompt, PromptType } from '@/types/Prompt';
```

---

### Task 9: Update getPrompts Service to Support Prompt Type Filtering

**File:** `chatgpt-bible-frontend/lib/services/prompts.ts`
**Lines:** 14-21 (GetPromptsFilters interface) and ~192-195 (filter application)

**BEFORE (interface):**
```typescript
export interface GetPromptsFilters {
  page?: number;
  limit?: number;
  categories?: string[];
  jobRoles?: string[];
  difficulty?: string;
  search?: string;
}
```

**AFTER (interface):**
```typescript
export interface GetPromptsFilters {
  page?: number;
  limit?: number;
  categories?: string[];
  jobRoles?: string[];
  difficulty?: string;
  promptType?: string;  // ADD: Filter by prompt type slug
  search?: string;
}
```

**BEFORE (filter application - around line 192-195):**
```typescript
    // Add difficulty filter
    if (filters.difficulty) {
      filter['difficulty_level'] = { _eq: filters.difficulty };
    }
```

**AFTER (filter application):**
```typescript
    // Add difficulty filter
    if (filters.difficulty) {
      filter['difficulty_level'] = { _eq: filters.difficulty };
    }

    // Add prompt type filter - ADD
    if (filters.promptType) {
      filter['prompt_type_id'] = {
        _in: await getPromptTypeIdsBySlug(filters.promptType),
      };
    }
```

**ADD HELPER FUNCTION** (add before `getPrompts` function):

```typescript
/**
 * Helper: Get prompt type IDs by slug
 * Used for filtering prompts by prompt type slug
 */
async function getPromptTypeIdsBySlug(slug: string): Promise<string[]> {
  try {
    const promptTypes = await directus.request(
      readItems('prompt_types', {
        filter: { slug: { _eq: slug } },
        fields: ['id'],
        limit: 1,
      })
    );
    return promptTypes.map((pt: any) => pt.id);
  } catch (error) {
    console.error('Error fetching prompt type by slug:', error);
    return [];
  }
}
```

---

## Complete Chain Checklist

- [ ] **Directus Schema** (`prompts` collection)
  - [ ] Add `short_title_th` field (string, 256, nullable)
  - [ ] Add `short_title_en` field (string, 256, nullable)
  - [ ] Populate short titles for existing prompts

- [ ] **TypeScript Interface** (`types/Prompt.ts`)
  - [ ] Add `PromptType` interface
  - [ ] Add `PromptUseCase` type
  - [ ] Update `Prompt` interface with `prompt_type` relationship
  - [ ] Update `PromptCard` interface with `short_title_th`, `short_title_en`, `prompt_type`, `prompt_type_icon`

- [ ] **Service Function** (`lib/services/prompts.ts`)
  - [ ] Add `getPromptTypes()` function
  - [ ] Add `getPromptTypeIdsBySlug()` helper
  - [ ] Update `getPrompts()` to fetch `short_title_th`, `short_title_en`, and `prompt_type_id` deep relation
  - [ ] Update `getPromptsBySubcategory()` to fetch same fields
  - [ ] Update `getPopularPrompts()` to fetch same fields
  - [ ] Add `promptType` to `GetPromptsFilters` interface
  - [ ] Add prompt type filtering logic

- [ ] **Component** (`components/prompts/`)
  - [ ] Create `PromptMethodBadge.tsx`
  - [ ] Update `PromptCard.tsx` to use `short_title` for displayTitle
  - [ ] Update `PromptCard.tsx` to show method badge
  - [ ] Update `PromptFilters.tsx` to add prompt type filter
  - [ ] Update `PromptFiltersMobile.tsx` to add prompt type filter

- [ ] **Page** (`app/prompts/page.tsx`)
  - [ ] Import `getPromptTypes` and `PromptType`
  - [ ] Fetch `promptTypesData`
  - [ ] Pass `promptTypes` to filter components

- [ ] **Directus Collection** (`prompt_types`)
  - [ ] Create 4 records in `prompt_types` collection
  - [ ] Verify slugs: `fill-in-blank`, `open-ended`, `question-based`, `educational`
  - [ ] Set icons: 📝, 💡, ❓, 📚

- [ ] **Validation** (`npm run build`)
  - [ ] TypeScript compilation passes
  - [ ] No lint errors
  - [ ] Build succeeds

---

## Directus Setup Checklist

Use the MCP Directus tools or manually create in Directus admin:

### 1. prompts Collection - Add 2 New Fields

| Field | Type | Required? | Max Length | Interface |
|-------|------|-----------|------------|-----------|
| **short_title_th** | string | No | 256 | Input |
| **short_title_en** | string | No | 256 | Input |

**Via Directus Admin:**
- [ ] Navigate to Settings → Data Model → `prompts` collection
- [ ] Add Field → String (Input) → `short_title_th`
- [ ] Add Field → String (Input) → `short_title_en`
- [ ] Save changes

**Data Migration:** Populate short titles for existing prompts (see Task 0 for examples)

### 2. prompt_types Collection - 4 Records to Create

| Field | Record 1 | Record 2 | Record 3 | Record 4 |
|-------|----------|----------|----------|----------|
| **id** | (auto-generated UUID) | (auto-generated UUID) | (auto-generated UUID) | (auto-generated UUID) |
| **name_th** | เติมคำ | ปลายเปิด | คำถามนำ | ศึกษา |
| **name_en** | Fill-in-the-Blank | Open-Ended | Question-Based | Educational |
| **slug** | fill-in-blank | open-ended | question-based | educational |
| **icon** | 📝 | 💡 | ❓ | 📚 |
| **description_th** | สูตรสำเร็จ - เติมข้อมูลและใช้ทันที | คู่คิดระดมสมอง - สำรวจไอเดีย | คำถามนำ - ถามเพื่อกระตุ้นความคิด | ตำราเรียน - ศึกษาโครงสร้าง |
| **description_en** | Quick templates - fill and use | Brainstorming partner - explore ideas | Guided questions - spark thinking | Strategic playbook - study patterns |
| **sort** | 1 | 2 | 3 | 4 |

---

## Validation Steps

After completing all tasks:

```bash
# 1. Type check
npx tsc --noEmit

# 2. Lint
npm run lint

# 3. Build
npm run build

# 4. Verify in browser
# - Navigate to /prompts
# - Check that prompt type badges appear on cards
# - Check that prompt type filter appears in sidebar
# - Filter by prompt type and verify results
```

---

## Migration Notes

### Updating Existing Prompts with prompt_type_id

After creating the prompt_types, existing prompts need to be updated:

1. **Via Directus Admin**: Batch edit prompts by category/subcategory
   - Fill-in-the-Blank → `fill-in-blank`
   - Open-Ended → `open-ended`
   - Question-Based → `question-based`
   - Educational → `educational`

2. **Via SQL** (if you have Directus database access):
```sql
-- Example: Update all prompts in a specific subcategory
UPDATE prompts
SET prompt_type_id = 'UUID-OF-FILL-IN-BLANK-TYPE'
WHERE subcategory_id IN (
  SELECT id FROM subcategories WHERE slug = 'competitor-analysis'
);
```

3. **Gradual rollout**: Start with newly created prompts having `prompt_type_id` set

---

## Success Metrics

After implementation, track:
- Filter usage: Which prompt type is most selected?
- Badge visibility: Do users notice and understand the badges?
- Conversion: Do users who filter by type complete more actions?

---

## Next Steps (Phase 2)

After Phase 1 is complete and validated:
1. Add 3-method selector hero section
2. Create method-specific landing pages
3. Add placeholder count indicator
4. Add estimated time to complete

See research document for full Phase 2 scope.
