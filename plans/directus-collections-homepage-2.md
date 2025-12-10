# Implementation Plan: Directus Collections Setup for Homepage 2 Blocks

## Overview

Create three new Directus collections for the Homepage 2 conversion: `block_pain_points`, `block_timeline`, and `block_registration`. These collections will integrate with the existing page builder system via the `page_blocks` M2A junction.

**Collections to Create:**
1. `block_pain_points` - Pain points section with icons and transition text
2. `block_timeline` - Timeline with color-coded items and price anchor
3. `block_registration` - Line registration block with QR code and bonuses

## Prerequisites

- Directus instance is running and accessible
- Admin permissions available
- `pages` collection exists
- `page_blocks` junction collection exists
- Existing block collections (`block_hero`, `block_faq`, etc.) as reference

## Collection 1: `block_pain_points`

### Collection Meta

```yaml
Collection Name: block_pain_points
Primary Key: id (UUID)
Display Template: "{{heading}}"
Icon: sentiment_dissatisfied
Note: "Pain points section highlighting user problems"
Archive Field: status
Archive Value: archived
Unarchive Value: draft
```

### Fields

#### 1. Primary Key
- **Field**: `id`
- **Type**: `uuid`
- **Meta**:
  - `hidden`: true
  - `readonly`: true
  - `interface`: `input`
  - `special`: `["uuid"]`
- **Schema**:
  - `is_primary_key`: true
  - `length`: 36
  - `has_auto_increment`: false

#### 2. Heading
- **Field**: `heading`
- **Type**: `string`
- **Meta**:
  - `interface`: `input`
  - `required`: false
  - `width`: `full`
  - `note`: "Main heading for the pain points section"
- **Schema**:
  - `max_length`: 255
  - `is_nullable`: true

#### 3. Description
- **Field**: `description`
- **Type**: `text`
- **Meta**:
  - `interface`: `input-multiline`
  - `required`: false
  - `width`: `full`
  - `note`: "Supporting text below the heading"
- **Schema**:
  - `is_nullable`: true

#### 4. Pain Points (JSON Array)
- **Field**: `pain_points`
- **Type**: `json`
- **Meta**:
  - `interface`: `list`
  - `required`: true
  - `width`: `full`
  - `note`: "Array of pain point items"
  - `options`:
    - `fields`:
      - `icon` (string, input, optional) - Iconify icon name
      - `title` (string, input, required) - Pain point title
      - `description` (text, input-multiline, required) - Pain point description
- **Schema**:
  - `is_nullable`: false

**JSON Structure Example:**
```json
[
  {
    "icon": "lucide:clock",
    "title": "เสียเวลานาน",
    "description": "ต้องใช้เวลาหลายชั่วโมงในการสร้างคอนเทนต์"
  },
  {
    "icon": "lucide:dollar-sign",
    "title": "ต้นทุนสูง",
    "description": "ต้องจ้างทีมงานหลายคนเพื่อสร้างคอนเทนต์"
  }
]
```

#### 5. Transition Text
- **Field**: `transition_text`
- **Type**: `text`
- **Meta**:
  - `interface`: `input-multiline`
  - `required`: false
  - `width`: `full`
  - `note`: "Text shown in the special transition card (e.g., 'แต่ถ้าบอกว่า...')"
- **Schema**:
  - `is_nullable`: true

#### 6. Theme
- **Field**: `theme`
- **Type**: `string`
- **Meta**:
  - `interface`: `select-dropdown`
  - `required`: false
  - `width`: `half`
  - `default_value`: `dark`
  - `options`:
    - `choices`:
      - `text`: "Light"
        `value`: `light`
      - `text`: "Dark"
        `value`: `dark`
- **Schema**:
  - `default_value`: `dark`
  - `is_nullable`: true

