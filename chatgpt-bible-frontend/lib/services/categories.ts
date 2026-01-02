import { directus } from '@/lib/directus';
import { readItems, aggregate } from '@directus/sdk';
import type { Category } from '@/types/Category';
import { unstable_cache } from 'next/cache';

export interface CategoryWithSubcategories extends Category {
  subcategories: SubcategoryWithCount[];
}

export interface SubcategoryWithCount {
  id: string;
  name_th: string | null;
  name_en: string | null;
  slug: string;
  description_th: string | null;
  description_en: string | null;
  sort: number | null;
  prompt_count: number;
}

/**
 * Fetch all categories from Directus with server-side caching
 * Used for filter sidebar
 * 
 * Cache TTL: 1 hour (categories rarely change)
 * Tags: ['categories'] for on-demand revalidation
 */
export async function getCategories(): Promise<Category[]> {
  return unstable_cache(
    async () => {
      try {
        const categories = await directus.request(
          readItems('categories', {
            fields: ['id', 'name', 'slug', 'description', 'sort', 'name_th', 'name_en'],
            sort: ['sort', 'name'],
          })
        );

        return categories as unknown as Category[];
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    },
    ['categories'],
    {
      revalidate: 3600, // 1 hour
      tags: ['categories'],
    }
  )();
}

/**
 * Fetch all categories with their subcategories and prompt counts
 * Used for the "all-in-one" category-based layout on the prompts page
 *
 * Cache TTL: 1 hour (categories and subcategories rarely change)
 * Tags: ['categories', 'categories-with-subcategories'] for on-demand revalidation
 */
export async function getCategoriesWithSubcategories(): Promise<CategoryWithSubcategories[]> {
  return unstable_cache(
    async () => {
      try {
        const categories = await directus.request(
          readItems('categories', {
            fields: ['id', 'name', 'slug', 'description', 'sort', 'name_th', 'name_en'],
            sort: ['sort', 'name'],
          })
        );

        // Fetch subcategories for each category with prompt counts
        const categoriesWithSubcategories = await Promise.all(
          (categories as any[]).map(async (category) => {
            try {
              const subcategories = await directus.request(
                readItems('subcategories', {
                  filter: { category_id: { _eq: category.id } },
                  fields: [
                    'id',
                    'name_th',
                    'name_en',
                    'slug',
                    'description_th',
                    'description_en',
                    'sort',
                  ],
                  sort: ['sort', 'name_th'],
                })
              );

              // Get prompt counts for each subcategory
              const subcategoriesWithCounts = await Promise.all(
                (subcategories as any[]).map(async (sub) => {
                  try {
                    const countResult = await directus.request(
                      aggregate('prompts', {
                        aggregate: { count: '*' },
                        query: {
                          filter: {
                            subcategory_id: { _eq: sub.id },
                            status: { _eq: 'published' },
                          },
                        },
                      })
                    );
                    const count = Number(countResult[0]?.count) || 0;
                    return {
                      ...sub,
                      prompt_count: count,
                    };
                  } catch {
                    return {
                      ...sub,
                      prompt_count: 0,
                    };
                  }
                })
              );

              // Filter out subcategories with no prompts
              const filteredSubcategories = subcategoriesWithCounts.filter(
                (sub) => sub.prompt_count > 0
              );

              return {
                ...category,
                subcategories: filteredSubcategories,
              };
            } catch {
              return {
                ...category,
                subcategories: [],
              };
            }
          })
        );

        // Filter out categories with no subcategories
        return categoriesWithSubcategories.filter(
          (cat) => cat.subcategories.length > 0
        ) as CategoryWithSubcategories[];
      } catch (error) {
        console.error('Error fetching categories with subcategories:', error);
        return [];
      }
    },
    ['categories-with-subcategories'],
    {
      revalidate: 3600, // 1 hour
      tags: ['categories', 'categories-with-subcategories'],
    }
  )();
}

/**
 * Fetch a single category by slug with its subcategories
 * Used for category detail page
 *
 * Cache TTL: 1 hour
 * Tags: ['categories', `category-${slug}`] for on-demand revalidation
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryWithSubcategories | null> {
  return unstable_cache(
    async () => {
      try {
        const categories = await directus.request(
          readItems('categories', {
            filter: { slug: { _eq: slug } },
            fields: ['id', 'name', 'slug', 'description', 'sort', 'name_th', 'name_en'],
            limit: 1,
          })
        );

        if (!categories || categories.length === 0) {
          return null;
        }

        const category = categories[0] as any;

        // Fetch subcategories for this category
        const subcategories = await directus.request(
          readItems('subcategories', {
            filter: { category_id: { _eq: category.id } },
            fields: [
              'id',
              'name_th',
              'name_en',
              'slug',
              'description_th',
              'description_en',
              'sort',
            ],
            sort: ['sort', 'name_th'],
          })
        );

        // Get prompt counts for each subcategory
        const subcategoriesWithCounts = await Promise.all(
          (subcategories as any[]).map(async (sub) => {
            try {
              const countResult = await directus.request(
                aggregate('prompts', {
                  aggregate: { count: '*' },
                  query: {
                    filter: {
                      subcategory_id: { _eq: sub.id },
                      status: { _eq: 'published' },
                    },
                  },
                })
              );
              const count = Number(countResult[0]?.count) || 0;
              return {
                ...sub,
                prompt_count: count,
              };
            } catch {
              return {
                ...sub,
                prompt_count: 0,
              };
            }
          })
        );

        return {
          ...category,
          subcategories: subcategoriesWithCounts.filter((sub) => sub.prompt_count > 0),
        };
      } catch (error) {
        console.error('Error fetching category by slug:', error);
        return null;
      }
    },
    [`category-${slug}`],
    {
      revalidate: 3600,
      tags: ['categories', `category-${slug}`],
    }
  )();
}

