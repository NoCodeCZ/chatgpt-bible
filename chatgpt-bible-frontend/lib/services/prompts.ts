import { directus } from '@/lib/directus';
import { readItems, readItem } from '@directus/sdk';
import type { PromptCard, Prompt } from '@/types/Prompt';
import { unstable_cache } from 'next/cache';

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
  search?: string; // Search query (for Story 2.4)
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
 * - Supports full-text search (when implemented)
 * - Fetches related categories and job_roles via deep queries
 * - Sorts by newest first (date_created DESC)
 * - Returns total count for pagination
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

    // Simple query - just get basic prompt fields
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
          'description',
          'difficulty_level',
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
