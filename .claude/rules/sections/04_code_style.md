- **General**
  - **Imports**: Framework imports (`next`, `react`) first, then third-party, then absolute app imports (`@/lib/...`, `@/components/...`), then relative.
  - **Naming**:
    - Components: `PascalCase` (e.g. `PromptCard`, `HeroBlock`).
    - Functions & variables: `camelCase` (e.g. `getPageWithBlocks`, `truncateDescription`).
    - Types & interfaces: `PascalCase` with `Type` suffix only when disambiguation is needed.

- **React components**
  - Use function components with explicit props interfaces:

```tsx
'use client';

import Link from 'next/link';
import type { PromptCard as PromptCardType } from '@/types/Prompt';
import DifficultyBadge from '@/components/ui/DifficultyBadge';

interface PromptCardProps {
  prompt: PromptCardType;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const truncateDescription = (text: string, maxLength: number = 100): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  // ...
}
```

  - Use `"use client";` only where hooks, browser APIs, or client-only libraries are needed.
  - Keep components focused: single responsibility, with derived data computed inside (e.g. `subcategoryName`, `displayCategories`).

- **Docstrings & comments**
  - Use JSDoc-style headers for non-trivial utilities, especially in `lib/` and `scripts/`:

```ts
/**
 * Fetch a page with all its blocks (complete page data)
 */
export async function getPageWithBlocks(permalink: string): Promise<PageWithBlocks | null> { /* ... */ }
```

  - Use inline comments to explain *why*, not *what*, when the intent is non-obvious.

