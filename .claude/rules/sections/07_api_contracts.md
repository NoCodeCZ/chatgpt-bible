- **Types vs CMS models**
  - Define shared types in `types/` that mirror Directus collections (e.g. `Prompt`, `Page`, `PageBlock`, `PageWithBlocks`).
  - Service functions returning data from Directus must cast to these types before returning, as in:

```ts
return pages[0] as unknown as Page;
```

  - When adding fields in Directus, update the `fields` arrays in service functions and the corresponding TypeScript types together.

- **Error handling across boundary**
  - Service functions talking to Directus:
    - Either return `null`/empty arrays on failure and log errors, or throw explicit errors.
    - Callers (like route handlers) must handle these cases (e.g. `if (!page) notFound();`).

- **Example contract (Page + blocks)**

```ts
// Service
export async function getPageWithBlocks(permalink: string): Promise<PageWithBlocks | null> { /* ... */ }

// Route usage
export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const permalink = slug ? `/${slug.join('/')}` : '/';
  const page = await getPageWithBlocks(permalink);
  if (!page) notFound();
  return (
    <main className="min-h-screen">
      {page.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </main>
  );
}
```

