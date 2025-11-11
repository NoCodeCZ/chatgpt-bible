# Fix Page Blocks Schema Issue

## Problem
The `page_blocks` junction table has a type mismatch:
- `pages.id` is type **integer** (auto-increment primary key)
- `page_blocks.pages_id` is type **uuid** (incorrect)

This prevents linking blocks to pages.

## Solution Options

### Option 1: Fix via Directus Admin UI (Recommended)

**Steps:**

1. **Login to Directus Admin**
   - Go to: https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io/admin

2. **Navigate to Data Model**
   - Click Settings (gear icon) in sidebar
   - Click "Data Model"
   - Find and click on `page_blocks` collection

3. **Delete the pages_id field**
   - Find the `pages_id` field in the field list
   - Click the three dots menu → Delete
   - Confirm deletion

4. **Recreate pages_id field with correct type**
   - Click "Create Field" button
   - Select "Many to One" relationship
   - Choose **Related Collection**: `pages`
   - Field Name: `pages_id`
   - Field Key: `pages_id`
   - Required: Yes (check the box)
   - Click "Save"

5. **Verify the fix**
   - Go to Content → `page_blocks`
   - Try creating a new page block
   - The `pages_id` dropdown should now show pages by ID

### Option 2: Fix via SQL (Direct Database Access)

If you have direct database access:

```sql
-- 1. Drop the existing column
ALTER TABLE page_blocks DROP COLUMN pages_id;

-- 2. Add it back with correct type
ALTER TABLE page_blocks ADD COLUMN pages_id INTEGER NOT NULL;

-- 3. Create foreign key constraint
ALTER TABLE page_blocks
ADD CONSTRAINT page_blocks_pages_id_foreign
FOREIGN KEY (pages_id)
REFERENCES pages(id)
ON DELETE CASCADE;

-- 4. Create index for performance
CREATE INDEX idx_page_blocks_pages_id ON page_blocks(pages_id);
```

### Option 3: Fix via Directus REST API

Required: Admin token with full permissions

```bash
# Set your admin token
export DIRECTUS_TOKEN="your_admin_token_here"
export DIRECTUS_URL="https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io"

# 1. Delete the existing field
curl -X DELETE "$DIRECTUS_URL/fields/page_blocks/pages_id" \
  -H "Authorization: Bearer $DIRECTUS_TOKEN"

# 2. Recreate with correct type
curl -X POST "$DIRECTUS_URL/fields/page_blocks" \
  -H "Authorization: Bearer $DIRECTUS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "pages_id",
    "type": "integer",
    "meta": {
      "interface": "select-dropdown-m2o",
      "required": true,
      "special": ["m2o"],
      "options": {
        "template": "{{id}} - {{title}}"
      }
    },
    "schema": {
      "is_nullable": false,
      "foreign_key_table": "pages",
      "foreign_key_column": "id"
    }
  }'
```

## After Fixing

Once the schema is fixed, you can link blocks to pages:

```javascript
// Example: Create a page block linking hero to homepage
{
  "pages_id": 1,  // Now accepts integer!
  "collection": "block_hero",
  "item": "803b6698-52c1-4ec3-a3ed-2ae9d197f1a0",
  "sort": 1,
  "hide_block": false
}
```

## Testing the Fix

1. Go to Directus Admin → Content → `page_blocks`
2. Click "Create Item"
3. Select a page from `pages_id` dropdown (should show: "1 - Home - ChatGPT Bible")
4. Select block collection type
5. Select the specific block item
6. Save

## Other Schema Issues Found

While investigating, I also noticed:
- `pages.blocks` field is marked as type "alias" (M2M relationship)
- This should automatically work once the junction table is fixed
- No action needed - Directus will handle the relationship

## Sample Blocks Ready to Use

These blocks were created and are ready to link:

**Hero Block:**
- ID: `803b6698-52c1-4ec3-a3ed-2ae9d197f1a0`
- "Transform Your Workflow with ChatGPT Bible"

**Features Block:**
- ID: `c1c3d0fa-2cd7-4f91-811f-2e79e3796400`
- "Why Choose ChatGPT Bible?" with 4 features

**CTA Block:**
- ID: `54f4dbbf-670b-440f-bfbc-6a942ea5a6ac`
- "Ready to Level Up Your ChatGPT Game?"

**Rich Text Block:**
- ID: `0e463d8c-3382-4e7e-914b-e83edf38854c`
- About page content

**Pages Available:**
- ID: 1 - "Home - ChatGPT Bible" (/)
- ID: 3 - "About Us - ChatGPT Bible" (/about)
