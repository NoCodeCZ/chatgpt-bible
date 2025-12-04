# TypeScript Types Reference

**Purpose:** Define TypeScript interfaces in `types/` that mirror Directus collections. Keep types in sync with Directus schema for type safety.

## Overall Pattern

```
Directus Collection → TypeScript Interface → Export → Use in Services/Components
```

## Step 1: Create Base Type Definition

```typescript
// types/MyCollection.ts

/**
 * MyCollection TypeScript Definition
 *
 * DIRECTUS SCHEMA VERSION: 1.0
 * LAST VALIDATED: 2025-01-15
 *
 * IMPORTANT: When Directus schema changes:
 * 1. Use MCP to inspect the 'my_collection' collection schema
 * 2. Compare MCP output fields against this interface
 * 3. Update interface to match schema exactly
 * 4. Update version number and last validated date
 */

export type MyCollectionStatus = 'draft' | 'published' | 'archived';

export interface MyCollection {
  id: number; // or string for UUID
  status: MyCollectionStatus;
  title: string;
  description: string | null;
  created_at: string; // ISO date string
  updated_at: string;
  user_created: string | null; // UUID
  user_updated: string | null;
  
  // Relationships (populated via Directus API)
  category_id?: Category | null; // M2O relationship
  categories?: Array<{ categories_id: Category }>; // M2M via junction
}
```

**Rules:** Use PascalCase for interface names, match Directus field names exactly (snake_case), use union types for enums, mark optional fields with `?`, use `| null` for nullable fields, add schema version comments.

## Step 2: Define Relationship Types

```typescript
// types/Prompt.ts
import type { Category } from './Category';
import type { JobRole } from './JobRole';

export interface Prompt {
  id: number;
  title: string;
  
  // M2O relationship - Directus returns object when using deep query
  subcategory_id?: Subcategory | null;
  
  // M2M relationships via junction tables
  categories?: Array<{
    categories_id: Category;
  }>;
  
  job_roles?: Array<{
    job_roles_id: JobRole;
  }>;
}

// Related type for nested objects
export interface Subcategory {
  id: number;
  name_en: string;
  name_th: string;
  slug: string;
}
```

**Rules:** Import related types, handle both object (populated) and ID (not populated) cases, use array with nested object pattern for M2M, create separate interfaces for nested types.

## Step 3: Create Optimized Types for Lists

```typescript
// types/Prompt.ts

// Full type with all fields
export interface Prompt {
  id: number;
  title: string;
  description: string;
  prompt_text: string; // Large field, not needed in lists
  // ... all fields
}

// Optimized type for list views (fewer fields)
export interface PromptCard {
  id: number;
  title: string;
  description: string;
  difficulty_level: DifficultyLevel;
  // Omit prompt_text for performance
  categories?: Array<{
    categories_id: Pick<Category, 'id' | 'name' | 'slug'>;
  }>;
}
```

**Rules:** Create separate types for list vs detail views, use `Pick<>` for partial related types, omit large fields in list types, improve performance with fewer fields.

## Step 4: Define Filter and Result Types

```typescript
// types/Prompt.ts (or in service file)

export interface GetPromptsFilters {
  page?: number;
  limit?: number;
  categories?: string[]; // Array of slugs
  difficulty?: DifficultyLevel;
  search?: string;
}

export interface GetPromptsResult {
  data: PromptCard[];
  total: number;
  totalPages: number;
}
```

**Rules:** Define filter interfaces in service files (not types/), use optional properties with `?`, use arrays for multiple values, include pagination metadata in result types.

## Step 5: Export Types

```typescript
// types/index.ts (optional barrel export)

export type { Prompt, PromptCard, DifficultyLevel } from './Prompt';
export type { Category } from './Category';
export type { JobRole } from './JobRole';
```

**Rules:** Create barrel export for convenience, re-export types from individual files, enable cleaner imports.

## Step 6: Use Types in Code

```typescript
// lib/services/prompts.ts
import type { Prompt, PromptCard, GetPromptsFilters, GetPromptsResult } from '@/types/Prompt';

export async function getPrompts(
  filters: GetPromptsFilters = {}
): Promise<GetPromptsResult> {
  // Implementation
}

// components/PromptCard.tsx
import type { PromptCard as PromptCardType } from '@/types/Prompt';

interface PromptCardProps {
  prompt: PromptCardType;
}
```

**Rules:** Import types from `@/types/`, use in function signatures, use in component props, avoid inline type definitions.

## Quick Checklist

- [ ] Created file in `types/` directory matching collection name
- [ ] Added schema version comment with validation date
- [ ] Defined interface matching Directus field names exactly
- [ ] Used union types for enum fields
- [ ] Marked optional fields with `?`
- [ ] Used `| null` for nullable fields
- [ ] Defined relationship types (M2O, M2M patterns)
- [ ] Created optimized types for list views (if needed)
- [ ] Defined filter/result interfaces (in service files)
- [ ] Exported types (named exports)
- [ ] Imported and used types in services/components
- [ ] Updated schema version when Directus changes
- [ ] Tested type casting in service functions