#### 7. Status
- **Field**: `status`
- **Type**: `string`
- **Meta**:
  - `interface`: `select-dropdown`
  - `required`: true
  - `width`: `half`
  - `default_value`: `draft`
  - `display`: `labels`
  - `display_options`:
    - `showAsDot`: true
    - `choices`:
      - `text`: "Draft"
        `value`: `draft`
        `foreground`: `var(--theme--foreground)`
        `background`: `var(--theme--background-normal)`
      - `text`: "Published"
        `value`: `published`
        `foreground`: `var(--theme--primary)`
        `background`: `var(--theme--primary-background)`
      - `text`: "Archived"
        `value`: `archived`
        `foreground`: `var(--theme--warning)`
        `background`: `var(--theme--warning-background)`
- **Schema**:
  - `default_value`: `draft`
  - `is_nullable`: false

#### 8. System Fields (Auto)
- `date_created` (timestamp, special: `date-created`)
- `date_updated` (timestamp, special: `date-updated`)
- `user_created` (uuid, special: `user-created`, relation to `directus_users`)
- `user_updated` (uuid, special: `user-updated`, relation to `directus_users`)

### Permissions

- **Public Role**: Read only (filter: `status: { _eq: 'published' }`)
- **Admin Role**: Full access

### M2A Integration

Add to `page_blocks.collection` dropdown choices:
- `text`: "Pain Points"
  `value`: `block_pain_points`

---

## Collection 2: `block_timeline`

### Collection Meta

```yaml
Collection Name: block_timeline
Primary Key: id (UUID)
Display Template: "{{heading}}"
Icon: timeline
Note: "Timeline section with color-coded items and price anchor"
Archive Field: status
Archive Value: archived
Unarchive Value: draft
```

### Fields

#### 1. Primary Key
- **Field**: `id`
- **Type**: `uuid`
- **Meta**: Same as `block_pain_points`

#### 2. Heading
- **Field**: `heading`
- **Type**: `string`
- **Meta**: Same as `block_pain_points`

#### 3. Description
- **Field**: `description`
- **Type**: `text`
- **Meta**: Same as `block_pain_points`

#### 4. Timeline Items (JSON Array)
- **Field**: `timeline_items`
- **Type**: `json`
- **Meta**:
  - `interface`: `list`
  - `required`: true
  - `width`: `full`
  - `note`: "Array of timeline items"
  - `options`:
    - `fields`:
      - `year` (string, input, required) - Year label
      - `title` (string, input, required) - Timeline item title
      - `description` (text, input-multiline, required) - Timeline item description
      - `color` (string, select-dropdown, optional) - Color theme
        - `choices`: `red`, `amber`, `emerald`
- **Schema**:
  - `is_nullable`: false

**JSON Structure Example:**
```json
[
  {
    "year": "2020",
    "title": "เริ่มต้นธุรกิจ",
    "description": "เริ่มต้นธุรกิจด้วยเงินทุนจำกัด",
    "color": "red"
  },
  {
    "year": "2022",
    "title": "ขยายธุรกิจ",
    "description": "ขยายธุรกิจและเพิ่มทีมงาน",
    "color": "amber"
  }
]
```

#### 5. Price Anchor Text
- **Field**: `price_anchor_text`
- **Type**: `text`
- **Meta**:
  - `interface`: `input-multiline`
  - `required`: false
  - `width`: `full`
  - `note`: "Text above the price anchor section"
- **Schema**:
  - `is_nullable`: true

#### 6. Price Anchor Time
- **Field**: `price_anchor_time`
- **Type**: `string`
- **Meta**:
  - `interface`: `input`
  - `required`: false
  - `width`: `half`
  - `note`: "Time value (e.g., '2 ปี')"
- **Schema**:
  - `max_length`: 50
  - `is_nullable`: true

#### 7. Price Anchor Cost
- **Field**: `price_anchor_cost`
- **Type**: `string`
- **Meta**:
  - `interface`: `input`
  - `required`: false
  - `width`: `half`
  - `note`: "Cost value (e.g., '500,000 บาท')"
- **Schema**:
  - `max_length`: 50
  - `is_nullable`: true

#### 8. Theme
- **Field**: `theme`
- **Type**: `string`
- **Meta**: Same as `block_pain_points`

#### 9. Status
- **Field**: `status`
- **Type**: `string`
- **Meta**: Same as `block_pain_points`

#### 10. System Fields (Auto)
- Same as `block_pain_points`

