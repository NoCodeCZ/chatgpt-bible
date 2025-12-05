/**
 * Category TypeScript Definitions
 *
 * DIRECTUS SCHEMA VERSION: 1.0 (Story 1.2)
 * LAST VALIDATED: 2025-11-09
 * VALIDATION METHOD: MCP schema inspection
 *
 * See README.md "Type Synchronization Process" for update instructions.
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort: number | null;
  name_th: string | null;
  name_en: string | null;
  description_th: string | null;
  description_en: string | null;
}
