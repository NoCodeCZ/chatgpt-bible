# React Components Reference

**Purpose:** Create reusable React components following Next.js App Router patterns. Default to Server Components, use Client Components only for interactivity.

## Overall Pattern

```
Server Component (default) → Fetches data → Passes to Client Component (if needed) → Renders UI
```

## Step 1: Determine Server vs Client Component

**Server Component (default):**
```typescript
// components/blocks/HeroBlock.tsx (no 'use client')
import type { HeroBlock as HeroBlockType } from '@/types/blocks';

interface HeroBlockProps {
  data: HeroBlockType;
}

export default function HeroBlock({ data }: HeroBlockProps) {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-4">{data.heading}</h1>
        {data.description && <p className="text-lg text-white/90">{data.description}</p>}
      </div>
    </section>
  );
}
```

**Client Component (only if needed):**
```typescript
// components/prompts/CopyButton.tsx
'use client';

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="px-4 py-2 bg-blue-600 text-white rounded">
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
```

**Rules:** Omit `'use client'` unless using hooks (`useState`, `useEffect`), browser APIs (`navigator`, `window`), or event handlers. Server Components can receive props and render, but cannot use hooks.

## Step 2: Define Props Interface

```typescript
import type { PromptCard as PromptCardType } from '@/types/Prompt';

interface PromptCardProps {
  prompt: PromptCardType;
  onAction?: () => void; // Optional callback
}

export default function PromptCard({ prompt, onAction }: PromptCardProps) {
  // Component implementation
}
```

**Rules:** Use PascalCase for props interface name (`ComponentNameProps`), import types from `@/types/`, mark optional props with `?`, use descriptive prop names.

## Step 3: Handle Optional Data

```typescript
export default function PromptCard({ prompt }: PromptCardProps) {
  // Extract and handle optional nested data
  const subcategory = prompt.subcategory_id;
  const subcategoryName = subcategory && typeof subcategory === 'object' && subcategory !== null
    ? (subcategory.name_en || subcategory.name_th || null)
    : null;

  // Provide defaults
  const displayTitle = prompt.title_en || prompt.title_th || 'Untitled Prompt';
  const displayCategories = prompt.categories?.slice(0, 3) || [];

  return (
    <article>
      {subcategoryName && (
        <div className="mb-3">
          <span className="badge">{subcategoryName}</span>
        </div>
      )}
      <h3>{displayTitle}</h3>
    </article>
  );
}
```

**Rules:** Check for null/undefined before accessing nested properties, handle both object and ID cases for relationships, provide fallback values, use conditional rendering with `&&` or ternary.

## Step 4: Structure Component Markup

```typescript
export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Link href={`/prompts/${prompt.id}`}>
      <article className="group block h-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all">
        {/* Header section */}
        <div className="mb-4">
          {subcategoryName && <span className="badge">{subcategoryName}</span>}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col space-y-3">
          <h3 className="text-lg font-bold">{displayTitle}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">{prompt.description}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t">
          <DifficultyBadge level={prompt.difficulty_level} />
          <span>View →</span>
        </div>
      </article>
    </Link>
  );
}
```

**Rules:** Use semantic HTML (`<article>`, `<section>`, `<header>`), group related content, use Tailwind utility classes only, add hover/transition states, use `flex-1` and `mt-auto` for flex layouts.

## Step 5: Handle Lists and Maps

```typescript
export default function PromptList({ prompts }: { prompts: PromptCard[] }) {
  if (prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No prompts found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
}
```

**Rules:** Always handle empty state, use stable `key` prop (prefer ID over index), use responsive grid classes, map over arrays in JSX.

## Step 6: Export Component

```typescript
// components/prompts/index.ts
export { default as PromptCard } from './PromptCard';
export { default as PromptList } from './PromptList';
```

**Rules:** Create `index.ts` in feature folder, export all components, use named exports, enable barrel imports.

## Quick Checklist

- [ ] Determined Server vs Client Component (default to Server)
- [ ] Added `'use client'` only if using hooks/browser APIs
- [ ] Created props interface with `ComponentNameProps` pattern
- [ ] Imported types from `@/types/`
- [ ] Handled optional/nullable data with null checks
- [ ] Provided fallback values for optional props
- [ ] Used semantic HTML elements
- [ ] Applied Tailwind classes (no inline styles)
- [ ] Handled empty states for lists
- [ ] Used stable `key` prop for mapped items
- [ ] Exported from `index.ts` (if feature folder)
- [ ] Tested with missing/null data
- [ ] Verified responsive design (mobile/desktop)