### Permissions

- **Public Role**: Read only (filter: `status: { _eq: 'published' }`)
- **Admin Role**: Full access

### M2A Integration

Add to `page_blocks.collection` dropdown choices:
- `text`: "Timeline"
  `value`: `block_timeline`

---

## Collection 3: `block_registration`

### Collection Meta

```yaml
Collection Name: block_registration
Primary Key: id (UUID)
Display Template: "{{heading}}"
Icon: person_add
Note: "Line registration block with QR code, steps, and bonuses"
Archive Field: status
Archive Value: archived
Unarchive Value: draft
```

### Fields

#### 1. Primary Key
- **Field**: `id`
- **Type**: `uuid`
- **Meta**: Same as `block_pain_points`

#### 2. Heading
- **Field**: `heading`
- **Type**: `string`
- **Meta**: Same as `block_pain_points`

#### 3. Description
- **Field**: `description`
- **Type**: `text`
- **Meta**: Same as `block_pain_points`

#### 4. Steps (JSON Array)
- **Field**: `steps`
- **Type**: `json`
- **Meta**:
  - `interface`: `list`
  - `required`: false
  - `width`: `full`
  - `note`: "Registration steps (usually 3 steps)"
  - `options`:
    - `fields`:
      - `number` (integer, input, required) - Step number
      - `title` (string, input, required) - Step title
      - `description` (text, input-multiline, required) - Step description
- **Schema**:
  - `is_nullable`: true

**JSON Structure Example:**
```json
[
  {
    "number": 1,
    "title": "แอดไลน์",
    "description": "สแกน QR Code หรือแอด @line_id"
  },
  {
    "number": 2,
    "title": "กรอกข้อมูล",
    "description": "กรอกข้อมูลตามที่ระบบขอ"
  },
  {
    "number": 3,
    "title": "เริ่มใช้งาน",
    "description": "รับข้อมูลการเข้าถึงและเริ่มใช้งาน"
  }
]
```

#### 5. Line ID
- **Field**: `line_id`
- **Type**: `string`
- **Meta**:
  - `interface`: `input`
  - `required`: false
  - `width`: `half`
  - `note`: "Line ID (without @ symbol, e.g., 'chatgpt-bible')"
- **Schema**:
  - `max_length`: 50
  - `is_nullable`: true

#### 6. Line QR Code
- **Field**: `line_qr_code`
- **Type**: `uuid`
- **Meta**:
  - `interface`: `file-image`
  - `required`: false
  - `width`: `half`
  - `note`: "QR code image for Line registration"
  - `special`: `["file"]`
- **Schema**:
  - `is_nullable`: true
  - `foreign_key_table`: `directus_files`
  - `foreign_key_column`: `id`

#### 7. Line URL
- **Field**: `line_url`
- **Type**: `string`
- **Meta**:
  - `interface`: `input`
  - `required`: false
  - `width`: `full`
  - `note`: "Line URL for direct link (e.g., 'https://line.me/R/ti/p/@chatgpt-bible')"
- **Schema**:
  - `max_length`: 255
  - `is_nullable`: true

#### 8. Bonuses (JSON Array)
- **Field**: `bonuses`
- **Type**: `json`
- **Meta**:
  - `interface`: `list`
  - `required`: false
  - `width`: `full`
  - `note`: "Bonus items shown below registration"
  - `options`:
    - `fields`:
      - `icon` (string, input, optional) - Iconify icon name
      - `title` (string, input, required) - Bonus title
      - `value` (string, input, required) - Bonus value/description
- **Schema**:
  - `is_nullable`: true

**JSON Structure Example:**
```json
[
  {
    "icon": "lucide:gift",
    "title": "คู่มือการใช้งาน",
    "value": "ฟรี 100%"
  },
  {
    "icon": "lucide:zap",
    "title": "อัปเดตตลอดชีพ",
    "value": "ไม่มีค่าใช้จ่ายเพิ่ม"
  }
]
```

#### 9. Future Pacing Text
- **Field**: `future_pacing_text`
- **Type**: `text`
- **Meta**:
  - `interface`: `input-multiline`
  - `required`: false
  - `width`: `full`
  - `note`: "Future pacing text shown at the bottom"
