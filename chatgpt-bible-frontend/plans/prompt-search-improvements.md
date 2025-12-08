# Implementation Plan: Prompt Search Function Improvements

## Overview

Improve the prompt search functionality to provide better search accuracy, include related data (categories/job roles), and enhance user experience with result counts and better search behavior.

## Research Summary

From `docs/research/prompt-search-improvements.md`:

- Current search uses Directus `search` parameter without field specification
- Search doesn't include related data (category names, job role names)
- Main `/prompts` page doesn't display search results (only subcategories)
- No search result count or relevance-based sorting
- Search works but has limitations in scope and UX

## Tasks

### Task 1: Enhance Search to Include Explicit Field Matching

**File**: `chatgpt-bible-frontend/lib/services/prompts.ts`  
**Lines**: 121-142

**BEFORE**:
```typescript
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
```

**AFTER**:
```typescript
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

    // Enhanced search: Use explicit field matching for better control
    if (filters.search) {
      const searchTerm = filters.search.trim();
      // Use _or filter to search across multiple fields
      // This gives us explicit control over which fields are searched
      const searchFilter = {
        _or: [
          { title_th: { _icontains: searchTerm } },
          { title_en: { _icontains: searchTerm } },
          { description: { _icontains: searchTerm } },
          { prompt_text: { _icontains: searchTerm } },
        ],
      };
      
      // Combine with existing filter using _and
      if (Object.keys(filter).length > 0) {
        query.filter = {
          _and: [
            filter,
            searchFilter,
          ],
        };
      } else {
        query.filter = searchFilter;
      }
    }
```

**Notes**: 
- Replaces generic `search` parameter with explicit field matching
- Uses `_icontains` for case-insensitive partial matching
- Searches in `title_th`, `title_en`, `description`, and `prompt_text`
- Combines with existing filters using `_and` logic

### Task 2: Add Search in Related Categories and Job Roles

**File**: `chatgpt-bible-frontend/lib/services/prompts.ts`  
**Lines**: 35-101 (filter logic section)

**BEFORE**:
```typescript
    // Step 1: Get prompt IDs filtered by categories/job roles if needed
    let filteredPromptIds: number[] | null = null;

    if (filters.categories && filters.categories.length > 0) {
      // ... existing category filter logic ...
    }

    if (filters.jobRoles && filters.jobRoles.length > 0) {
      // ... existing job role filter logic ...
    }
```

**AFTER**:
```typescript
    // Step 1: Get prompt IDs filtered by categories/job roles if needed
    let filteredPromptIds: number[] | null = null;
    let searchMatchedPromptIds: number[] | null = null;

    // If search is provided, also search in related categories and job roles
    if (filters.search) {
      const searchTerm = filters.search.trim();
      const searchMatchedIds: number[] = [];

      // Search in categories
      const matchingCategories = await directus.request(
        readItems('categories', {
          filter: {
            _or: [
              { name: { _icontains: searchTerm } },
              { name_th: { _icontains: searchTerm } },
              { name_en: { _icontains: searchTerm } },
              { slug: { _icontains: searchTerm } },
            ],
          },
          fields: ['id'],
        })
      );
      const matchingCategoryIds = matchingCategories.map((c: any) => c.id);

      if (matchingCategoryIds.length > 0) {
        const promptCategories = await directus.request(
          readItems('prompt_categories', {
            filter: { categories_id: { _in: matchingCategoryIds } },
            fields: ['prompts_id'],
          })
        );
        searchMatchedIds.push(...promptCategories.map((pc: any) => pc.prompts_id));
      }

      // Search in job roles
      const matchingJobRoles = await directus.request(
        readItems('job_roles', {
          filter: {
            _or: [
              { name: { _icontains: searchTerm } },
              { name_th: { _icontains: searchTerm } },
              { name_en: { _icontains: searchTerm } },
              { slug: { _icontains: searchTerm } },
            ],
          },
          fields: ['id'],
        })
      );
      const matchingJobRoleIds = matchingJobRoles.map((jr: any) => jr.id);

      if (matchingJobRoleIds.length > 0) {
        const promptJobRoles = await directus.request(
          readItems('prompt_job_roles', {
            filter: { job_roles_id: { _in: matchingJobRoleIds } },
            fields: ['prompts_id'],
          })
        );
        searchMatchedIds.push(...promptJobRoles.map((pjr: any) => pjr.prompts_id));
      }

      if (searchMatchedIds.length > 0) {
        searchMatchedPromptIds = [...new Set(searchMatchedIds)];
      }
    }

    if (filters.categories && filters.categories.length > 0) {
      // ... existing category filter logic ...
    }

    if (filters.jobRoles && filters.jobRoles.length > 0) {
      // ... existing job role filter logic ...
    }

    // Combine search-matched IDs with filter IDs
    if (searchMatchedPromptIds !== null) {
      if (filteredPromptIds !== null) {
        // Intersect: prompts must match both filters AND search
        filteredPromptIds = filteredPromptIds.filter(id => searchMatchedPromptIds.includes(id));
      } else {
        // Use search-matched IDs as the filter
        filteredPromptIds = searchMatchedPromptIds;
      }
    }
```

