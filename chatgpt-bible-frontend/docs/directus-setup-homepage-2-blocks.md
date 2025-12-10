# Directus Collections Setup: Homepage 2 Blocks

This document provides the exact configuration needed to create three new block collections in Directus for the Homepage 2 conversion.

## Collections to Create

1. `block_pain_points` - Pain points section
2. `block_timeline` - Timeline with color-coded items  
3. `block_registration` - Line registration block

## Collection 1: `block_pain_points`

### Collection Settings

- **Collection Name**: `block_pain_points`
- **Primary Key**: `id` (UUID)
- **Display Template**: `{{heading}}`
- **Icon**: `sentiment_dissatisfied`
- **Note**: "Pain points section highlighting user problems"
- **Group**: Blocks
- **Archive Field**: `status`
- **Archive Value**: `archived`
- **Unarchive Value**: `draft`

### Fields

#### 1. id (UUID Primary Key)
- **Type**: `uuid`
- **Interface**: `input` (hidden)
- **Special**: `uuid`
- **Primary Key**: Yes
- **Readonly**: Yes
- **Hidden**: Yes

#### 2. heading
- **Type**: `string`
- **Interface**: `input`
- **Required**: No
- **Width**: Full
- **Note**: "Main heading for the pain points section"
- **Max Length**: 255

#### 3. description
- **Type**: `text`
- **Interface**: `input-multiline`
- **Required**: No
- **Width**: Full
- **Note**: "Supporting text below the heading"

#### 4. pain_points (JSON Array)
- **Type**: `json`
- **Interface**: `list`
- **Required**: Yes
- **Width**: Full
- **Note**: "Array of pain point items"
- **Special**: `cast-json`
- **Options → Fields**:
  - `icon` (string, input, optional) - Iconify icon name
  - `title` (string, input, required) - Pain point title
  - `description` (text, input-multiline, required) - Pain point description

**Example JSON Structure:**
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

#### 5. transition_text
- **Type**: `text`
- **Interface**: `input-multiline`
- **Required**: No
- **Width**: Full
- **Note**: "Text shown in the special transition card (e.g., 'แต่ถ้าบอกว่า...')"

#### 6. theme
- **Type**: `string`
- **Interface**: `select-dropdown`
- **Required**: No
- **Width**: Half
- **Default Value**: `dark`
- **Choices**:
  - `light` - "Light"
  - `dark` - "Dark"

#### 7. status
- **Type**: `string`
- **Interface**: `select-dropdown`
- **Required**: Yes
- **Width**: Half
- **Default Value**: `draft`
- **Display**: `labels`
- **Display Options**:
  - `showAsDot`: true
  - **Choices**:
    - `draft` - "Draft" (foreground: `var(--theme--foreground)`, background: `var(--theme--background-normal)`)
    - `published` - "Published" (foreground: `var(--theme--primary)`, background: `var(--theme--primary-background)`)
    - `archived` - "Archived" (foreground: `var(--theme--warning)`, background: `var(--theme--warning-background)`)

#### 8. System Fields (Auto-created)
- `date_created` (timestamp, special: `date-created`, readonly, hidden)
- `date_updated` (timestamp, special: `date-updated`, readonly, hidden)
- `user_created` (uuid, special: `user-created`, relation to `directus_users`, readonly, hidden)
- `user_updated` (uuid, special: `user-updated`, relation to `directus_users`, readonly, hidden)

### Relations

After creating fields, create relations for:
- `user_created` → `directus_users.id`
- `user_updated` → `directus_users.id`

Both should use `SET NULL` on delete.

---

## Collection 2: `block_timeline`

### Collection Settings

- **Collection Name**: `block_timeline`
- **Primary Key**: `id` (UUID)
- **Display Template**: `{{heading}}`
- **Icon**: `timeline`
- **Note**: "Timeline section with color-coded items and price anchor"
- **Group**: Blocks
- **Archive Field**: `status`
- **Archive Value**: `archived`
- **Unarchive Value**: `draft`

### Fields

#### 1. id (UUID Primary Key)
- Same as `block_pain_points`

#### 2. heading
- Same as `block_pain_points`

#### 3. description
- Same as `block_pain_points`

#### 4. timeline_items (JSON Array)
- **Type**: `json`
- **Interface**: `list`
- **Required**: Yes
- **Width**: Full
- **Note**: "Array of timeline items"
- **Special**: `cast-json`
- **Options → Fields**:
  - `year` (string, input, required) - Year label
  - `title` (string, input, required) - Timeline item title
  - `description` (text, input-multiline, required) - Timeline item description
  - `color` (string, select-dropdown, optional) - Color theme
    - **Choices**: `red`, `amber`, `emerald`

