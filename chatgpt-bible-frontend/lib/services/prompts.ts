import { directus } from '@/lib/directus';
import { readItems, readItem } from '@directus/sdk';
import type { PromptCard, Prompt, PromptType } from '@/types/Prompt';
import { unstable_cache } from 'next/cache';
import type { PromptCard as BlockPromptCard } from '@/types/blocks';
import { isPromptInFreeTier } from '@/lib/utils/access-control';

export interface GetPromptsResult {
  data: PromptCard[];
  total: number;
  totalPages: number;
}

export interface GetPromptsFilters {
  page?: number;
  limit?: number;
  categories?: string[]; // Array of category slugs
  jobRoles?: string[]; // Array of job role slugs
  difficulty?: string; // 'beginner' | 'intermediate' | 'advanced'
  promptType?: string; // Filter by prompt type slug
  search?: string; // Search query (for Story 2.4)
}

/**
 * Helper: Get prompt type IDs by slug
 * Used for filtering prompts by prompt type slug
 */
async function getPromptTypeIdsBySlug(slug: string): Promise<string[]> {
  try {
    const promptTypes = await directus.request(
      readItems('prompt_types', {
        filter: { slug: { _eq: slug } },
        fields: ['id'],
        limit: 1,
      })
    );
    return promptTypes.map((pt: any) => pt.id);
  } catch (error) {
    console.error('Error fetching prompt type by slug:', error);
    return [];
  }
}

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
export async function getPrompts(
  filters: GetPromptsFilters = {}
): Promise<GetPromptsResult> {
  try {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;
    
    // Step 1: Get prompt IDs filtered by categories/job roles if needed
    let filteredPromptIds: number[] | null = null;
    let searchMatchedPromptIds: number[] | null = null;

    // If search is provided, also search in related categories and job roles
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.trim();
      const searchMatchedIds: number[] = [];

      // Search in categories and job roles (parallel queries for performance)
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

    // Add prompt type filter
    if (filters.promptType) {
      filter['prompt_type_id'] = {
        _in: await getPromptTypeIdsBySlug(filters.promptType),
      };
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
        'short_title_th',
        'short_title_en',
        'description',
        'difficulty_level',
        'prompt_type_id',
        'prompt_type_id.id',
        'prompt_type_id.name_th',
        'prompt_type_id.name_en',
        'prompt_type_id.slug',
        'prompt_type_id.icon',
        'subcategory_id.id',
        'subcategory_id.name_th',
        'subcategory_id.name_en',
        'subcategory_id.category_id.id',
        'subcategory_id.category_id.name',
        'subcategory_id.category_id.name_th',
        'subcategory_id.category_id.name_en',
        'subcategory_id.category_id.slug',
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

/**
 * Fetch a single prompt by ID from Directus with server-side caching
 *
 * @param id - Prompt ID (numeric ID)
 * @returns Prompt object with all details, or null if not found
 *
 * Query Structure:
 * - Fetches single prompt by ID
 * - Includes all fields including prompt_text
 * - Includes related categories and job_roles via deep queries
 * - Returns null for 404/not found errors
 * - Throws error for other API failures
 * 
 * Cache TTL: 5 minutes (matches ISR revalidate)
 * Tags: ['prompts', `prompt-${id}`] for on-demand revalidation
 */
export async function getPromptById(id: string): Promise<Prompt | null> {
  return unstable_cache(
    async () => {
      try {
        const prompt = await directus.request(
          readItem('prompts', id, {
            fields: [
              'id',
              'status',
              'title',
              'title_th',
              'title_en',
              'description',
              'prompt_text',
              'difficulty_level',
              'sort',
              'prompt_type_id',
              'subcategory_id',
            ],
          })
        );

        return prompt as unknown as Prompt;
      } catch (error: any) {
        // Return null for 404 errors, throw for other errors
        if (error?.response?.status === 404 || error?.errors?.[0]?.extensions?.code === 'RECORD_NOT_FOUND') {
          return null;
        }
        console.error('Error fetching prompt:', error);
        throw new Error('Failed to fetch prompt');
      }
    },
    [`prompt-${id}`],
    {
      revalidate: 300, // 5 minutes (matches ISR revalidate)
      tags: ['prompts', `prompt-${id}`],
    }
  )();
}

/**
 * Fetch prompts by subcategory ID
 */
export async function getPromptsBySubcategory(
  subcategoryId: string,
  page: number = 1,
  limit: number = 20
): Promise<GetPromptsResult> {
  try {
    const offset = (page - 1) * limit;

    // Query with full prompt text for expanded display
    const prompts = await directus.request(
      readItems('prompts', {
        filter: {
          status: { _eq: 'published' },
          subcategory_id: { _eq: subcategoryId },
        },
        fields: [
          'id',
          'title_th',
          'title_en',
          'short_title_th',
          'short_title_en',
          'description',
          'prompt_text',
          'difficulty_level',
          'prompt_type_id',
          'prompt_type_id.id',
          'prompt_type_id.name_th',
          'prompt_type_id.name_en',
          'prompt_type_id.slug',
          'prompt_type_id.icon',
          'subcategory_id.id',
          'subcategory_id.name_th',
          'subcategory_id.name_en',
          'subcategory_id.category_id.id',
          'subcategory_id.category_id.name',
          'subcategory_id.category_id.name_th',
          'subcategory_id.category_id.name_en',
          'subcategory_id.category_id.slug',
        ],
        limit,
        offset,
        sort: ['-id'],
      })
    );

    // Get total count
    const allPrompts = await directus.request(
      readItems('prompts', {
        filter: {
          status: { _eq: 'published' },
          subcategory_id: { _eq: subcategoryId },
        },
        fields: ['id'],
        limit: -1,
      })
    );

    const total = allPrompts.length;
    const totalPages = Math.ceil(total / limit);

    return {
      data: prompts as unknown as PromptCard[],
      total,
      totalPages,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
    console.error('Error fetching prompts by subcategory:', errorMsg, error);
    return { data: [], total: 0, totalPages: 0 };
  }
}

/**
 * Fetch popular prompts for landing page
 * Returns the most recent published prompts (limited count)
 * Fetches prompts with subcategory relationship for category tags
 * 
 * @param limit - Number of prompts to fetch (default: 6)
 * @returns Array of PromptCard objects suitable for PromptsGridBlock
 */
export async function getPopularPrompts(limit: number = 6): Promise<PromptCard[]> {
  try {
    const prompts = await directus.request(
      readItems('prompts', {
        filter: {
          status: { _eq: 'published' },
        },
        fields: [
          'id',
          'title_th',
          'title_en',
          'description',
          'difficulty_level',
          'subcategory_id.id',
          'subcategory_id.name_th',
          'subcategory_id.name_en',
          'subcategory_id.category_id.id',
          'subcategory_id.category_id.name',
          'subcategory_id.category_id.name_th',
          'subcategory_id.category_id.name_en',
          'subcategory_id.category_id.slug',
        ],
        limit,
        sort: ['-id'], // Most recent first
      })
    );

    return prompts as unknown as PromptCard[];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
    console.error('Error fetching popular prompts:', errorMsg, error);
    return [];
  }
}

/**
 * Transform PromptCard to PromptsGridBlock format
 * Handles badge determination, icon extraction, tag generation, and link creation
 * 
 * @param prompt - PromptCard from Directus
 * @param index - 0-based index of prompt (for premium/free determination)
 * @returns BlockPromptCard formatted for PromptsGridBlock component
 */
export async function transformPromptToBlockCard(
  prompt: PromptCard,
  index: number
): Promise<BlockPromptCard> {
  // Determine badge (free or premium)
  const isFree = await isPromptInFreeTier(prompt.id);
  const badge: 'free' | 'premium' = isFree ? 'free' : 'premium';

  // Get title (prioritize Thai, fallback to English)
  const title = prompt.title_th || prompt.title_en || 'Untitled Prompt';

  // Extract tags from subcategory's category
  const tags: string[] = [];
  
  // Get category from subcategory relationship
  if (prompt.subcategory_id && typeof prompt.subcategory_id === 'object') {
    const subcategory = prompt.subcategory_id;
    const category = subcategory.category_id;
    
    if (category && typeof category === 'object') {
      // Prefer Thai name, fallback to English, then name
      const categoryName = category.name_th || category.name_en || category.name;
      if (categoryName && !tags.includes(categoryName)) {
        tags.push(categoryName);
      }
    }
    
    // Add subcategory name as tag if available
    const subcategoryName = subcategory.name_th || subcategory.name_en;
    if (subcategoryName && !tags.includes(subcategoryName)) {
      tags.push(subcategoryName);
    }
  }

  // Extract icon and color based on category
  // For now, we'll use default icons based on category or a generic icon
  // This can be enhanced later to use actual prompt_type.icon field
  let icon: string | undefined;
  let iconColor: string = 'purple';

  // Simple icon color selection based on category from subcategory
  if (prompt.subcategory_id && typeof prompt.subcategory_id === 'object') {
    const category = prompt.subcategory_id.category_id;
    if (category && typeof category === 'object') {
      // Map categories to icon colors based on slug
      const categorySlug = category.slug?.toLowerCase() || '';
      if (categorySlug.includes('business')) {
        iconColor = 'purple';
      } else if (categorySlug.includes('marketing')) {
        iconColor = 'blue';
      } else if (categorySlug.includes('ai') || categorySlug.includes('tech')) {
        iconColor = 'green';
      } else if (categorySlug.includes('education')) {
        iconColor = 'pink';
      } else if (categorySlug.includes('data')) {
        iconColor = 'cyan';
      }
    }
  }

  // Default icon (can be replaced with prompt_type.icon if available)
  icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-file-text w-6 h-6"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>`;

  // Create link to prompt detail page
  const link = `/prompts/${prompt.id}`;

  return {
    title,
    description: prompt.description || undefined,
    icon,
    icon_color: iconColor,
    tags: tags.slice(0, 3), // Limit to 3 tags
    badge,
    views: 0, // TODO: Add view_count field to prompts collection
    link,
  };
}

/**
 * Fetch all prompt types from Directus with server-side caching
 *
 * @returns Array of PromptType objects for filtering and display
 *
 * Query Structure:
 * - Fetches all prompt types
 * - Sorts by sort field (if available)
 * - Returns empty array on error
 */
export async function getPromptTypes(): Promise<PromptType[]> {
  try {
    const promptTypes = await directus.request(
      readItems('prompt_types', {
        fields: ['id', 'name_th', 'name_en', 'slug', 'icon', 'description_th', 'description_en', 'sort'],
        sort: ['sort'],
      })
    );

    return promptTypes as unknown as PromptType[];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
    console.error('Error fetching prompt types:', errorMsg, error);
    return [];
  }
}
