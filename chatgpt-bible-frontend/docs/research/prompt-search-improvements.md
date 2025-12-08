# Research: Prompt Search Function Improvements

## Overview

Current search implementation for prompts uses Directus's built-in `search` parameter, but there are opportunities to improve search accuracy, performance, and user experience. This research documents the current system behavior and identifies improvement opportunities.

## Current System Behavior

### Search Flow

1. **User Input** (`components/prompts/SearchBar.tsx`)
   - Client component with 500ms debounce
   - Updates URL query parameter: `?search=query`
   - Resets to page 1 on new search

```12:29:chatgpt-bible-frontend/components/prompts/SearchBar.tsx
  // Debounce search input (500ms as per Story 2.4 requirements)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      if (query.trim()) {
        params.set('search', query.trim());
      } else {
        params.delete('search');
      }

      // Reset to page 1 on new search
      params.delete('page');

      router.push(`/prompts?${params.toString()}`);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query, router, searchParams]);
```

2. **Service Function** (`lib/services/prompts.ts`)
   - Accepts `search` in `GetPromptsFilters`
   - Passes search directly to Directus `readItems` query
   - Search applied to both main query and count query

```136:138:chatgpt-bible-frontend/lib/services/prompts.ts
    if (filters.search) {
      query.search = filters.search;
    }
```

3. **Directus Search Behavior**
   - Directus `search` parameter performs full-text search
   - Default behavior: searches across all text fields in the collection
   - No explicit field configuration in current implementation
   - Search is case-insensitive and supports partial matching

### Current Limitations

1. **No Field Specification**
   - Search parameter doesn't specify which fields to search
   - Relies on Directus default behavior (all text fields)
   - May not search in related fields (categories, job roles)

2. **No Search in Related Data**
   - Categories and job roles are fetched separately
   - Search doesn't include category names or job role names
   - User can't find prompts by searching for category names

3. **No Search Results on Main Page**
   - `/prompts` page shows subcategories, not prompt results
   - Search bar exists but doesn't display search results
   - Search only works if integrated into a prompt listing view

4. **No Search Ranking/Relevance**
   - Results sorted by ID (newest first)
   - No relevance-based sorting
   - No highlighting of matched terms

5. **Limited Search Fields**
   - Current fields fetched: `id`, `title_th`, `title_en`, `description`, `difficulty_level`
   - `prompt_text` not included in search results (but may be searched)
   - No search in category/job role names

## Key Patterns

### Service Function Pattern

```35:199:chatgpt-bible-frontend/lib/services/prompts.ts
export async function getPrompts(
  filters: GetPromptsFilters = {}
): Promise<GetPromptsResult> {
  try {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;
    
    // Step 1: Get prompt IDs filtered by categories/job roles if needed
    let filteredPromptIds: number[] | null = null;

    if (filters.categories && filters.categories.length > 0) {
      // Get category IDs from slugs
      const categories = await directus.request(
        readItems('categories', {
          filter: { slug: { _in: filters.categories } },
          fields: ['id'],
        })
      );
      const categoryIds = categories.map((c: any) => c.id);

      if (categoryIds.length > 0) {
        // Get prompt IDs from junction table
        const promptCategories = await directus.request(
          readItems('prompt_categories', {
            filter: { categories_id: { _in: categoryIds } },
            fields: ['prompts_id'],
          })
        );
        filteredPromptIds = [...new Set(promptCategories.map((pc: any) => pc.prompts_id))];
      } else {
        // No matching categories, return empty
        return { data: [], total: 0, totalPages: 0 };
      }
    }

    if (filters.jobRoles && filters.jobRoles.length > 0) {
      // Get job role IDs from slugs
      const jobRoles = await directus.request(
        readItems('job_roles', {
          filter: { slug: { _in: filters.jobRoles } },
          fields: ['id'],
        })
      );
      const jobRoleIds = jobRoles.map((jr: any) => jr.id);

      if (jobRoleIds.length > 0) {
        // Get prompt IDs from junction table
        const promptJobRoles = await directus.request(
          readItems('prompt_job_roles', {
            filter: { job_roles_id: { _in: jobRoleIds } },
            fields: ['prompts_id'],
          })
        );
        const jobRolePromptIds = [...new Set(promptJobRoles.map((pjr: any) => pjr.prompts_id))];

        // Intersect with category filter if exists
        if (filteredPromptIds !== null) {
          filteredPromptIds = filteredPromptIds.filter(id => jobRolePromptIds.includes(id));
        } else {
          filteredPromptIds = jobRolePromptIds;
        }
      } else {
        // No matching job roles, return empty
        return { data: [], total: 0, totalPages: 0 };
      }
    }

    // Step 2: Build filter for prompts
    const filter: any = {
      status: { _eq: 'published' },
    };

    // Add prompt ID filter if we have filtered IDs
    if (filteredPromptIds !== null && filteredPromptIds.length > 0) {
      filter['id'] = { _in: filteredPromptIds };
    } else if (filteredPromptIds !== null && filteredPromptIds.length === 0) {
      // No matching prompts, return empty
      return { data: [], total: 0, totalPages: 0 };
    }

    // Add difficulty filter
    if (filters.difficulty) {
      filter['difficulty_level'] = { _eq: filters.difficulty };
    }

    // Step 3: Fetch prompts with simple fields
    const query: any = {
      filter,
      limit,
      offset,
      fields: [
        'id',
        'title_th',
        'title_en',
        'description',
        'difficulty_level',
      ],
      sort: ['-id'],
    };

    if (filters.search) {
      query.search = filters.search;
    }

    const prompts = await directus.request(
      readItems('prompts', query)
    );

    // Step 6: Get total count for pagination using simple query
    const countFilter: any = { status: { _eq: 'published' } };
    
    if (filteredPromptIds !== null && filteredPromptIds.length > 0) {
      countFilter['id'] = { _in: filteredPromptIds };
    } else if (filteredPromptIds !== null && filteredPromptIds.length === 0) {
      return { data: [], total: 0, totalPages: 0 };
    }
    
    if (filters.difficulty) {
      countFilter['difficulty_level'] = { _eq: filters.difficulty };
    }

    const countQuery: any = {
      filter: countFilter,
      fields: ['id'],
      limit: -1,
    };

    if (filters.search) {
      countQuery.search = filters.search;
    }

    const allMatchingPrompts = await directus.request(
      readItems('prompts', countQuery)
    );

    const total = allMatchingPrompts.length;
    const totalPages = Math.ceil(total / limit);

    return {
      data: prompts as unknown as PromptCard[],
      total,
      totalPages,
    };
  } catch (error) {
    // Better error logging
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'object' && error !== null
      ? JSON.stringify(error, null, 2)
      : String(error);
    
    const errorDetails = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : error;
    
    console.error('Error fetching prompts:', {
      error: errorDetails,
      errorMessage,
      filters,
    });
    
    throw new Error(`Failed to fetch prompts: ${errorMessage}`);
  }
}
```