**Notes**:
- Adds search in related categories and job roles
- Finds prompts that match search term in category/job role names
- Combines with existing category/job role filters
- Uses union logic: prompt matches if search term found in prompt fields OR related category/job role

### Task 3: Update Count Query to Match Search Logic

**File**: `chatgpt-bible-frontend/lib/services/prompts.ts`  
**Lines**: 144-172

**BEFORE**:
```typescript
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
```

**AFTER**:
```typescript
    // Step 6: Get total count for pagination using same search logic
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

    // Apply same search logic as main query
    if (filters.search) {
      const searchTerm = filters.search.trim();
      const searchFilter = {
        _or: [
          { title_th: { _icontains: searchTerm } },
          { title_en: { _icontains: searchTerm } },
          { description: { _icontains: searchTerm } },
          { prompt_text: { _icontains: searchTerm } },
        ],
      };
      
      if (Object.keys(countFilter).length > 0) {
        countQuery.filter = {
          _and: [
            countFilter,
            searchFilter,
          ],
        };
      } else {
        countQuery.filter = searchFilter;
      }
    }
```

**Notes**:
- Updates count query to use same explicit field search logic
- Ensures count matches actual search results
- Maintains consistency between main query and count query

### Task 4: Add Search Result Count Display

**File**: `chatgpt-bible-frontend/components/prompts/SearchBar.tsx`  
**Lines**: 39-76

**BEFORE**:
```typescript
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg 
          className="h-5 w-5 text-zinc-500 group-focus-within:text-purple-400 transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search prompts by title, description, or category..."
        className="block w-full pl-12 pr-12 py-4 bg-zinc-900/50 border border-white/10 rounded-2xl text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all shadow-lg backdrop-blur-md"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
        {query && (
          <button
            onClick={clearSearch}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4 text-zinc-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <kbd className="hidden sm:inline-flex items-center border border-white/10 rounded px-2 text-xs font-sans font-medium text-zinc-500">
          ⌘K
        </kbd>
      </div>
    </div>
  );
```

**AFTER**:
```typescript
  return (
    <div className="space-y-2">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg 
            className="h-5 w-5 text-zinc-500 group-focus-within:text-purple-400 transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search prompts by title, description, or category..."
          className="block w-full pl-12 pr-12 py-4 bg-zinc-900/50 border border-white/10 rounded-2xl text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all shadow-lg backdrop-blur-md"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
          {query && (
            <button
              onClick={clearSearch}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Clear search"
            >
              <svg className="h-4 w-4 text-zinc-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center border border-white/10 rounded px-2 text-xs font-sans font-medium text-zinc-500">
            ⌘K
          </kbd>
        </div>
      </div>
      {/* Search result count will be displayed by parent component */}
    </div>
  );
```

**Notes**: 
- Minor refactor to allow parent to show result count
- SearchBar remains focused on input handling
- Result count display handled by page component

### Task 5: Update Service Function Documentation

**File**: `chatgpt-bible-frontend/lib/services/prompts.ts`  
**Lines**: 21-34

