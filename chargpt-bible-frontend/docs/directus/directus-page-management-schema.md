# Directus Page Management Schema

## Overview

This document describes the complete schema for implementing Agency OS-style page management in your ChatGPT Bible project. This allows you to create and manage website pages dynamically from Directus.

## Schema Summary

**What's Already Done:**
- ✅ `directus_users` extended with subscription fields
- ✅ `prompts` collection enhanced with SEO fields
- ✅ Existing taxonomy collections (categories, job_roles, subcategories, prompt_types)

**What Needs to be Created:**
- ⏳ `pages` - Main page collection
- ⏳ `page_blocks` - Junction table (polymorphic M2M)
- ⏳ `block_hero` - Hero/banner blocks
- ⏳ `block_cta` - Call-to-action blocks
- ⏳ `block_features` - Feature list blocks
- ⏳ `block_richtext` - Rich text content blocks
- ⏳ `block_form` - Contact/subscription forms
- ⏳ `block_testimonials` - Customer testimonials

---

## Collection Definitions

### 1. `pages` Collection

**Purpose:** Main collection for website pages (landing, about, pricing, etc.)

**Fields:**

| Field | Type | Interface | Required | Note |
|-------|------|-----------|----------|------|
| `id` | uuid | input-hash | Yes | Primary key |
| `status` | string | select-dropdown | Yes | draft/published/archived |
| `title` | string | input | Yes | Page title (internal) |
| `permalink` | string | input | Yes | URL path (unique, e.g., "about-us") |
| `seo_title` | string | input | No | SEO title override (60 chars) |
| `seo_description` | text | textarea | No | Meta description (160 chars) |
| `seo_image` | uuid | file-image | No | Social sharing image (M2O to directus_files) |
| `seo_canonical_url` | string | input | No | Canonical URL for SEO |
| `blocks` | alias | list-m2m | No | Related blocks (M2M via page_blocks) |
| `sort` | integer | input | No | Manual ordering |
| `date_created` | timestamp | datetime | Auto | Creation timestamp |
| `date_updated` | timestamp | datetime | Auto | Last update timestamp |
| `user_created` | uuid | select-dropdown-m2o | Auto | Creator user |
| `user_updated` | uuid | select-dropdown-m2o | Auto | Last editor |

**Collection Meta:**
```yaml
icon: article
display_template: "{{title}}"
archive_field: status
archive_value: archived
unarchive_value: draft
sort_field: sort
```

---

### 2. `page_blocks` Junction Collection

**Purpose:** Many-to-Any relationship between pages and various block types

**Fields:**

| Field | Type | Interface | Required | Note |
|-------|------|-----------|----------|------|
| `id` | integer | input | Yes | Auto-increment primary key |
| `pages_id` | uuid | select-dropdown-m2o | Yes | Foreign key to pages.id |
| `collection` | string | select-dropdown | Yes | Block type (e.g., "block_hero") |
| `item` | string | input | Yes | Block item ID (polymorphic) |
| `sort` | integer | input | No | Display order on page |
| `hide_block` | boolean | boolean | No | Visibility toggle (default: false) |

**Collection Meta:**
```yaml
icon: view_module
hidden: true  # Hide from main navigation
```

**Special Configuration:**
- This is a **Many-to-Any (M2A)** relationship
- The `collection` + `item` fields create the polymorphic reference
- In Directus, configure as M2A field on `pages` collection

---

### 3. Block Collections

#### `block_hero`

**Purpose:** Hero/banner sections with headline, subtext, and CTA

| Field | Type | Interface | Required | Note |
|-------|------|-----------|----------|------|
| `id` | uuid | input-hash | Yes | Primary key |
| `heading` | string | input | Yes | Main headline |
| `subheading` | text | textarea | No | Supporting text |
| `cta_text` | string | input | No | Button text |
| `cta_link` | string | input | No | Button URL (internal or external) |
| `background_image` | uuid | file-image | No | Background image (M2O to directus_files) |
| `text_align` | string | select-dropdown | No | left/center/right (default: center) |
| `theme` | string | select-dropdown | No | light/dark (default: light) |

#### `block_cta`

**Purpose:** Call-to-action sections

| Field | Type | Interface | Required | Note |
|-------|------|-----------|----------|------|
| `id` | uuid | input-hash | Yes | Primary key |
| `heading` | string | input | Yes | CTA headline |
| `description` | text | textarea | No | Supporting description |
| `button_text` | string | input | Yes | Button label |
| `button_link` | string | input | Yes | Target URL |
| `button_style` | string | select-dropdown | No | primary/secondary/outline |
| `background_color` | string | select-color | No | Background color hex |

