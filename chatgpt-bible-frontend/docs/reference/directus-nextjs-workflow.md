# Directus + Next.js Workflow Reference

**Purpose:** Step-by-step guide for creating page blocks, Directus collections, and prompt components.

## Overall Pattern

```
Directus Collection → TypeScript Types → Service Function → React Component → Integration
```

## Step 1: Create Directus Collection

**Directus Admin:** Settings → Data Model → Create Collection
- Name: `block_myblock` (lowercase, snake_case)
- Primary Key: `id` (UUID, auto-generated)

**Field Rules:** `snake_case` naming, text: use `text` type (unlimited), images: `uuid` with `file` special, JSON arrays: `json` type, mark required fields.

**Collection Settings:**
```typescript
display_template: "{{heading}}"
sort_field: "sort"  // Optional
archive_field: "status"
```

**Permissions:** Settings → Roles & Permissions → Public (read), Admin (full)

## Step 2: Define TypeScript Types

```typescript
// types/blocks.ts (for page blocks)
export interface MyBlock extends BaseBlockMeta {
  heading: string;
  description?: string;
  items: Array<{ title: string; content: string }>;
  theme?: 'light' | 'dark';
}

export type Block = HeroBlock | CTABlock | MyBlock;

export interface PageBlock {
  collection: 'block_hero' | 'block_myblock'; // Add here
}
```

**Rules:** Extend `BaseBlockMeta` for blocks, use `?` for optional fields, match Directus field names exactly.

## Step 3: Create Service Function

```typescript
// lib/services/my-collection.ts
import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import type { MyCollection } from '@/types/MyCollection';

export async function getMyCollectionItems(): Promise<MyCollection[]> {
  try {
    const items = await directus.request(
      readItems('my_collection', {
        filter: { status: { _eq: 'published' } },
        fields: ['*'],
        sort: ['-date_created'],
      })
    );
    return items as unknown as MyCollection[];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}
```

**Rules:** Always filter by `status: { _eq: 'published' }`, handle errors gracefully, use TypeScript types.

## Step 4: Create React Component

### Page Block Component

```typescript
// components/blocks/MyBlock.tsx
import type { MyBlock as MyBlockType } from '@/types/blocks';

interface MyBlockProps {
  data: MyBlockType;
}

export default function MyBlock({ data }: MyBlockProps) {
  const { heading, description, items, theme = 'light' } = data;
  return (
    <section className={`py-16 px-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">{heading}</h2>
        {description && <p className="text-lg mb-8">{description}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Prompt Component

```typescript
// components/prompts/MyPromptComponent.tsx
'use client'; // If using hooks

import type { Prompt } from '@/types/Prompt';

interface MyPromptComponentProps {
  prompt: Prompt;
  onAction?: () => void;
}

export default function MyPromptComponent({ prompt, onAction }: MyPromptComponentProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-2">{prompt.title_en || prompt.title_th}</h3>
      <p className="text-gray-600 mb-4">{prompt.description}</p>
      {onAction && (
        <button onClick={onAction} className="px-4 py-2 bg-blue-600 text-white rounded">
          Action
        </button>
      )}
    </div>
  );
}
```

**Rules:** PascalCase component name, single `data` prop typed, Tailwind classes only, handle optional fields conditionally.

## Step 5: Register Block in BlockRenderer

**When:** Adding new page block (skip for prompt components)

```typescript
// components/blocks/BlockRenderer.tsx
import MyBlock from './MyBlock';

export default function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.collection) {
    case 'block_hero': return <HeroBlock data={block.data as any} />;
    case 'block_myblock': return <MyBlock data={block.data as any} />;
    default:
      console.warn(`Unknown block type: ${block.collection}`);
      return null;
  }
}
```

```typescript
// components/blocks/index.ts
export { default as MyBlock } from './MyBlock';
```

**Rules:** Add case matching collection name exactly, use `as any` for type assertion, export from `index.ts`.

## Step 6: Use in Pages

**Page Blocks:** Render automatically via `app/(pages)/[...slug]/page.tsx` - no code changes needed.

**Prompt Components:**
```typescript
// app/prompts/page.tsx
import MyPromptComponent from '@/components/prompts/MyPromptComponent';
import { getPrompts } from '@/lib/services/prompts';

export default async function PromptsPage() {
  const { data: prompts } = await getPrompts({ limit: 20 });
  return (
    <div>
      {prompts.map((prompt) => (
        <MyPromptComponent key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
}
```

## Quick Checklist

**New Page Block:** Created `block_*` collection (UUID) → Set permissions → Added interface to `types/blocks.ts` extending `BaseBlockMeta` → Updated `Block` union and `PageBlock.collection` → Created component in `components/blocks/` → Added case to `BlockRenderer.tsx` → Exported from `index.ts` → Tested

**New Directus Collection:** Created collection (UUID) → Added fields (snake_case) → Configured meta → Set permissions → Created TypeScript type → Created service function → Tested

**New Prompt Component:** Created component in `components/prompts/` → Used `Prompt`/`PromptCard` type → Added `'use client'` if using hooks → Handled bilingual fields → Integrated in page → Tested

**Validation:** TypeScript compiles → ESLint passes → Component renders without errors → Data flows correctly → Responsive design works
