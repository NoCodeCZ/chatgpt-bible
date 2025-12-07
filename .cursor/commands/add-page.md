# /add-page [type] [route]

## Purpose

Create new Next.js pages with complete chain integration. Ensures TypeScript interface, service function, page component, and Directus collection are all aligned.

## When to Use

- **New list page** - Collection listing (e.g., `/categories`)
- **New detail page** - Dynamic detail with `[slug]` (e.g., `/categories/[slug]`)
- **New CMS page** - Block-based page using Directus page builder

## Page Types

- **`list`** - Collection listing page (e.g., `/categories`)
- **`detail`** - Dynamic detail page with `[slug]` route (e.g., `/categories/[slug]`)
- **`cms`** - Block-based page using Directus page builder (e.g., `/about`)

## Complete Chain

1. **TypeScript Interface** (`types/`)
   - Verify/create interface matching Directus collection
   - Export from `types/` if needed

2. **Service Function** (`lib/services/`)
   - Create/verify service function(s)
   - For list: `get{Name}s()` function
   - For detail: `get{Name}BySlug(slug)` function
   - For CMS: Use existing page builder functions

3. **Page Component** (`app/{route}/page.tsx` or `app/{route}/[slug]/page.tsx`)
   - Create page file(s)
   - Use Server Component pattern
   - Handle empty states gracefully

4. **Metadata & SEO**
   - Static metadata for list/CMS pages
   - `generateMetadata()` for detail pages
   - Proper title, description, etc.

5. **ISR Configuration**
   - Include `export const revalidate = 60` for data-fetching pages
   - Enable incremental static regeneration

6. **Directus Collection** (checklist provided)
   - Collection setup instructions
   - Field definitions
   - Relations (if any)
   - Permissions

7. **Validation**
   - Run `npm run lint && npx tsc --noEmit && npm run build`
   - Verify no type errors
   - Ensure build succeeds

## Process

### List Page

1. **Verify TypeScript Interface**
   - Check `types/` for interface
   - Create if needed

2. **Create Service Function**
   - `get{Name}s()` in `lib/services/{name}.ts`
   - Follow existing patterns

3. **Create Page**
   - `app/{route}/page.tsx`
   - Fetch data with service function
   - Render list with empty state handling

4. **Add Metadata**
   - Static metadata export
   - SEO-friendly title and description

### Detail Page

1. **Verify TypeScript Interface**
   - Check `types/` for interface
   - Create if needed

2. **Create Service Function**
   - `get{Name}BySlug(slug)` in `lib/services/{name}.ts`
   - Handle not found cases

3. **Create Page**
   - `app/{route}/[slug]/page.tsx`
   - Fetch data with service function
   - Handle 404 cases

4. **Add Metadata**
   - `generateMetadata()` function
   - Dynamic metadata based on data

5. **Add Static Params** (if applicable)
   - `generateStaticParams()` for static generation
   - Pre-render common pages

### CMS Page

1. **Use Existing Page Builder**
   - Use `getPageBySlug()` from `lib/directus-pages.ts`
   - Use `BlockRenderer` component

2. **Create Page**
   - `app/{route}/page.tsx` or `app/{route}/[slug]/page.tsx`
   - Fetch page data
   - Render with BlockRenderer

3. **Add Metadata**
   - Static or dynamic metadata
   - Use page data if available

## Output Format

- **TypeScript Interface**: Created/updated in `types/`
- **Service Function**: Created/updated in `lib/services/`
- **Page Component**: Created in `app/{route}/`
- **Metadata**: Added with proper SEO
- **ISR**: Configured with revalidate
- **Schema Alignment Table**: TypeScript ↔ Directus mapping
- **Directus Checklist**: Detailed setup instructions
- **Validation Status**: Lint, type check, build results

## Example

```typescript
// app/categories/page.tsx
import { getCategories } from '@/lib/services/categories';
import { Category } from '@/types/Category';

export const revalidate = 60;

export const metadata = {
  title: 'Categories',
  description: 'Browse all categories',
};

export default async function CategoriesPage() {
  const categories = await getCategories();
  
  if (!categories || categories.length === 0) {
    return <div>No categories found</div>;
  }
  
  return (
    <div>
      {categories.map((category) => (
        <div key={category.id}>{category.name}</div>
      ))}
    </div>
  );
}
```

## Reference

- App router pages guide: `chatgpt-bible-frontend/docs/reference/app-router-pages-guide.md`
- Complete chain: `.claude/rules/sections/12_slash_commands.md#the-chain-for-pages`
- Existing pages: `app/`