### Filter Integration Pattern

- Filters are combined via intersection (AND logic)
- Category/job role filters use junction tables to get prompt IDs first
- Search is applied after ID filtering
- All filters must match for a prompt to appear

## Similar Implementations

### Directus Search Documentation Pattern

Based on Directus SDK patterns, search can be enhanced with:
- Explicit field specification
- Deep query search in related collections
- Custom filter combinations

## Constraints & Considerations

1. **Directus Search Limitations**
   - Directus `search` parameter has limited control
   - No built-in relevance scoring
   - May not search in related collections by default

2. **Performance Considerations**
   - Current approach uses ID filtering first, then search
   - This is efficient for category/job role filters
   - Search on large datasets may need optimization

3. **Multi-language Support**
   - Prompts have `title_th` and `title_en`
   - Search should work in both languages
   - May need language-specific search handling

4. **Search Scope**
   - Should search in: title (both languages), description, prompt_text
   - Should optionally search in: category names, job role names
   - Current implementation may not search all these fields

## Code References

- Search input: `chatgpt-bible-frontend/components/prompts/SearchBar.tsx:1-76`
- Service function: `chatgpt-bible-frontend/lib/services/prompts.ts:35-199`
- Filter interface: `chatgpt-bible-frontend/lib/services/prompts.ts:12-19`
- Prompt types: `chatgpt-bible-frontend/types/Prompt.ts:24-83`
- Main prompts page: `chatgpt-bible-frontend/app/prompts/page.tsx:23-95`

## Recommendations

### Improvement Opportunities

1. **Explicit Field Search**
   - Specify which fields Directus should search
   - Ensure `title_th`, `title_en`, `description`, `prompt_text` are all searched
   - May require Directus configuration or custom filter logic

2. **Related Data Search**
   - Search in category names and job role names
   - Find prompts by searching for related category/job role terms
   - May require additional queries or filter logic

3. **Search Results Display**
   - If main `/prompts` page should show search results, integrate `getPrompts` with search
   - Create a unified view that shows either subcategories OR search results
   - Handle empty states appropriately

4. **Search Performance**
   - Consider adding database indexes for search fields
   - Optimize queries when search is combined with filters
   - Cache search results if appropriate

5. **Search UX Enhancements**
   - Add search result count display
   - Show "X results for 'query'" message
   - Highlight search terms in results (client-side)
   - Add search suggestions/autocomplete

6. **Advanced Search Features**
   - Multi-word search with AND/OR logic
   - Phrase search (quoted strings)
   - Search in specific fields only
   - Search history/recent searches

## Next Steps

- Review Directus search documentation for field specification options
- Test current search behavior to identify gaps
- Plan implementation of recommended improvements
- Consider search result display integration on main prompts page

