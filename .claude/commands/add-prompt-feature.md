# /add-prompt-feature [name]

## Purpose

Add new feature to the prompt catalog system with complete chain integration. Ensures TypeScript interface, service function, component, and Directus collection (if needed) are all aligned.

## When to Use

- **New prompt catalog features** - Filters, search, sorting, favorites, etc.
- **Prompt-related functionality** - Features specific to the prompt system
- **Catalog enhancements** - UI or functionality improvements

## Complete Chain

1. **TypeScript Interface** (`types/Prompt.ts` or related)
   - Verify/update Prompt interface
   - Add related types if needed
   - Export from `types/`

2. **Service Function** (`lib/services/prompts.ts` or new service)
   - Create/update service function
   - Follow existing `getPrompts()` pattern
   - Handle filters, pagination, relations

3. **React Component** (`components/prompts/` or `app/prompts/`)
   - Create UI component
   - Use service function
   - Handle loading/error states

4. **Integration**
   - Integrate with existing prompt pages
   - Update `app/prompts/page.tsx` if needed
   - Ensure proper data flow

5. **Directus Collection** (if new)
   - Create/update collection if schema changes
   - Add fields matching TypeScript
   - Set up relations (categories, job_roles, etc.)

6. **Validation**
   - Run `npm run lint && npx tsc --noEmit && npm run build`
   - Verify no type errors
   - Ensure build succeeds

## Process

1. **Review Existing Prompt System**
   - Check `types/Prompt.ts` for interface
   - Review `lib/services/prompts.ts` for patterns
   - Understand existing components in `components/prompts/`

2. **Update TypeScript Interface**
   - Add/update types as needed
   - Ensure type safety

3. **Create/Update Service Function**
   - Follow `getPrompts()` pattern
   - Add new functionality
   - Handle edge cases

4. **Create Component**
   - Build component in appropriate location
   - Use Server Component by default
   - Add `"use client"` only if interactivity needed

5. **Integrate with Pages**
   - Update `app/prompts/page.tsx` if needed
   - Ensure proper data flow
   - Handle loading/error states

6. **Directus Checklist** (if schema changes)
   - Provide checklist if collection changes needed
   - Note field additions/modifications

7. **Validate**
   - Run full validation suite
   - Fix any errors

## Feature Examples

- **Filters** - Category, job role, tag filters
- **Search** - Full-text search functionality
- **Sorting** - Sort by date, popularity, etc.
- **Related Prompts** - Show related prompts
- **Favorites** - User favorites functionality
- **Pagination** - Paginated prompt lists
- **Tags** - Tag-based filtering

## Output Format

- **TypeScript Interface**: Created/updated in `types/`
- **Service Function**: Created/updated in `lib/services/prompts.ts`
- **Component**: Created in `components/prompts/` or `app/prompts/`
- **Integration**: Updated existing pages
- **Directus Checklist**: If schema changes needed
- **Validation Status**: Lint, type check, build results

## Example

```typescript
// lib/services/prompts.ts
export async function getPromptsByCategory(
  categorySlug: string
): Promise<Prompt[] | null> {
  try {
    const response = await directus.items('prompts').readByQuery({
      fields: ['*', 'category.*'],
      filter: {
        category: {
          slug: {
            _eq: categorySlug,
          },
        },
      },
    });
    return response.data || null;
  } catch (error) {
    console.error('Error fetching prompts by category:', error);
    return null;
  }
}
```

## Reference

- Prompt system: `types/Prompt.ts`, `lib/services/prompts.ts`
- Existing components: `components/prompts/`
- Prompt pages: `app/prompts/`
- Complete chain: `.claude/rules/sections/12_slash_commands.md#the-chain-for-prompt-features`