**Example JSON Structure:**
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

#### 5. price_anchor_text
- **Type**: `text`
- **Interface**: `input-multiline`
- **Required**: No
- **Width**: Full
- **Note**: "Text above the price anchor section"

#### 6. price_anchor_time
- **Type**: `string`
- **Interface**: `input`
- **Required**: No
- **Width**: Half
- **Note**: "Time value (e.g., '2 ปี')"
- **Max Length**: 50

#### 7. price_anchor_cost
- **Type**: `string`
- **Interface**: `input`
- **Required**: No
- **Width**: Half
- **Note**: "Cost value (e.g., '500,000 บาท')"
- **Max Length**: 50

#### 8. theme
- Same as `block_pain_points`

#### 9. status
- Same as `block_pain_points`

#### 10. System Fields
- Same as `block_pain_points`

### Relations

- `user_created` → `directus_users.id`
- `user_updated` → `directus_users.id`

---

## Collection 3: `block_registration`

### Collection Settings

- **Collection Name**: `block_registration`
- **Primary Key**: `id` (UUID)
- **Display Template**: `{{heading}}`
- **Icon**: `person_add`
- **Note**: "Line registration block with QR code, steps, and bonuses"
- **Group**: Blocks
- **Archive Field**: `status`
- **Archive Value**: `archived`
- **Unarchive Value**: `draft`

### Fields

#### 1. id (UUID Primary Key)
- Same as `block_pain_points`

#### 2. heading
- Same as `block_pain_points`

#### 3. description
- Same as `block_pain_points`

#### 4. steps (JSON Array)
- **Type**: `json`
- **Interface**: `list`
- **Required**: No
- **Width**: Full
- **Note**: "Registration steps (usually 3 steps)"
- **Special**: `cast-json`
- **Options → Fields**:
  - `number` (integer, input, required) - Step number
  - `title` (string, input, required) - Step title
  - `description` (text, input-multiline, required) - Step description

**Example JSON Structure:**
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

#### 5. line_id
- **Type**: `string`
- **Interface**: `input`
- **Required**: No
- **Width**: Half
- **Note**: "Line ID (without @ symbol, e.g., 'chatgpt-bible')"
- **Max Length**: 50

#### 6. line_qr_code (File)
- **Type**: `uuid`
- **Interface**: `file-image`
- **Required**: No
- **Width**: Half
- **Note**: "QR code image for Line registration"
- **Special**: `file`
- **Relation**: To `directus_files.id`

#### 7. line_url
- **Type**: `string`
- **Interface**: `input`
- **Required**: No
- **Width**: Full
- **Note**: "Line URL for direct link (e.g., 'https://line.me/R/ti/p/@chatgpt-bible')"
- **Max Length**: 255

#### 8. bonuses (JSON Array)
- **Type**: `json`
- **Interface**: `list`
- **Required**: No
- **Width**: Full
- **Note**: "Bonus items shown below registration"
- **Special**: `cast-json`
- **Options → Fields**:
  - `icon` (string, input, optional) - Iconify icon name
  - `title` (string, input, required) - Bonus title
  - `value` (string, input, required) - Bonus value/description

**Example JSON Structure:**
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

#### 9. future_pacing_text
- **Type**: `text`
- **Interface**: `input-multiline`
- **Required**: No
- **Width**: Full
- **Note**: "Future pacing text shown at the bottom"

#### 10. theme
- Same as `block_pain_points`

#### 11. status
- Same as `block_pain_points`

#### 12. System Fields
- Same as `block_pain_points`

### Relations

- `user_created` → `directus_users.id`
- `user_updated` → `directus_users.id`
- `line_qr_code` → `directus_files.id` (on delete: `SET NULL`)

---

## Update `page_blocks` Collection

After creating all three collections, update the `page_blocks` collection's `collection` field to include the new block types.

1. Go to **Settings** → **Data Model** → **page_blocks** collection
2. Edit the `collection` field
3. Add to **Choices**:
   - `block_pain_points` - "Pain Points"
   - `block_timeline` - "Timeline"
   - `block_registration` - "Registration"

---

## Permissions Setup

For each collection, set permissions:

### Public Role (Read Only)
- **Read**: Allow with filter `status: { _eq: "published" }`

### Admin Role (Full Access)
- **Create**: Allow
- **Read**: Allow (no filter)
- **Update**: Allow
- **Delete**: Allow

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

## Next Steps

After collections are created and validated:

1. Create TypeScript types matching the Directus schema
2. Create service functions to fetch blocks
3. Create React components for each block
4. Update BlockRenderer to handle new blocks
5. Test complete data flow: Directus → Service → Component → Render
