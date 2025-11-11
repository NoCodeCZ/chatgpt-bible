# ChatGPT Bible - Database Schema Diagram

## Visual Schema Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CHATGPT BIBLE DATABASE                          │
│                         Directus Schema v1.0                            │
└─────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────┐
│                          MAIN CONTENT LAYER                               │
└───────────────────────────────────────────────────────────────────────────┘

╔═══════════════════════════╗         ╔═══════════════════════════╗
║         PAGES             ║         ║        PROMPTS            ║
║  📄 Website Pages         ║         ║   🧠 Prompt Library       ║
╠═══════════════════════════╣         ╠═══════════════════════════╣
║ PK  id (uuid)             ║         ║ PK  id (integer)          ║
║     status (string)       ║         ║     status (string)       ║
║     page_type (string)    ║         ║     title_th (string)     ║
║     priority (string)     ║         ║     title_en (string)     ║
║     title (string)        ║         ║     description (text)    ║
║     permalink (string) UK ║         ║     prompt_text (text)    ║
║     tags (json)           ║         ║     difficulty_level      ║
║     published_date        ║         ║     sort (integer)        ║
║                           ║         ║     meta_title_th         ║
║ --- SEO GROUP ---         ║         ║     meta_title_en         ║
║     seo_title (string)    ║         ║     meta_description_th   ║
║     seo_description (text)║         ║     meta_description_en   ║
║ FK  seo_image → files     ║         ║ FK  og_image → files      ║
║                           ║         ║ FK  prompt_type_id        ║
║ --- SYSTEM ---            ║         ║ FK  subcategory_id        ║
║     sort (integer)        ║         ║                           ║
║     date_created          ║         ║ --- SYSTEM ---            ║
║     date_updated          ║         ║     date_created          ║
║ FK  user_created → users  ║         ║     date_updated          ║
║ FK  user_updated → users  ║         ║ FK  user_created → users  ║
╚═══════════════════════════╝         ║ FK  user_updated → users  ║
           │                          ╚═══════════════════════════╝
           │                                     │
           │ M2M via page_blocks                 │ M2M
           │                                     │
           ▼                                     ▼
    ┌──────────────┐                   ┌─────────────────┐
    │ PAGE_BLOCKS  │                   │ PROMPT_         │
    │  (Junction)  │                   │ CATEGORIES      │
    ├──────────────┤                   │  (Junction)     │
    │ PK  id       │                   ├─────────────────┤
    │ FK  pages_id │                   │ PK  id          │
    │     collection│                   │ FK  prompts_id  │
    │     item     │                   │ FK  categories_ │
    │     sort     │                   │     id          │
    │     hide_block│                   └─────────────────┘
    └──────────────┘                            │
           │                                    │
           │ M2A Polymorphic                    ▼
           │                          ┌─────────────────┐
           └──────────────────────────│ PROMPT_JOB_     │
                                      │ ROLES           │
                                      │  (Junction)     │
                                      ├─────────────────┤
                                      │ PK  id          │
                                      │ FK  prompts_id  │
                                      │ FK  job_roles_id│
                                      └─────────────────┘

┌───────────────────────────────────────────────────────────────────────────┐
│                          BLOCK COMPONENTS LAYER                           │
│                   (M2A - Many-to-Any Relationship)                        │
└───────────────────────────────────────────────────────────────────────────┘

╔════════════════════╗  ╔════════════════════╗  ╔════════════════════╗
║   BLOCK_HERO       ║  ║   BLOCK_CTA        ║  ║  BLOCK_FEATURES    ║
║  🖼 Hero Sections  ║  ║  📢 Call-to-Action ║  ║  ⭐ Feature Lists  ║
╠════════════════════╣  ╠════════════════════╣  ╠════════════════════╣
║ PK  id (uuid)      ║  ║ PK  id (uuid)      ║  ║ PK  id (uuid)      ║
║     heading        ║  ║     heading        ║  ║     heading        ║
║     subheading     ║  ║     description    ║  ║     description    ║
║     cta_text       ║  ║     button_text    ║  ║     features (json)║
║     cta_link       ║  ║     button_link    ║  ║     admin_note     ║
║ FK  background_img ║  ║     button_style   ║  ║     date_created   ║
║     text_align     ║  ║     bg_color       ║  ║     date_updated   ║
║     theme          ║  ║     admin_note     ║  ║ FK  user_created   ║
║     admin_note     ║  ║     date_created   ║  ║ FK  user_updated   ║
║     date_created   ║  ║     date_updated   ║  ╚════════════════════╝
║     date_updated   ║  ║ FK  user_created   ║
║ FK  user_created   ║  ║ FK  user_updated   ║  ╔════════════════════╗
║ FK  user_updated   ║  ╚════════════════════╝  ║  BLOCK_RICHTEXT    ║
╚════════════════════╝                          ║  📝 Text Content   ║
                                                ╠════════════════════╣