**BEFORE**:
```typescript
/**
 * Fetch paginated prompts from Directus with optional filters
 *
 * @param filters - Filter options including pagination, categories, job roles, difficulty, and search
 * @returns Prompts with pagination metadata
 *
 * Query Structure:
 * - Filters for published prompts only
 * - Supports filtering by categories, job roles, difficulty
 * - Supports full-text search (when implemented)
 * - Fetches related categories and job_roles via deep queries
 * - Sorts by newest first (date_created DESC)
 * - Returns total count for pagination
 */
```

**AFTER**:
```typescript
/**
 * Fetch paginated prompts from Directus with optional filters
 *
 * @param filters - Filter options including pagination, categories, job roles, difficulty, and search
 * @returns Prompts with pagination metadata
 *
 * Query Structure:
 * - Filters for published prompts only
 * - Supports filtering by categories, job roles, difficulty
 * - Enhanced search: Searches in title_th, title_en, description, prompt_text
 * - Also searches in related category names and job role names
 * - Uses explicit field matching with _icontains for case-insensitive partial matching
 * - Fetches related categories and job_roles via deep queries
 * - Sorts by newest first (id DESC)
 * - Returns total count for pagination
 *
 * Search Behavior:
 * - Searches prompt fields: title_th, title_en, description, prompt_text
 * - Searches related data: category names (name, name_th, name_en, slug), job role names (name, name_th, name_en, slug)
 * - Combines prompt field matches with related data matches using OR logic
 * - Case-insensitive partial matching
 */
```

**Notes**: 
- Updates documentation to reflect enhanced search behavior
- Documents which fields are searched
- Explains search logic and combination behavior

## Complete Chain Checklist

- [x] TypeScript Interface (types/) - No changes needed, `GetPromptsFilters` already has `search?: string`
- [ ] Service Function (lib/services/prompts.ts) - Enhanced search logic with explicit field matching
- [ ] Component Updates (components/prompts/) - SearchBar minor refactor, result count display (if needed)
- [ ] Directus Collection - No schema changes required
- [ ] Validation (npm run build)

## Directus Setup Checklist

No Directus collection changes required. The improvements use existing fields and relationships.

**Optional Performance Optimization:**
- Consider adding database indexes on search fields if performance becomes an issue:
  - `title_th`, `title_en`, `description`, `prompt_text` in `prompts` collection
  - `name`, `name_th`, `name_en`, `slug` in `categories` and `job_roles` collections

## Validation Steps

1. **Type Check**
   ```bash
   npx tsc --noEmit
   ```

2. **Lint Check**
   ```bash
   npm run lint
   ```

3. **Build Check**
   ```bash
   npm run build
   ```

4. **Manual Testing**
   - Test search in prompt titles (Thai and English)
   - Test search in descriptions
   - Test search in category names
   - Test search in job role names
   - Test search combined with category filter
   - Test search combined with job role filter
   - Test search combined with difficulty filter
   - Test search with multiple filters
   - Verify search result count accuracy
   - Test empty search results handling

## Implementation Notes

### Search Logic Explanation

The enhanced search uses a two-phase approach:

1. **Phase 1: Related Data Search**
   - Search in categories and job roles
   - Get prompt IDs that match via relationships
   - Store in `searchMatchedPromptIds`

2. **Phase 2: Prompt Field Search**
   - Search in prompt fields (title_th, title_en, description, prompt_text)
   - Use explicit `_or` filter with `_icontains` for each field
   - Combine with existing filters using `_and`

3. **Combination Logic**
   - If search matched related data, include those prompt IDs in filter
   - Prompt field search happens in the main query filter
   - Final result: prompts that match search in fields OR related data

### Performance Considerations

- Related data search adds 2-4 additional queries (categories + job roles + junction tables)
- This is acceptable for search functionality as it provides better results
- Consider caching if search becomes a performance bottleneck
- Database indexes on search fields will improve performance

### Future Enhancements (Out of Scope)

- Search result highlighting
- Search suggestions/autocomplete
- Search history
- Advanced search operators (AND/OR, phrases)
- Relevance-based sorting
- Search analytics

