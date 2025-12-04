import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import type { NavigationItem, NavItem } from '@/types/Navigation';

/**
 * Fetch navigation items from Directus
 *
 * @returns Array of published navigation items, sorted by sort field
 *
 * Query Structure:
 * - Filters for published items only
 * - Sorts by 'sort' field (ascending) for manual ordering
 * - Returns essential fields for rendering navigation
 */
export async function getNavigationItems(): Promise<NavItem[]> {
  try {
    const items = await directus.request(
      readItems('navigation', {
        filter: { status: { _eq: 'published' } },
        sort: ['sort', 'label'], // Sort by sort field, then alphabetically
        fields: ['id', 'label', 'url', 'is_external', 'target', 'icon'],
      })
    );

    // Transform Directus items to UI-friendly format
    return (items as unknown as NavigationItem[]).map((item) => ({
      id: item.id,
      label: item.label,
      url: item.url,
      isExternal: item.is_external,
      target: item.target || '_self',
      icon: item.icon || undefined,
    }));
  } catch (error: any) {
    // Silently handle navigation collection errors (collection may not exist yet)
    // This prevents build failures and allows the site to work without navigation
    if (error?.response?.status === 403 || error?.response?.status === 404) {
      // Collection doesn't exist or no permission - return empty array
      return [];
    }
    // Log other errors but still return empty array to prevent site breakage
    if (process.env.NODE_ENV === 'development') {
      console.warn('Navigation collection not available:', error?.message || 'Unknown error');
    }
    return [];
  }
}