╔════════════════════╗  ╔════════════════════╗  ║ PK  id (uuid)      ║
║   BLOCK_FORM       ║  ║ BLOCK_TESTIMONIALS ║  ║     content (html) ║
║  📧 Forms          ║  ║  💬 Testimonials   ║  ║     admin_note     ║
╠════════════════════╣  ╠════════════════════╣  ║     date_created   ║
║ PK  id (uuid)      ║  ║ PK  id (uuid)      ║  ║     date_updated   ║
║     heading        ║  ║     heading        ║  ║ FK  user_created   ║
║     description    ║  ║     testimonials   ║  ║ FK  user_updated   ║
║     form_fields    ║  ║     (json)         ║  ╚════════════════════╝
║     (json)         ║  ║     admin_note     ║
║     submit_text    ║  ║     date_created   ║
║     success_msg    ║  ║     date_updated   ║
║     webhook_url    ║  ║ FK  user_created   ║
║     admin_note     ║  ║ FK  user_updated   ║
║     date_created   ║  ╚════════════════════╝
║     date_updated   ║
║ FK  user_created   ║
║ FK  user_updated   ║
╚════════════════════╝

┌───────────────────────────────────────────────────────────────────────────┐
│                          TAXONOMY & CLASSIFICATION                        │
└───────────────────────────────────────────────────────────────────────────┘

╔═══════════════════════════╗         ╔═══════════════════════════╗
║       CATEGORIES          ║         ║     SUBCATEGORIES         ║
║  📂 Main Categories       ║─────────║  📁 Hierarchical Sub-cats ║
╠═══════════════════════════╣   1:M   ╠═══════════════════════════╣
║ PK  id (uuid)             ║         ║ PK  id (integer)          ║
║     name (string)         ║         ║     name_th (string)      ║
║     slug (string) UK      ║         ║     name_en (string)      ║
║     description (text)    ║         ║     slug (string) UK      ║
║     sort (integer)        ║         ║     description_th        ║
║     name_th (string)      ║         ║     description_en        ║
║     name_en (string)      ║         ║ FK  category_id           ║
║     description_th        ║         ║     sort (integer)        ║
║     description_en        ║         ╚═══════════════════════════╝
╚═══════════════════════════╝

╔═══════════════════════════╗         ╔═══════════════════════════╗
║       JOB_ROLES           ║         ║     PROMPT_TYPES          ║
║  👤 User Job Roles        ║         ║  🏷️ Prompt Types         ║
╠═══════════════════════════╣         ╠═══════════════════════════╣
║ PK  id (integer)          ║         ║ PK  id (uuid)             ║
║     name (string)         ║         ║     name_th (string)      ║
║     slug (string) UK      ║         ║     name_en (string)      ║
║     description (text)    ║         ║     slug (string) UK      ║
║     sort (integer)        ║         ║     description_th        ║
╚═══════════════════════════╝         ║     description_en        ║
                                      ║     icon (string)         ║
                                      ║     sort (integer)        ║
                                      ╚═══════════════════════════╝