- **Schema**:
  - `is_nullable`: true

#### 10. Theme
- **Field**: `theme`
- **Type**: `string`
- **Meta**: Same as `block_pain_points`

#### 11. Status
- **Field**: `status`
- **Type**: `string`
- **Meta**: Same as `block_pain_points`

#### 12. System Fields (Auto)
- Same as `block_pain_points`

### Relations

#### Line QR Code Relation
- **Collection**: `block_registration`
- **Field**: `line_qr_code`
- **Related Collection**: `directus_files`
- **Schema**:
  - `on_delete`: `SET NULL`

### Permissions

- **Public Role**: Read only (filter: `status: { _eq: 'published' }`)
- **Admin Role**: Full access

### M2A Integration

Add to `page_blocks.collection` dropdown choices:
- `text`: "Registration"
  `value`: `block_registration`

---

## Implementation Steps

### Step 1: Create `block_pain_points` Collection

1. Use MCP Directus `collections` tool to create collection
2. Add all fields using `fields` tool
3. Create relations for `user_created` and `user_updated` to `directus_users`
4. Set permissions (Public: read, Admin: full)
5. Update `page_blocks.collection` field to include new choice

### Step 2: Create `block_timeline` Collection

1. Use MCP Directus `collections` tool to create collection
2. Add all fields using `fields` tool
3. Create relations for `user_created` and `user_updated` to `directus_users`
4. Set permissions (Public: read, Admin: full)
5. Update `page_blocks.collection` field to include new choice

### Step 3: Create `block_registration` Collection

1. Use MCP Directus `collections` tool to create collection
2. Add all fields using `fields` tool
3. Create relations:
   - `user_created` and `user_updated` to `directus_users`
   - `line_qr_code` to `directus_files`
4. Set permissions (Public: read, Admin: full)
5. Update `page_blocks.collection` field to include new choice

### Step 4: Update `page_blocks` Collection

1. Read current `page_blocks` collection field definition
2. Update `collection` field choices to include:
   - `block_pain_points`
   - `block_timeline`
   - `block_registration`
3. Verify M2A relationship still works correctly

### Step 5: Test Collections

1. Create test items in each collection
2. Verify JSON fields accept correct structure
3. Test file upload for `line_qr_code`
4. Verify permissions (Public can read published, Admin can create/update)
5. Test adding blocks to a page via `page_blocks` junction

---

## Validation Checklist

- [ ] All three collections created with UUID primary keys
- [ ] All fields added with correct types and interfaces
- [ ] JSON fields configured with proper list structure
- [ ] File field (`line_qr_code`) has relation to `directus_files`
- [ ] User tracking fields have relations to `directus_users`
- [ ] Status field has correct choices and default value
- [ ] Theme field has correct choices and default value
- [ ] Permissions set correctly (Public: read published, Admin: full)
- [ ] `page_blocks.collection` field updated with new choices
- [ ] Test items can be created in each collection
- [ ] Test items can be added to pages via `page_blocks`
- [ ] JSON validation works for array fields
- [ ] File upload works for QR code image

---

## Notes

- **JSON Fields**: Use Directus `list` interface for JSON arrays. The structure is validated by the field options.
- **File Relations**: `line_qr_code` uses `file-image` interface which automatically creates M2O relation to `directus_files`.
- **M2A Integration**: The `page_blocks` collection uses Many-to-Any (M2A) relationship. New block types are added by updating the `collection` field's dropdown choices.
- **Naming Convention**: All field names use `snake_case` to match TypeScript interfaces exactly.
- **Status Workflow**: All blocks use `draft` → `published` → `archived` workflow with visual indicators.
- **Theme Support**: All blocks support `light` and `dark` themes for flexible styling.

---

## Next Steps

After collections are created:
1. Verify TypeScript types match Directus schema exactly
2. Test service functions can fetch blocks correctly
3. Verify BlockRenderer can render new blocks
4. Create test page with all three new blocks
5. Validate data flow: Directus → Service → Component → Render