#### `block_features`

**Purpose:** Feature lists (e.g., "Why ChatGPT Bible?")

| Field | Type | Interface | Required | Note |
|-------|------|-----------|----------|------|
| `id` | uuid | input-hash | Yes | Primary key |
| `heading` | string | input | No | Section heading |
| `description` | text | textarea | No | Section description |
| `features` | json | list | Yes | Array of feature objects |

**Features JSON Structure:**
```json
[
  {
    "icon": "check_circle",
    "title": "Feature Title",
    "description": "Feature description text"
  }
]
```

#### `block_richtext`

**Purpose:** WYSIWYG content blocks

| Field | Type | Interface | Required | Note |
|-------|------|-----------|----------|------|
| `id` | uuid | input-hash | Yes | Primary key |
| `content` | text | input-rich-text-html | Yes | HTML content |

#### `block_form`

**Purpose:** Contact/newsletter forms

| Field | Type | Interface | Required | Note |
|-------|------|-----------|----------|------|
| `id` | uuid | input-hash | Yes | Primary key |
| `heading` | string | input | Yes | Form title |
| `description` | text | textarea | No | Form description |
| `form_fields` | json | list | Yes | Field definitions |
| `submit_text` | string | input | Yes | Submit button text |
| `success_message` | text | textarea | Yes | Post-submit message |
| `webhook_url` | string | input | No | Form submission endpoint |

**Form Fields JSON Structure:**
```json
[
  {
    "type": "text",
    "name": "email",
    "label": "Email Address",
    "required": true,
    "placeholder": "you@example.com"
  }
]
```

#### `block_testimonials`

**Purpose:** Customer testimonials carousel

| Field | Type | Interface | Required | Note |
|-------|------|-----------|----------|------|
| `id` | uuid | input-hash | Yes | Primary key |
| `heading` | string | input | No | Section heading |
| `testimonials` | json | list | Yes | Array of testimonial objects |

**Testimonials JSON Structure:**
```json
[
  {
    "quote": "This changed my workflow!",
    "author": "John Doe",
    "role": "Marketing Manager",
    "avatar_url": "https://..."
  }
]
```

---

## Relationships Overview

```
pages (1) ←→ (M) page_blocks (M) ←→ (1) block_*
  │
  ├─→ block_hero
  ├─→ block_cta
  ├─→ block_features
  ├─→ block_richtext
  ├─→ block_form
  └─→ block_testimonials
```

---

## Updated Collections Summary

### Existing Collections (Enhanced)

**`directus_users`** - Added fields:
- `subscription_status` (string: free/paid)
- `stripe_customer_id` (string)
- `stripe_subscription_id` (string)
- `subscription_expires_at` (timestamp)

**`prompts`** - Added fields:
- `meta_title_th` (string)
- `meta_title_en` (string)
- `meta_description_th` (text)
- `meta_description_en` (text)
- `og_image` (uuid → directus_files)

### Schema Health Assessment

**✅ Excellent Structure:**
- Bilingual support (Thai/English) throughout
- Proper slug fields for URL routing
- Good status workflows (draft/published/archived)
- Hierarchical taxonomy (categories → subcategories)

**✅ Freemium-Ready:**
- Subscription fields on users
- Clear role-based access control foundation

**⚠️ Minor Recommendations:**
1. Add `view_count` and `copy_count` to `prompts` for analytics
2. Consider adding `featured` boolean to prompts for homepage display
3. Add `published_at` timestamp to track actual publish dates vs. creation dates

---

## Next Steps

1. **Create Collections in Directus UI** (5 min):
   - Go to Settings → Data Model
   - Create 7 empty collections: `pages`, `page_blocks`, `block_hero`, `block_cta`, `block_features`, `block_richtext`, `block_form`, `block_testimonials`
   - The MCP can then add all fields automatically

2. **Configure Permissions**:
   - Public role: Read-only access to published pages
   - Free users: Read-only access to published prompts (with limit)
   - Paid users: Full read access to all published prompts

3. **Apply Schema** (Alternative):
   - Use the generated YAML file (see next document)
   - Run: `npx directus schema apply --yes < schema.yaml`

---

## See Also

- [Next.js Integration Guide](./nextjs-page-builder-integration.md)
- [Directus Schema YAML](./directus-schema.yaml)
- [CLAUDE.md](../CLAUDE.md) - Project overview