┌───────────────────────────────────────────────────────────────────────────┐
│                          SYSTEM & AUTHENTICATION                          │
└───────────────────────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════════════════╗
║                          DIRECTUS_USERS (Extended)                        ║
║                      👤 System Users + Subscriptions                      ║
╠═══════════════════════════════════════════════════════════════════════════╣
║ PK  id (uuid)                                                             ║
║     email (string) UK                                                     ║
║     password (hash)                                                       ║
║     first_name (string)                                                   ║
║     last_name (string)                                                    ║
║     role (uuid) → directus_roles                                          ║
║     status (string)                                                       ║
║                                                                           ║
║ --- SUBSCRIPTION FIELDS (Custom) ---                                      ║
║     subscription_status (string)      [free | paid]                       ║
║     stripe_customer_id (string)       [cus_xxx]                           ║
║     stripe_subscription_id (string)   [sub_xxx]                           ║
║     subscription_expires_at (timestamp)                                   ║
║                                                                           ║
║ --- SYSTEM FIELDS ---                                                     ║
║     date_created (timestamp)                                              ║
║     last_access (timestamp)                                               ║
║     token (string)                                                        ║
║     language (string)                                                     ║
╚═══════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════╗
║    DIRECTUS_FILES         ║
║  📁 File Assets           ║
╠═══════════════════════════╣
║ PK  id (uuid)             ║
║     filename_download     ║
║     title (string)        ║
║     type (string)         ║
║     filesize (integer)    ║
║     width (integer)       ║
║     height (integer)      ║
║ FK  uploaded_by → users   ║
║     uploaded_on           ║
╚═══════════════════════════╝
```

---

## Relationship Summary

### M2M (Many-to-Many) Relationships

```
PAGES ←──→ PAGE_BLOCKS ←──→ BLOCKS (M2A Polymorphic)
  │
  └─ Can have multiple blocks
  └─ Blocks can be reused on multiple pages

PROMPTS ←──→ PROMPT_CATEGORIES ←──→ CATEGORIES
  │
  └─ Prompts can have multiple categories
  └─ Categories can have multiple prompts

PROMPTS ←──→ PROMPT_JOB_ROLES ←──→ JOB_ROLES
  │
  └─ Prompts can be for multiple job roles
  └─ Job roles can have multiple prompts
```

### M2O (Many-to-One) Relationships

```
SUBCATEGORIES ──→ CATEGORIES
  │
  └─ Each subcategory belongs to one category

PROMPTS ──→ SUBCATEGORIES
  │
  └─ Each prompt belongs to one subcategory

PROMPTS ──→ PROMPT_TYPES
  │
  └─ Each prompt has one type

PAGES ──→ DIRECTUS_FILES (seo_image)
PROMPTS ──→ DIRECTUS_FILES (og_image)
BLOCK_HERO ──→ DIRECTUS_FILES (background_image)
  │
  └─ Multiple items can reference same file
```

### M2A (Many-to-Any) Polymorphic Relationship

```
PAGES ←──→ PAGE_BLOCKS ←──→ [BLOCK_HERO
                              BLOCK_CTA
                              BLOCK_FEATURES
                              BLOCK_RICHTEXT
                              BLOCK_FORM
                              BLOCK_TESTIMONIALS]

The 'collection' + 'item' fields in PAGE_BLOCKS create the polymorphic link
```

---

## Data Flow Diagrams

### Page Rendering Flow

```
┌─────────┐
│ REQUEST │  User visits: yoursite.com/about
└────┬────┘
     │
     ▼
┌─────────────────────────────────┐
│ NEXT.JS DYNAMIC ROUTE           │
│ app/[...permalink]/page.tsx     │
└────┬────────────────────────────┘
     │
     │ Query: permalink = "about"
     ▼
┌─────────────────────────────────┐
│ DIRECTUS API                    │
│ GET /items/pages?               │
│   filter[permalink]=about       │
│   &fields=*,blocks.item:*       │
└────┬────────────────────────────┘
     │
     │ Returns:
     │ {
     │   id: "...",
     │   title: "About Us",
     │   blocks: [
     │     {collection: "block_hero", item: {...}},
     │     {collection: "block_cta", item: {...}}
     │   ]
     │ }
     ▼
┌─────────────────────────────────┐
│ PAGE BUILDER COMPONENT          │
│ Iterates blocks, renders each   │
└────┬────────────────────────────┘
     │
     ├─→ <HeroBlock {...item} />
     ├─→ <CtaBlock {...item} />
     └─→ <FeaturesBlock {...item} />
     │
     ▼
┌─────────────────────────────────┐
│ RENDERED HTML                   │
│ Served to user                  │
└─────────────────────────────────┘
```

### Freemium Access Flow

```
┌─────────────┐
│ USER LOGIN  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│ DIRECTUS AUTH                   │
│ Returns JWT + user data         │
└──────┬──────────────────────────┘
       │
       │ User data includes:
       │ subscription_status: "free"
       │
       ▼
