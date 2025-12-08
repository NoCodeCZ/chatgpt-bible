# Implementation Plan: Prompt Search Function Improvements

## Overview

Improve the prompt search functionality to provide better search accuracy, include related data (categories/job roles), and enhance user experience with result counts and better search behavior.

## Implementation Status

**Last Updated**: 2025-12-08  
**Status**: ✅ **Service Layer Complete** | ⚠️ **Page Integration Pending**

### Completed Tasks
- ✅ Task 1: Enhanced search with explicit field matching
- ✅ Task 2: Added search in related categories and job roles
- ✅ Task 3: Updated count query to match search logic
- ✅ Task 5: Updated service function documentation

### Pending Tasks
- ⚠️ Page Integration: `/prompts` page needs to read `search` parameter and display results
  - See `docs/research/prompt-search-functionality.md` for page integration details
  - This is a separate concern from service layer improvements

### Current State
The service layer (`lib/services/prompts.ts`) has been fully enhanced with:
- Explicit field matching using `_icontains` operators
- Search in related categories and job roles via junction tables
- Consistent search logic in both main query and count query
- Comprehensive documentation

The service function is ready to use but requires page-level integration to display search results.

## Research Summary

From `docs/research/prompt-search-improvements.md`:

- ✅ **FIXED**: Search now uses explicit field matching instead of generic `search` parameter
- ✅ **FIXED**: Search includes related data (category names, job role names)
- ⚠️ **PENDING**: Main `/prompts` page doesn't display search results (only subcategories)
- ⚠️ **PENDING**: No search result count display on page
- ✅ **FIXED**: Search accuracy improved with explicit field specification

## Tasks

### Task 1: Enhance Search to Include Explicit Field Matching ✅ COMPLETE

