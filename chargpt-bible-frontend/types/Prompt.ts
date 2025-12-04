/**
 * Prompt TypeScript Definitions
 *
 * DIRECTUS SCHEMA VERSION: 1.0 (Story 1.2)
 * LAST VALIDATED: 2025-11-09
 * VALIDATION METHOD: MCP schema inspection
 *
 * IMPORTANT: When Directus schema changes:
 * 1. Use MCP to inspect the 'prompts' collection schema
 * 2. Compare MCP output fields against this interface
 * 3. Update interface to match schema exactly
 * 4. Update version number and last validated date
 * 5. Test with app/test-directus page
 *
 * See README.md "Type Synchronization Process" for detailed steps.
 */

import type { Category } from './Category';
import type { JobRole } from './JobRole';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type PromptStatus = 'draft' | 'published' | 'archived';

export interface Prompt {
  id: number;
  status: PromptStatus;
  title: string | null; // Deprecated, use title_th and title_en
  title_th: string;
  title_en: string;
  description: string;
  prompt_text: string;
  difficulty_level: DifficultyLevel;
  sort: number | null;
  prompt_type_id: string | null;
  subcategory_id: number | null;

  // Relationships (populated via Directus API deep queries)
  categories?: Array<{
    categories_id: Category;
  }>;
  job_roles?: Array<{
    job_roles_id: JobRole;
  }>;
}

// Category type for subcategory relationship
export interface SubcategoryCategory {
  id: string;
  name: string;
  name_th?: string;
  name_en?: string;
  slug: string;
}

// Subcategory type for prompt cards
export interface Subcategory {
  id: number;
  name_th: string;
  name_en: string;
  slug: string;
  description_th?: string;
  description_en?: string;
  category_id?: string | SubcategoryCategory; // Parent category (can be ID or full object)
}

// Optimized type for list views (fewer fields, better performance)
export interface PromptCard {
  id: number;
  title_th: string;
  title_en: string;
  description: string;
  difficulty_level: DifficultyLevel;
  // Used for grouping in UI (e.g. related prompts within a subcategory)
  prompt_type_id?: string | null;
  prompt_type_name?: string | null;
  subcategory_id?: Subcategory | null; // M2O relationship - Directus returns the related object
  categories?: Array<{
    categories_id: Pick<Category, 'id' | 'name' | 'slug'>;
  }>;
  job_roles?: Array<{
    job_roles_id: Pick<JobRole, 'id' | 'name' | 'slug'>;
  }>;
}
