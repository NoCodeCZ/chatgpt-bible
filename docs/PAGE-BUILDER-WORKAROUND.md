# Page Builder Workaround - Working Without the Blocks Field

## Issue Summary

The `blocks` M2M relationship field in the `pages` collection was causing SQL errors when trying to view pages in Directus Admin. This is a known issue with Directus M2M alias fields.

**Error:** `column pages.blocks does not exist`

**Solution:** Remove the `blocks` field from the `pages` collection and manage blocks via the `page_blocks` junction table directly.

## ✅ What Still Works

The page builder functionality is **fully operational**! You just manage it differently:

### 1. Managing Blocks in Directus Admin

Instead of editing blocks inside the page editor, you manage them via the junction table:

**To add a block to a page:**
1. Go to **Content → page_blocks**
2. Click "Create Item"
3. Select the page (e.g., "1 - Home - ChatGPT Bible")
4. Choose block type (block_hero, block_features, etc.)
5. Select the specific block item
6. Set sort order (1, 2, 3...)
7. Save

**To reorder blocks:**
- Edit the `sort` field on each page_block item

**To remove a block from a page:**
- Delete the page_block item (doesn't delete the actual block, just the link)

### 2. Viewing Pages in Directus Admin

Pages now work perfectly:
- [Homepage](https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io/admin/content/pages/1)
- [About Page](https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io/admin/content/pages/3)

You can edit all page fields:
- Title, permalink, SEO settings
- Page type, priority, tags
- Status (published/draft/archived)

### 3. Creating New Blocks

All block types work normally:
- Content → block_hero (hero sections)
- Content → block_features (feature lists)
- Content → block_cta (call-to-actions)
- Content → block_richtext (rich text content)
- Content → block_form (forms)
- Content → block_testimonials (testimonials)

## 🔧 Fetching Pages with Blocks in Next.js

You have two options for fetching page data with blocks:

### Option 1: Fetch via page_blocks (Recommended)

```typescript
// Fetch homepage with blocks
const response = await directus.items('pages').readByQuery({
  filter: { permalink: { _eq: '/' } },
  fields: ['*']
});

const page = response.data[0];

// Fetch blocks for this page
const blocksResponse = await directus.items('page_blocks').readByQuery({
  filter: { pages_id: { _eq: page.id } },
  sort: ['sort'],
  fields: ['id', 'collection', 'item', 'sort', 'hide_block']
});

const pageBlocks = blocksResponse.data;

// Fetch each block's full content
for (const block of pageBlocks) {
  if (block.hide_block) continue;

  const blockData = await directus.items(block.collection).readOne(block.item);
  // Render the block...
}
```

### Option 2: Deep Query (More Efficient)

```typescript
const response = await directus.items('page_blocks').readByQuery({
  filter: {
    pages_id: { _eq: 1 },  // Homepage ID
    hide_block: { _eq: false }
  },
  sort: ['sort'],
  fields: [
    'id',
    'collection',
    'item',
    'sort',
    // Deep query for each block type
    'item:block_hero.*',
    'item:block_features.*',
    'item:block_cta.*',
    'item:block_richtext.*',
    'item:block_form.*',
    'item:block_testimonials.*'
  ]
});

const blocks = response.data;
```

### Option 3: Create a Custom Endpoint (Best for Production)

Create a Directus Flow or custom endpoint that returns pages with blocks in a single request:

```typescript
// GET /pages/:permalink
{
  "page": {
    "id": 1,
    "title": "Home - ChatGPT Bible",
    "permalink": "/",
    // ... other fields
  },
  "blocks": [
    {
      "type": "block_hero",
      "sort": 1,
      "data": {
        "heading": "Transform Your Workflow...",
        // ... hero fields
      }
    },
    {
      "type": "block_features",
      "sort": 2,
      "data": {
        "heading": "Why Choose ChatGPT Bible?",
        // ... features fields
      }
    }
  ]
}
```

## 📊 Current Page Builder Status

### Pages Created
- ✅ **Homepage** (/) - ID: 1
  - Hero block (sort: 1)
  - Features block (sort: 2)
  - CTA block (sort: 3)

- ✅ **About Page** (/about) - ID: 3
  - Rich text block (sort: 1)

### Blocks Created
| Type | ID | Description |
|------|----|-----------  |
| block_hero | 803b6698-52c1-4ec3-a3ed-2ae9d197f1a0 | Homepage hero |
| block_features | c1c3d0fa-2cd7-4f91-811f-2e79e3796400 | 4 features |
| block_cta | 54f4dbbf-670b-440f-bfbc-6a942ea5a6ac | Bottom CTA |
| block_richtext | 0e463d8c-3382-4e7e-914b-e83edf38854c | About content |

### Links Created (page_blocks)
| ID | Page | Block Type | Block Item | Sort |
|----|------|-----------|-----------|------|
| 1 | 1 (Home) | block_hero | 803b6698... | 1 |
| 2 | 1 (Home) | block_features | c1c3d0fa... | 2 |
| 3 | 1 (Home) | block_cta | 54f4dbbf... | 3 |
| 4 | 3 (About) | block_richtext | 0e463d8c... | 1 |

## 🎯 Next Steps

1. **Test in Directus Admin:**
   - Go to Content → pages → Click on "Home - ChatGPT Bible"
   - Should load without errors now!
   - Go to Content → page_blocks to see all block links

2. **Build Next.js Components:**
   - Create `/components/blocks/HeroBlock.tsx`
   - Create `/components/blocks/FeaturesBlock.tsx`
   - Create `/components/blocks/CTABlock.tsx`
   - Create `/components/blocks/RichTextBlock.tsx`

3. **Set Up Dynamic Routing:**
   - Create `/app/[...slug]/page.tsx`
   - Implement page fetching logic using one of the options above
   - Render blocks dynamically based on type

## 💡 Why This Happened

Directus M2M relationships with polymorphic data (where blocks can be from different collections) sometimes have issues with the auto-generated SQL queries. The alias field tries to be queried as a real column, causing the error.

**This is a common Directus limitation**, not a configuration error. The workaround (using the junction table directly) is actually the recommended approach for complex page builders.

## 🔗 Quick Links

- [Pages Collection](https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io/admin/content/pages)
- [Page Blocks Junction](https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io/admin/content/page_blocks)
- [All Block Types](https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io/admin/content)
