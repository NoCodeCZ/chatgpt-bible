# /add-service [name]

## Purpose

Create new Directus service function with complete chain integration. Ensures TypeScript interface, service function, and Directus collection are all aligned.

## When to Use

- **Adding new data source** - New Directus collection to query
- **New entity type** - Categories, testimonials, products, etc.
- **Extending data layer** - New service functions needed

## Complete Chain

1. **TypeScript Interface** (`types/`)
   - Verify/create interface matching Directus collection
   - Export from `types/` if needed
   - Include all fields with correct types

2. **Service Function** (`lib/services/{name}.ts`)
   - Create `get{Name}()` function
   - Use Directus client from `lib/directus.ts`
   - Follow existing patterns (error handling, null returns)
   - Handle relations properly (expand with `'relation.*'`)

3. **Error Handling**
   - Use try-catch blocks
   - Return `null` on error (not throw, unless critical)
   - Log errors with `console.error`

4. **Directus Collection Checklist**
   - Provide detailed checklist matching TypeScript interface
   - Include field names, types, and relations
   - Note permissions (public read for content)

5. **Validation**
   - Run `npm run lint && npx tsc --noEmit && npm run build`
   - Verify no type errors
   - Ensure build succeeds

## Process

1. **Check Existing Types**
   - Review `types/` for existing interface
   - Create or update as needed

2. **Create Service Function**
   - Follow pattern from `lib/services/prompts.ts`
   - Use proper Directus query syntax
   - Handle relations and filters

3. **Schema Alignment Table**
   - Create table showing TypeScript ↔ Directus mapping
   - Ensure field names match exactly
   - Verify types align (Input→string, JSON→array, etc.)

4. **Provide Directus Checklist**
   - Collection name
   - Field definitions
   - Relations (if any)
   - Permissions

5. **Validate**
   - Run full validation suite
   - Fix any errors

## Output Format

- **TypeScript Interface**: Created/updated in `types/`
- **Service Function**: Created in `lib/services/{name}.ts`
- **Schema Alignment Table**: TypeScript ↔ Directus mapping
- **Directus Checklist**: Detailed setup instructions
- **Validation Status**: Lint, type check, build results

## Example

```typescript
// types/Category.ts
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  // ...
}

// lib/services/categories.ts
import { directus } from '@/lib/directus';
import { Category } from '@/types/Category';

export async function getCategories(): Promise<Category[] | null> {
  try {
    const response = await directus.items('categories').readByQuery({
      fields: ['*'],
      sort: ['sort'],
    });
    return response.data || null;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return null;
  }
}
```

## Reference

- Service functions guide: `chatgpt-bible-frontend/docs/reference/service-functions-guide.md`
- Complete chain: `.claude/rules/sections/12_slash_commands.md#the-chain-for-services`
- Existing patterns: `lib/services/prompts.ts`

