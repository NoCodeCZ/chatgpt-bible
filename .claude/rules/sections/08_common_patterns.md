- **Backend-like service pattern (Directus data fetching)**

```ts
export async function getAllPages(): Promise<Page[]> {
  try {
    const pages = await directus.request(
      readItems('pages', {
        filter: { status: { _eq: 'published' } },
        fields: ['id', 'title', 'permalink', 'page_type', 'published_date'],
        sort: ['sort', 'published_date'],
        limit: -1,
      }),
    );
    return (pages || []) as unknown as Page[];
  } catch (error) {
    console.error('Error fetching all pages:', error);
    return [];
  }
}
```

- **Frontend component pattern (card/list UI)**

```tsx
export default function PromptCard({ prompt }: PromptCardProps) {
  const subcategory = prompt.subcategory_id;
  const subcategoryName =
    subcategory && typeof subcategory === 'object' && subcategory !== null
      ? subcategory.name_en || subcategory.name_th || null
      : null;

  const displayCategories = prompt.categories?.slice(0, 3) || [];
  const displayTitle = prompt.title_en || prompt.title_th || 'Untitled Prompt';

  return (
    <Link href={`/prompts/${prompt.id}`}>
      <article className="group block h-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-blue-400 transition-all duration-200 cursor-pointer flex flex-col">
        {/* ... */}
      </article>
    </Link>
  );
}
```

- **Migration script pattern**
  - Use a clearly documented CLI entry, env loading, and logger:

```js
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not installed, use process.env directly
}
```

  - Validate inputs, process in batches, and track results in an object (`migrationResult`).