┌─────────────────────────────────┐
│ NEXT.JS MIDDLEWARE              │
│ Checks subscription_status      │
└──────┬──────────────────────────┘
       │
       ├─→ FREE USER
       │   └─→ Query prompts with limit=3
       │
       └─→ PAID USER
           └─→ Query all prompts (no limit)
       │
       ▼
┌─────────────────────────────────┐
│ RENDER PROMPTS                  │
│ With/without paywall            │
└─────────────────────────────────┘
```

### Stripe Webhook Flow

```
┌──────────────┐
│ STRIPE EVENT │  checkout.session.completed
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────┐
│ NEXT.JS API ROUTE               │
│ /api/webhooks/stripe            │
└──────┬──────────────────────────┘
       │
       │ 1. Verify signature
       │ 2. Parse event
       │
       ▼
┌─────────────────────────────────┐
│ UPDATE DIRECTUS_USERS           │
│ PATCH /users/{id}               │
│ {                               │
│   subscription_status: "paid",  │
│   stripe_customer_id: "cus_...",│
│   stripe_subscription_id: "...", │
│   subscription_expires_at: "..." │
│ }                               │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ USER NOW HAS PAID ACCESS        │
└─────────────────────────────────┘
```

---

## Field Type Legend

```
PK  = Primary Key
FK  = Foreign Key
UK  = Unique Key
M2O = Many-to-One Relationship
O2M = One-to-Many Relationship
M2M = Many-to-Many Relationship
M2A = Many-to-Any (Polymorphic)
```

## Data Type Reference

```
uuid      = Universally Unique Identifier
integer   = Auto-incrementing integer
string    = Variable-length text (max 255)
text      = Long-form text
json      = JSON data structure
timestamp = Date and time with timezone
boolean   = true/false
hash      = Hashed password
```

---

## Collection Statistics

| Category | Collections | Total Fields | Relationships |
|----------|-------------|--------------|---------------|
| Content | 2 | 42 | 8 |
| Blocks | 6 | 48 | 6 |
| Taxonomy | 4 | 32 | 3 |
| Junction | 3 | 15 | 6 |
| System | 2 (extended) | 8 custom | 4 |
| **TOTAL** | **17** | **145+** | **27** |

---

## Index Recommendations (for Production)

```sql
-- Pages
CREATE INDEX idx_pages_permalink ON pages(permalink);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_pages_page_type ON pages(page_type);

-- Prompts
CREATE INDEX idx_prompts_status ON prompts(status);
CREATE INDEX idx_prompts_subcategory ON prompts(subcategory_id);
CREATE INDEX idx_prompts_type ON prompts(prompt_type_id);

-- Junction Tables
CREATE INDEX idx_page_blocks_pages ON page_blocks(pages_id);
CREATE INDEX idx_page_blocks_collection ON page_blocks(collection, item);
CREATE INDEX idx_prompt_categories_prompts ON prompt_categories(prompts_id);
CREATE INDEX idx_prompt_categories_categories ON prompt_categories(categories_id);

-- Users
CREATE INDEX idx_users_subscription ON directus_users(subscription_status);
CREATE INDEX idx_users_stripe_customer ON directus_users(stripe_customer_id);
```

---

## Visual Schema Generator

For an interactive visual diagram, you can:

1. **Use dbdiagram.io:**
   - Copy the DBML code below
   - Paste at https://dbdiagram.io/

2. **Use draw.io:**
   - Import the schema
   - Auto-generate ER diagram

3. **Use Directus Data Studio:**
   - Go to Settings → Data Model
   - Visual relationship view

---

## DBML Code (for dbdiagram.io)

```dbml
// ChatGPT Bible Database Schema

Table pages {
  id uuid [pk]
  status varchar
  page_type varchar
  priority varchar
  title varchar
  permalink varchar [unique]
  tags json
  published_date timestamp
  seo_title varchar
  seo_description text
  seo_image uuid [ref: > directus_files.id]
  sort integer
  date_created timestamp
  date_updated timestamp
  user_created uuid [ref: > directus_users.id]
  user_updated uuid [ref: > directus_users.id]
}

