# Directus Service Functions Reference

**Purpose:** Create service functions in `lib/services/` for fetching and transforming Directus data. Never call Directus directly from components.

## Overall Pattern

```
Service Function → Directus SDK → Type Cast → Error Handling → Return Typed Data
```

## Step 1: Define Function Signature

```typescript
// lib/services/my-collection.ts
import { directus } from '@/lib/directus';
import { readItems, readItem } from '@directus/sdk';
import type { MyCollection } from '@/types/MyCollection';

export interface GetMyCollectionFilters {
  page?: number;
  limit?: number;
  status?: string;
}

export interface GetMyCollectionResult {
  data: MyCollection[];
  total: number;
  totalPages: number;
}
```

**Rules:** Export filter interfaces, return interfaces for complex results, import types from `@/types/`, use `@directus/sdk` operations.

## Step 2: Implement Service Function

```typescript
export async function getMyCollectionItems(
  filters: GetMyCollectionFilters = {}
): Promise<MyCollection[]> {
  try {
    const items = await directus.request(
      readItems('my_collection', {
        filter: { status: { _eq: 'published' } },
        fields: ['id', 'title', 'description', 'date_created'],
        sort: ['-date_created'],
        limit: filters.limit || 20,
        offset: filters.page ? (filters.page - 1) * (filters.limit || 20) : 0,
      })
    );
    
    return items as unknown as MyCollection[];
  } catch (error) {
    console.error('Error fetching my collection:', error);
    return [];
  }
}
```

**Rules:** Always filter by `status: { _eq: 'published' }`, specify `fields` array explicitly, handle errors gracefully (return empty array or throw), cast to TypeScript type with `as unknown as`.

## Step 3: Handle Relationships

```typescript
// For M2M relationships via junction tables
export async function getItemsWithRelations(): Promise<ItemWithRelations[]> {
  try {
    // Fetch main items
    const items = await directus.request(
      readItems('items', {
        fields: ['id', 'title'],
        filter: { status: { _eq: 'published' } },
      })
    );

    const itemIds = items.map((item: any) => item.id);

    // Fetch relationships separately
    const relationships = itemIds.length > 0 ? await directus.request(
      readItems('item_categories', {
        filter: { item_id: { _in: itemIds } },
        fields: ['item_id', 'category_id.*'],
      })
    ) : [];

    // Merge relationships
    return items.map((item: any) => ({
      ...item,
      categories: relationships
        .filter((rel: any) => rel.item_id === item.id)
        .map((rel: any) => rel.category_id),
    })) as unknown as ItemWithRelations[];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}
```

**Rules:** Fetch main items first, get IDs, fetch relationships separately, merge in TypeScript (not via Directus deep queries for complex M2M).

## Step 4: Implement Pagination

```typescript
export async function getPaginatedItems(
  filters: GetMyCollectionFilters = {}
): Promise<GetMyCollectionResult> {
  try {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const [items, countResult] = await Promise.all([
      directus.request(
        readItems('my_collection', {
          filter: { status: { _eq: 'published' } },
          fields: ['*'],
          limit,
          offset,
          sort: ['-date_created'],
        })
      ),
      directus.request(
        aggregate('my_collection', {
          filter: { status: { _eq: 'published' } },
          aggregate: { count: '*' },
        })
      ),
    ]);

    const total = Number(countResult[0]?.count) || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: items as unknown as MyCollection[],
      total,
      totalPages,
    };
  } catch (error) {
    console.error('Error:', error);
    throw new Error(`Failed to fetch items: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
```

**Rules:** Calculate offset from page/limit, use `Promise.all` for parallel queries, use `aggregate` for count, calculate totalPages, throw errors for critical failures.

## Step 5: Add JSDoc Documentation

```typescript
/**
 * Fetch items from Directus with optional filtering and pagination
 *
 * @param filters - Filter options including pagination and status
 * @returns Items array or empty array on error
 *
 * Query Structure:
 * - Filters for published items only
 * - Supports pagination via page/limit
 * - Sorts by newest first
 * - Returns empty array on error (logs to console)
 */
export async function getMyCollectionItems(...) { ... }
```

**Rules:** Include purpose, parameter descriptions, return type, query behavior notes.

## Quick Checklist

- [ ] Created file in `lib/services/` with collection name
- [ ] Imported `directus` from `@/lib/directus`
- [ ] Imported SDK operations (`readItems`, `readItem`, `aggregate`)
- [ ] Imported TypeScript types from `@/types/`
- [ ] Defined filter/result interfaces if needed
- [ ] Added `try/catch` error handling
- [ ] Filtered by `status: { _eq: 'published' }` (if applicable)
- [ ] Specified explicit `fields` array (not `['*']` for performance)
- [ ] Cast result with `as unknown as MyType`
- [ ] Added JSDoc documentation
- [ ] Handled relationships (if M2M, fetch separately and merge)
- [ ] Implemented pagination (if needed) with `aggregate` for count
- [ ] Exported function as named export
- [ ] Tested with error cases and edge cases
