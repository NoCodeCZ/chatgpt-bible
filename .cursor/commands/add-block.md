# /add-block [name]

## Purpose

Create new Directus page builder block with complete chain integration. Ensures TypeScript interface, service function, React component, and Directus collection are all aligned.

## When to Use

- **New page builder block** - FAQ, testimonials, features, etc.
- **CMS content blocks** - Reusable content components
- **Page builder extensions** - New block types for pages

## Complete Chain

1. **TypeScript Interface** (`types/blocks.ts`)
   - Add `Block{Name}` interface
   - Register in blocks union type
   - Include all block fields

2. **Service Function** (`lib/directus-pages.ts` or `lib/services/`)
   - Create `get{Name}Block(blockId)` function
   - Or extend `getBlockData()` to handle new type
   - Fetch block data from Directus

3. **React Component** (`components/blocks/{Name}.tsx`)
   - Accept data prop with block type
   - Handle null/empty states gracefully
   - Use Server Component by default

4. **Block Renderer Wiring** (`components/blocks/BlockRenderer.tsx`)
   - Add case for new block type
   - Map to component
   - Handle type safety

5. **Directus Collection** (checklist provided)
   - Create `block_{name}` collection
   - Add fields matching TypeScript interface
   - Configure M2A junction (`page_blocks`)

6. **Validation**
   - Run `npm run lint && npx tsc --noEmit && npm run build`
   - Verify no type errors
   - Ensure build succeeds

## Process

1. **Add TypeScript Interface**
   - Update `types/blocks.ts`
   - Add `Block{Name}` interface
   - Add to union type

2. **Create/Extend Service Function**
   - Add block fetching logic
   - Handle block data retrieval

3. **Create React Component**
   - Build component in `components/blocks/{Name}.tsx`
   - Handle props and null states
   - Use Server Component pattern

4. **Wire to BlockRenderer**
   - Update `components/blocks/BlockRenderer.tsx`
   - Add case statement for new block type
   - Ensure type safety

5. **Schema Alignment Table**
   - Create table showing TypeScript ↔ Directus mapping
   - Ensure field names match exactly

6. **Provide Directus Checklist**
   - Collection name: `block_{name}`
   - Field definitions
   - M2A junction configuration
   - Permissions

7. **Validate**
   - Run full validation suite
   - Fix any errors

## Output Format

- **TypeScript Interface**: Updated in `types/blocks.ts`
- **Service Function**: Created/updated
- **React Component**: Created in `components/blocks/{Name}.tsx`
- **BlockRenderer**: Updated with new block type
- **Schema Alignment Table**: TypeScript ↔ Directus mapping
- **Directus Checklist**: Detailed setup instructions
- **Validation Status**: Lint, type check, build results

## Example

```typescript
// types/blocks.ts
export interface BlockFaq {
  type: 'faq';
  headline?: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

// components/blocks/Faq.tsx
export default function Faq({ data }: { data: BlockFaq }) {
  if (!data.faqs || data.faqs.length === 0) return null;
  
  return (
    <section>
      {data.headline && <h2>{data.headline}</h2>}
      {/* FAQ content */}
    </section>
  );
}
```

## Reference

- Page builder blocks guide: `chatgpt-bible-frontend/docs/reference/page-builder-blocks-guide.md`
- Complete chain: `.claude/rules/sections/12_slash_commands.md#the-chain-for-blocks`
- Existing blocks: `components/blocks/`