Table prompts {
  id integer [pk]
  status varchar
  title_th varchar
  title_en varchar
  description text
  prompt_text text
  difficulty_level varchar
  sort integer
  meta_title_th varchar
  meta_title_en varchar
  meta_description_th text
  meta_description_en text
  og_image uuid [ref: > directus_files.id]
  prompt_type_id uuid [ref: > prompt_types.id]
  subcategory_id integer [ref: > subcategories.id]
  date_created timestamp
  date_updated timestamp
  user_created uuid [ref: > directus_users.id]
  user_updated uuid [ref: > directus_users.id]
}

Table page_blocks {
  id integer [pk]
  pages_id uuid [ref: > pages.id]
  collection varchar
  item varchar
  sort integer
  hide_block boolean
}

Table block_hero {
  id uuid [pk]
  heading varchar
  subheading text
  cta_text varchar
  cta_link varchar
  background_image uuid [ref: > directus_files.id]
  text_align varchar
  theme varchar
  admin_note text
  date_created timestamp
  date_updated timestamp
  user_created uuid [ref: > directus_users.id]
  user_updated uuid [ref: > directus_users.id]
}

Table block_cta {
  id uuid [pk]
  heading varchar
  description text
  button_text varchar
  button_link varchar
  button_style varchar
  background_color varchar
  admin_note text
  date_created timestamp
  date_updated timestamp
  user_created uuid [ref: > directus_users.id]
  user_updated uuid [ref: > directus_users.id]
}

Table block_features {
  id uuid [pk]
  heading varchar
  description text
  features json
  admin_note text
  date_created timestamp
  date_updated timestamp
  user_created uuid [ref: > directus_users.id]
  user_updated uuid [ref: > directus_users.id]
}

Table block_richtext {
  id uuid [pk]
  content text
  admin_note text
  date_created timestamp
  date_updated timestamp
  user_created uuid [ref: > directus_users.id]
  user_updated uuid [ref: > directus_users.id]
}

Table block_form {
  id uuid [pk]
  heading varchar
  description text
  form_fields json
  submit_text varchar
  success_message text
  webhook_url varchar
  admin_note text
  date_created timestamp
  date_updated timestamp
  user_created uuid [ref: > directus_users.id]
  user_updated uuid [ref: > directus_users.id]
}

Table block_testimonials {
  id uuid [pk]
  heading varchar
  testimonials json
  admin_note text
  date_created timestamp
  date_updated timestamp
  user_created uuid [ref: > directus_users.id]
  user_updated uuid [ref: > directus_users.id]
}

Table categories {
  id uuid [pk]
  name varchar
  slug varchar [unique]
  description text
  sort integer
  name_th varchar
  name_en varchar
  description_th text
  description_en text
}

Table subcategories {
  id integer [pk]
  name_th varchar
  name_en varchar
  slug varchar [unique]
  description_th text
  description_en text
  category_id uuid [ref: > categories.id]
  sort integer
}

Table job_roles {
  id integer [pk]
  name varchar
  slug varchar [unique]
  description text
  sort integer
}

Table prompt_types {
  id uuid [pk]
  name_th varchar
  name_en varchar
  slug varchar [unique]
  description_th text
  description_en text
  icon varchar
  sort integer
}

Table prompt_categories {
  id integer [pk]
  prompts_id integer [ref: > prompts.id]
  categories_id uuid [ref: > categories.id]
}

Table prompt_job_roles {
  id integer [pk]
  prompts_id integer [ref: > prompts.id]
  job_roles_id integer [ref: > job_roles.id]
}

Table directus_users {
  id uuid [pk]
  email varchar [unique]
  password varchar
  first_name varchar
  last_name varchar
  role uuid
  status varchar
  subscription_status varchar [note: 'free | paid']
  stripe_customer_id varchar
  stripe_subscription_id varchar
  subscription_expires_at timestamp
  date_created timestamp
  last_access timestamp
}

Table directus_files {
  id uuid [pk]
  filename_download varchar
  title varchar
  type varchar
  filesize integer
  width integer
  height integer
  uploaded_by uuid [ref: > directus_users.id]
  uploaded_on timestamp
}
```

---

This complete database schema shows all 17 collections, 145+ fields, and 27 relationships in your ChatGPT Bible Directus instance!