**File**: `chatgpt-bible-frontend/lib/services/prompts.ts`  
**Lines**: 210-242 (current implementation)

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
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.trim();
      
      // Build search conditions: field search OR related data search
      const searchConditions: any[] = [
        { title_th: { _icontains: searchTerm } },
        { title_en: { _icontains: searchTerm } },
        { description: { _icontains: searchTerm } },
        { prompt_text: { _icontains: searchTerm } },
      ];
      
      // If we found prompts via related data search, include them
      if (searchMatchedPromptIds !== null && searchMatchedPromptIds.length > 0) {
        searchConditions.push({ id: { _in: searchMatchedPromptIds } });
      }
      
      const searchFilter = {
        _or: searchConditions,
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

### Task 2: Add Search in Related Categories and Job Roles ✅ COMPLETE

**File**: `chatgpt-bible-frontend/lib/services/prompts.ts`  
**Lines**: 56-118 (current implementation)

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
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.trim();
      const searchMatchedIds: number[] = [];

      // Search in categories (parallel queries for performance)
      const [matchingCategories, matchingJobRoles] = await Promise.all([
        directus.request(
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
        ),
        directus.request(
          readItems('job_roles', {
            filter: {
              _or: [
                { name: { _icontains: searchTerm } },
                { slug: { _icontains: searchTerm } },
              ],
            },
            fields: ['id'],
          })
        ),
      ]);

      const matchingCategoryIds = matchingCategories.map((c: any) => c.id);
      const matchingJobRoleIds = matchingJobRoles.map((jr: any) => jr.id);

      // Get prompt IDs from junction tables (parallel queries)
      const [categoryPrompts, jobRolePrompts] = await Promise.all([
        matchingCategoryIds.length > 0
          ? directus.request(
              readItems('prompt_categories', {
                filter: { categories_id: { _in: matchingCategoryIds } },
                fields: ['prompts_id'],
              })
            )
          : Promise.resolve([]),
        matchingJobRoleIds.length > 0
          ? directus.request(
              readItems('prompt_job_roles', {
                filter: { job_roles_id: { _in: matchingJobRoleIds } },
                fields: ['prompts_id'],
              })
            )
          : Promise.resolve([]),
      ]);

      searchMatchedIds.push(...categoryPrompts.map((pc: any) => pc.prompts_id));
      searchMatchedIds.push(...jobRolePrompts.map((pjr: any) => pjr.prompts_id));

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
    // Note: searchMatchedPromptIds will be combined with field search in Task 1 using OR logic
    // Here we just store it for later use in the filter construction
```

**Notes**:
- Adds search in related categories and job roles
- **FIXED**: Removed `name_th` and `name_en` from JobRole search (they don't exist in JobRole type)
- Uses parallel queries (Promise.all) for better performance
- Finds prompts that match search term in category/job role names
- Search-matched IDs will be combined with field search using OR logic in Task 1

### Task 3: Update Count Query to Match Search Logic ✅ COMPLETE

**File**: `chatgpt-bible-frontend/lib/services/prompts.ts`  
**Lines**: 267-298 (current implementation)

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
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.trim();
      
      // Build search conditions: field search OR related data search
      const searchConditions: any[] = [
        { title_th: { _icontains: searchTerm } },
        { title_en: { _icontains: searchTerm } },
        { description: { _icontains: searchTerm } },
        { prompt_text: { _icontains: searchTerm } },
      ];
      
      // If we found prompts via related data search, include them
      if (searchMatchedPromptIds !== null && searchMatchedPromptIds.length > 0) {
        searchConditions.push({ id: { _in: searchMatchedPromptIds } });
      }
      
      const searchFilter = {
        _or: searchConditions,
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

### Task 4: Skip - No Changes Needed

**File**: `chatgpt-bible-frontend/components/prompts/SearchBar.tsx`  
**Status**: No changes required

**Notes**: 
- SearchBar component is already well-structured
- Search result count can be displayed by parent components if needed
- This task is removed from implementation scope

### Task 5: Update Service Function Documentation ✅ COMPLETE

**File**: `chatgpt-bible-frontend/lib/services/prompts.ts`  
**Lines**: 21-43 (current implementation)

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
 * - Searches related data: category names (name, name_th, name_en, slug), job role names (name, slug)
 * - Combines prompt field matches with related data matches using OR logic
 * - Case-insensitive partial matching
 * - Empty search terms are ignored
 */
```

**Notes**: 
- Updates documentation to reflect enhanced search behavior
- Documents which fields are searched
- Explains search logic and combination behavior

## Complete Chain Checklist

- [x] TypeScript Interface (types/) - No changes needed, `GetPromptsFilters` already has `search?: string`
- [x] Service Function (lib/services/prompts.ts) - ✅ Enhanced search logic with explicit field matching **COMPLETE**
- [x] Service Function Documentation - ✅ Updated to reflect enhanced search behavior **COMPLETE**
- [ ] Page Integration (app/prompts/page.tsx) - ⚠️ **PENDING**: Read `search` parameter and display results
- [ ] Component Updates (components/prompts/) - SearchBar works, but Enter key handler could be added (optional)
- [x] Directus Collection - No schema changes required
- [ ] Validation (npm run build) - Should be validated after page integration

## Directus Setup Checklist

No Directus collection changes required. The improvements use existing fields and relationships.

**Optional Performance Optimization:**
- Consider adding database indexes on search fields if performance becomes an issue:
  - `title_th`, `title_en`, `description`, `prompt_text` in `prompts` collection
  - `name`, `name_th`, `name_en`, `slug` in `categories` and `job_roles` collections

## Validation Steps

### Service Layer (Already Validated)
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

### Manual Testing (Service Layer)
- ✅ Test search in prompt titles (Thai and English)
- ✅ Test search in descriptions
- ✅ Test search in category names
- ✅ Test search in job role names
- ✅ Test search combined with category filter
- ✅ Test search combined with job role filter
- ✅ Test search combined with difficulty filter
- ✅ Test search with multiple filters
- ✅ Verify search result count accuracy
- ✅ Test empty search results handling

### Page Integration Testing (Pending)
- [ ] Test search on `/prompts` page displays results
- [ ] Test search results pagination
- [ ] Test search combined with category filters on page
- [ ] Test empty search state handling
- [ ] Test search result count display

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
   - Search in related data (categories/job roles) finds prompt IDs
   - Search in prompt fields uses explicit field matching
   - Both are combined using OR logic: prompt matches if search term found in fields OR related data
   - Final filter: (field search OR related data search) AND (other filters like category/job role/difficulty)

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

## Related Documentation

- **Service Layer Research**: `docs/research/prompt-search-improvements.md`
- **Page Integration Research**: `docs/research/prompt-search-functionality.md`
- **Service Function**: `lib/services/prompts.ts` (lines 44-332)
- **Page Implementation**: `app/prompts/page.tsx` (needs search integration)

