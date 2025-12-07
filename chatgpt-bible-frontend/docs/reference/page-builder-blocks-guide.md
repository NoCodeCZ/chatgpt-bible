# Page Builder Blocks Reference

**Purpose:** Create reusable block components for the Directus page builder system. Blocks are rendered dynamically via `BlockRenderer` and stored in Directus collections.

## Overall Pattern

```
Directus Collection (block_*) → Service Function → Block Component → BlockRenderer → Page
```

## Step 1: Create Directus Collection

Use MCP Directus tools to create the block collection:

```typescript
// Collection name: block_myblock
// Fields:
// - id (UUID, primary key)
// - heading (string, required)
// - description (text, optional)
// - theme (enum: 'light' | 'dark', default: 'light')
// - date_created, date_updated (auto)
```

**Rules:** Collection name must start with `block_`, use UUID primary key, include `theme` field for styling variants, add all content fields as required/optional based on use case.

## Step 2: Define TypeScript Type

```typescript
// types/blocks.ts
import { BaseBlockMeta } from './blocks';

export interface MyBlock extends BaseBlockMeta {
  heading: string;
  description?: string;
  theme?: 'light' | 'dark';
  // Add block-specific fields
}
```

**Rules:** Extend `BaseBlockMeta` for consistency, use optional fields with `?`, match field names to Directus schema exactly, add JSDoc if complex.

## Step 3: Create Block Component

```typescript
// components/blocks/MyBlock.tsx
import type { MyBlock as MyBlockType } from '@/types/blocks';

interface MyBlockProps {
  data: MyBlockType;
}

export default function MyBlock({ data }: MyBlockProps) {
  const {
    heading,
    description,
    theme = 'light',
  } = data;

  const themeClasses = {
    light: 'bg-white text-gray-900',
    dark: 'bg-gray-900 text-white',
  }[theme];

  return (
    <section className={`py-16 px-4 ${themeClasses}`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">{heading}</h2>
        {description && (
          <p className="text-lg opacity-80">{description}</p>
        )}
      </div>
    </section>
  );
}
```

**Rules:** Default to Server Component (no `'use client'`), destructure props from `data`, provide default values, use semantic HTML (`<section>`), apply theme classes conditionally, handle optional fields with conditional rendering.

## Step 4: Register in BlockRenderer

```typescript
// components/blocks/BlockRenderer.tsx
import MyBlock from './MyBlock';

export default function BlockRenderer({ block }: BlockRendererProps) {
  if (block.hide_block) {
    return null;
  }

  switch (block.collection) {
    // ... existing cases
    case 'block_myblock':
      return <MyBlock data={block.data as any} />;
    
    default:
      console.warn(`Unknown block type: ${block.collection}`);
      return null;
  }
}
```

**Rules:** Add case for collection name (must match Directus collection), cast `block.data` with `as any` (type safety handled in component), handle `hide_block` flag, add default case with warning.

## Step 5: Update Block Type Union

```typescript
// types/blocks.ts
export type Block =
  | HeroBlock
  | CTABlock
  // ... existing blocks
  | MyBlock; // Add new block type

// Update PageBlock collection union
export interface PageBlock {
  collection: 
    | 'block_hero' 
    | 'block_cta'
    // ... existing collections
    | 'block_myblock'; // Add new collection
}
```

**Rules:** Add to `Block` union type, add to `PageBlock.collection` union, keep alphabetical order for maintainability.

## Step 6: Export from Index

```typescript
// components/blocks/index.ts
export { default as BlockRenderer } from './BlockRenderer';
export { default as HeroBlock } from './HeroBlock';
// ... existing exports
export { default as MyBlock } from './MyBlock';
```

**Rules:** Export all block components, use named exports, enable barrel imports.

## Quick Checklist

- [ ] Created Directus collection with `block_*` prefix
- [ ] Defined TypeScript type extending `BaseBlockMeta`
- [ ] Created block component in `components/blocks/`
- [ ] Component handles optional fields with null checks
- [ ] Component uses theme classes for styling variants
- [ ] Registered block in `BlockRenderer` switch statement
- [ ] Added block type to `Block` union in `types/blocks.ts`
- [ ] Added collection name to `PageBlock.collection` union
- [ ] Exported component from `components/blocks/index.ts`
- [ ] Tested block renders correctly with sample data
- [ ] Verified `hide_block` flag works
- [ ] Tested theme variants (if applicable)

