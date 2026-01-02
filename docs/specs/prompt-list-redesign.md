# Prompt List UX Redesign - Front-End Specification

## Overview

**Goal:** Redesign the subcategory prompt list to display prompts in a fully expanded format with one-click copy buttons, eliminating the need for users to navigate to detail pages.

**Current Flow:** 3 clicks to copy (subcategory → card → detail → copy)
**Target Flow:** 1 click to copy (subcategory → copy button)

---

## UX Requirements

### Page: `/prompts/subcategory/[id]`

**Layout:**
- Header section: Subcategory name, description, prompt count
- List of prompts, each showing:
  - Title (Thai/English)
  - Full prompt text (preformatted, monospace)
  - Copy button (prominent, always visible)
  - Difficulty badge
  - Category badge

**Key Features:**
1. **One-Click Copy** - Primary action, always visible
2. **Full Prompt Visibility** - No clicking to expand
3. **Clear Visual Hierarchy** - Easy to scan
4. **Copy Feedback** - "Copied!" confirmation
5. **Mobile Responsive** - Works on all screen sizes

---

## Component Specification

### New Component: `PromptListItem`

```tsx
interface PromptListItemProps {
  prompt: {
    id: number;
    title_th: string;
    title_en: string;
    description: string;
    prompt_text: string;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    subcategory_id: {
      id: number;
      name_th: string;
      name_en: string;
      category_id: {
        id: string;
        name_th: string;
        name_en: string;
        slug: string;
      };
    };
  };
  isLocked?: boolean;
}
```

**Features:**
- Full prompt text in code block
- Copy button with feedback
- Difficulty badge (color-coded)
- Category badge
- Lock overlay for premium prompts

---

## Visual Design

### Color Scheme (Dark Theme)

| Element | Color | Usage |
|---------|-------|-------|
| Background | `bg-black` | Page background |
| Card Background | `bg-zinc-900/60` | Prompt item background |
| Border | `border-white/10` | Card borders |
| Accent (Primary) | `purple-500/20` | Highlights, badges |
| Copy Button | `bg-purple-600` | Primary action |
| Copy Button (Hover) | `bg-purple-500` | Primary action hover |

### Difficulty Badge Colors

| Level | Color | Hex |
|-------|-------|-----|
| Beginner | `green-500` | Green |
| Intermediate | `yellow-500` | Yellow |
| Advanced | `red-500` | Red |

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Subcategory Name                    X prompts available   │
│  Description                                                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ [Beginner] [Category Name]                      [Copy] │ │
│  │                                                          │ │
│  │  Prompt Title                                            │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │ Full prompt text in monospace font                 │ │ │
│  │  │ [placeholder text goes here]                       │ │ │
│  │  │ Users can see entire prompt at a glance            │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ [Advanced] [Category Name]                      [Copy] │ │
│  │  ...                                                    │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Checklist

- [ ] Create `PromptListItem` component with copy functionality
- [ ] Create `useCopyToClipboard` hook for copy logic
- [ ] Update `getPromptsBySubcategory` to include `prompt_text` field
- [ ] Update subcategory page to use new `PromptListItem` instead of `PromptCard`
- [ ] Add loading skeleton for new layout
- [ ] Add copy feedback animation
- [ ] Test on mobile, tablet, desktop
- [ ] Test locked prompt state

---

## Files to Modify

| File | Change |
|------|--------|
| `lib/services/prompts.ts` | Add `prompt_text` to query fields |
| `components/prompts/PromptListItem.tsx` | **NEW** - Create this component |
| `components/prompts/useCopyToClipboard.ts` | **NEW** - Create copy hook |
| `app/prompts/subcategory/[id]/page.tsx` | Use `PromptListItem` instead of `PromptCard` |
| `components/prompts/PromptList.tsx` | Update to render `PromptListItem` |

---

## API Changes

### Update `getPromptsBySubcategory` Query

Add `prompt_text` to fields array:

```ts
fields: [
  'id',
  'title_th',
  'title_en',
  'description',
  'prompt_text',  // ← ADD THIS
  'difficulty_level',
  'subcategory_id.id',
  'subcategory_id.name_th',
  'subcategory_id.name_en',
  'subcategory_id.category_id.id',
  'subcategory_id.category_id.name_th',
  'subcategory_id.category_id.name_en',
  'subcategory_id.category_id.slug',
],
```

---

## Copy Interaction Flow

```
User clicks [Copy] button
    ↓
Copy prompt_text to clipboard
    ↓
Show "Copied!" feedback on button
    ↓
After 2 seconds, revert to "Copy" text
    ↓
Button ready for next copy action
```

---

## Accessibility Requirements

- Copy button has proper `aria-label`
- Keyboard accessible (Enter/Space to copy)
- Focus visible on interactive elements
- Proper heading hierarchy (h1 → h2 → h3)
- Code block has `role="region"` and `aria-label="Prompt text"`
