/**
 * Navigation item type for the main navbar
 * Mirrors the Directus 'navigation' collection schema
 */
export interface NavigationItem {
  id: string;
  status: 'published' | 'draft' | 'archived';
  sort: number | null;
  label: string;
  url: string;
  is_external: boolean;
  target: '_self' | '_blank' | null;
  icon: string | null;
  date_created: string | null;
  date_updated: string | null;
  user_created: string | null;
  user_updated: string | null;
}

/**
 * Type for navigation items used in the UI
 * (simplified version without metadata)
 */
export interface NavItem {
  id: string;
  label: string;
  url: string;
  isExternal: boolean;
  target: '_self' | '_blank';
  icon?: string;
}
