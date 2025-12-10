/**
 * Directus Page Builder Utilities
 * Functions to fetch pages and blocks from Directus
 */

import { directus } from './directus';
import { readItems, readItem } from '@directus/sdk';
import type { Page, PageBlock, PageBlockWithData, PageWithBlocks } from '@/types/blocks';

/**
 * Fetch a page by permalink
 */
export async function getPageByPermalink(permalink: string): Promise<Page | null> {
  try {
    const pages = await directus.request(
      readItems('pages', {
        filter: {
          permalink: { _eq: permalink },
          status: { _eq: 'published' },
        },
        fields: [
          'id',
          'title',
          'permalink',
          'seo_title',
          'seo_description',
          'seo_image',
          'page_type',
          'priority',
          'tags',
          'published_date',
          'status',
        ],
        limit: 1,
      })
    );

    if (!pages || pages.length === 0) {
      return null;
    }

    return pages[0] as unknown as Page;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

/**
 * Fetch page blocks for a specific page
 */
export async function getPageBlocks(pageId: number): Promise<PageBlock[]> {
  try {
    const blocks = await directus.request(
      readItems('page_blocks', {
        filter: {
          pages_id: { _eq: pageId },
          hide_block: { _eq: false },
        },
        sort: ['sort'],
        fields: ['id', 'pages_id', 'collection', 'item', 'sort', 'hide_block'],
        limit: -1, // Get all blocks
      })
    );

    return (blocks || []) as unknown as PageBlock[];
  } catch (error) {
    console.error('Error fetching page blocks:', error);
    return [];
  }
}

/**
 * Fetch block data for a specific block
 * For collections with status field, only returns items with status: 'published'
 */
export async function getBlockData(collection: string, itemId: string): Promise<any> {
  try {
    // Collections with status field - need to check status after fetching
    const collectionsWithStatus = [
      'block_pain_points',
      'block_timeline',
      'block_registration',
    ];

    const item = await directus.request(
      readItem(collection, itemId, {
        fields: ['*'],
      })
    );

    // Filter by status for collections that have it
    if (collectionsWithStatus.includes(collection)) {
      if (!item.status || item.status !== 'published') {
        console.warn(`Block ${itemId} from ${collection} is not published (status: ${item.status || 'undefined'})`);
        return null;
      }
    }

    return item;
  } catch (error) {
    console.error(`Error fetching block data from ${collection}:`, error);
    return null;
  }
}

/**
 * Fetch a page with all its blocks (complete page data)
 */
export async function getPageWithBlocks(permalink: string): Promise<PageWithBlocks | null> {
  try {
    // Fetch the page
    const page = await getPageByPermalink(permalink);
    if (!page) {
      return null;
    }

    // Fetch all page blocks
    const pageBlocks = await getPageBlocks(page.id);

    // Fetch data for each block
    const blocksWithData: PageBlockWithData[] = await Promise.all(
      pageBlocks.map(async (block) => {
        const blockData = await getBlockData(block.collection, block.item);
        return {
          ...block,
          data: blockData,
        };
      })
    );

    // Filter out any blocks that failed to load
    const validBlocks = blocksWithData.filter((block) => block.data !== null);

    return {
      ...page,
      blocks: validBlocks,
    };
  } catch (error) {
    console.error('Error fetching page with blocks:', error);
    return null;
  }
}

/**
 * Get all published pages (for sitemap generation, etc.)
 */
export async function getAllPages(): Promise<Page[]> {
  try {
    const pages = await directus.request(
      readItems('pages', {
        filter: {
          status: { _eq: 'published' },
        },
        fields: ['id', 'title', 'permalink', 'page_type', 'published_date'],
        sort: ['sort', 'published_date'],
        limit: -1,
      })
    );

    return (pages || []) as unknown as Page[];
  } catch (error) {
    console.error('Error fetching all pages:', error);
    return [];
  }
}

/**
 * Get all page permalinks (for static generation)
 */
export async function getAllPagePermalinks(): Promise<string[]> {
  const pages = await getAllPages();
  return pages.map((page) => page.permalink);
}
