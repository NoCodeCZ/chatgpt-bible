# Directus Admin Guide - Prompt Management

**Version:** 2.0  
**Last Updated:** 2025-11-10  
**For:** Content Administrators

**Major Update:** This guide has been updated to reflect that **subcategories are the PRIMARY organization method** for prompts. Every prompt should be assigned to a subcategory via the `subcategory_id` field.

This guide provides step-by-step instructions for managing prompts, categories, and job roles in Directus CMS.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Understanding the Taxonomy Structure](#understanding-the-taxonomy-structure)
3. [Creating Categories](#creating-categories)
4. [Creating Subcategories](#creating-subcategories)
5. [Adding a New Prompt](#adding-a-new-prompt)
6. [Creating Job Roles](#creating-job-roles)
7. [Assigning Relationships](#assigning-relationships)
8. [Setting Difficulty and Status](#setting-difficulty-and-status)
9. [Bulk Editing](#bulk-editing)
10. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing Directus

1. Navigate to your Directus instance URL (provided by your administrator)
2. Log in with your admin credentials
3. You'll see the **Content** module in the sidebar

### Navigation Overview

- **Content → Prompts**: Manage all prompts
- **Content → Categories**: Manage top-level categories
- **Content → Subcategories**: Manage subcategories (PRIMARY organization method)
- **Content → Job Roles**: Manage job roles
- **Content → Prompt Types**: Manage prompt types

---

## Understanding the Taxonomy Structure

### Hierarchy Overview

Your prompt library uses a **hierarchical taxonomy structure**:

```
Category (Top Level)
  └── Subcategory (e.g., 1.1, 1.2, 2.1)
      └── Prompts (linked via subcategory_id)
```

### Key Concepts

**Categories** (Top Level)
- Broad topic areas (e.g., "Business Management", "Marketing")
- Each category can have multiple subcategories
- Used for high-level organization

**Subcategories** (PRIMARY Organization Method)
- Specific topics within a category (e.g., "1.1 Researching Competitors", "1.2 Market Analysis")
- **Every prompt MUST be assigned to a subcategory** via `subcategory_id`
- Subcategories are numbered (e.g., 1.1, 1.2, 2.1) for easy reference
- This is the main way prompts are organized

**Prompt Types**
- Classification of prompt format (Fill-in-blank, Open-ended, Scenario, etc.)
- Optional but recommended

**Job Roles**
- Professional roles that would use the prompt (Manager, Marketer, Writer)
- Multiple roles can be assigned per prompt

### Why Subcategories?

Subcategories provide:
- **Better organization**: More specific than categories alone
- **Easier navigation**: Numbered system (1.1, 1.2) makes finding prompts simple
- **Hierarchical structure**: Category → Subcategory → Prompt
- **Required field**: Every prompt must have a subcategory

---

## Creating Subcategories

**IMPORTANT:** Subcategories are the PRIMARY way prompts are organized. Every prompt must be assigned to a subcategory.

### Adding a New Subcategory

1. **Navigate to Subcategories**
   - Click **Content** in the sidebar
   - Click **Subcategories**

2. **Create New Item**
   - Click the **+** button or **Create Item**
   - A new form will open

3. **Fill Required Fields**

   **Name (Thai):** `name_th` ⭐ **Required**
   - Thai name for the subcategory
   - Example: "การวิเคราะห์คู่แข่ง"

   **Name (English):** `name_en` ⭐ **Required**
   - English name for the subcategory
   - Example: "Researching Competitors"

   **Category:** `category_id` ⭐ **Required**
   - Select the parent category from dropdown
   - This determines which category the subcategory belongs to
   - Example: Select "Business Management" category

   **Slug:** `slug` ⭐ **Required**
   - URL-friendly identifier (usually auto-generated)
   - Example: "researching-competitors"
   - Must be unique

   **Description (Thai):** `description_th` (optional)
   - Thai description of the subcategory

   **Description (English):** `description_en` (optional)
   - English description of the subcategory

   **Sort:** `sort` (optional)
   - Number for ordering within the category
   - Use numbering like 1, 2, 3 or 1.1, 1.2, 1.3
   - Lower numbers appear first

4. **Save the Subcategory**
   - Click **Save**
   - The subcategory is now available for assignment to prompts

### Subcategory Numbering System

Many subcategories use a numbering system:
- **1.1, 1.2, 1.3** = Subcategories under Category 1
- **2.1, 2.2, 2.3** = Subcategories under Category 2
- This makes it easy to reference and organize

### Best Practices

- Create subcategories before creating prompts
- Use clear, descriptive names in both Thai and English
- Keep slugs short and readable
- Use consistent numbering for sort order
- Ensure parent category is selected correctly

---

## Adding a New Prompt

**Time Required:** <3 minutes per prompt

### Step-by-Step Process

1. **Navigate to Prompts**
   - Click **Content** in the sidebar
   - Click **Prompts**

2. **Create New Item**
   - Click the **+** button (top right) or **Create Item** button
   - A new form will open

3. **Fill Required Fields**

   **Title (Thai):** `title_th` ⭐ **Required**
   - Enter the Thai title for the prompt
   - Example: "เขียนอีเมลธุรกิจอย่างมืออาชีพ"

   **Title (English):** `title_en` ⭐ **Required**
   - Enter the English title for the prompt
   - Example: "Write Professional Business Emails"

   **Description:** `description` ⭐ **Required**
   - Brief description of what the prompt does
   - Example: "Craft professional emails for business communication with proper tone and structure"
   - Max length: ~500 characters recommended

   **Prompt Text:** `prompt_text` ⭐ **Required**
   - The actual prompt template users will copy
   - Include placeholders like `[Name]`, `[Topic]` in square brackets
   - Example:
     ```
     You are a professional email writer. Please help me write an email with the following details:
     
     Recipient: [Name/Title]
     Purpose: [Brief description]
     Tone: [Professional/Friendly/Formal]
     Key points to include: [List main points]
     
     Please write a clear, concise email that maintains appropriate professionalism.
     ```

   **Subcategory:** `subcategory_id` ⭐ **IMPORTANT - Primary Organization**
   - **Select the subcategory this prompt belongs to**
   - This is the PRIMARY way prompts are organized
   - Use the dropdown to search and select
   - Example: Select "1.1 Researching Competitors"
   - **Every prompt must have a subcategory assigned**

4. **Set Optional Fields**

   **Prompt Type:** `prompt_type_id` (optional)
   - Select the type of prompt format
   - Options: Fill-in-blank, Open-ended, Scenario, Instructional, Question-based
   - Helps users understand the prompt structure

   **Difficulty Level:** `difficulty_level` ⭐ **Required**
   - Select from dropdown:
     - **Beginner**: Simple, straightforward prompts
     - **Intermediate**: Moderate complexity
     - **Advanced**: Complex, multi-step prompts

   **Status:** `status` ⭐ **Required**
   - **Draft**: Not visible to users (work in progress)
   - **Published**: Visible to users (live)
   - **Archived**: Hidden from users (deprecated)

   **Sort:** `sort` (optional)
   - Display order within the subcategory
   - Lower numbers appear first

5. **Save the Prompt**
   - Click **Save** or press `Ctrl+S` / `Cmd+S`
   - The prompt is now created with its primary subcategory assigned

6. **Assign Additional Relationships** (Optional but Recommended)
   - After saving, you can assign:
     - **Categories** (via M2M relationship - for additional categorization)
     - **Job Roles** (via M2M relationship - for filtering by profession)
   - See [Assigning Relationships](#assigning-relationships) section below

---

## Creating Categories

### Adding a New Category

1. Navigate to **Content → Categories**
2. Click **+** or **Create Item**
3. Fill in the form:

   **Name:** `name`
   - Display name (e.g., "Email Writing")
   - This is the primary name field

   **Name (Thai):** `name_th` (optional)
   - Thai translation of the category name

   **Name (English):** `name_en` (optional)
   - English translation of the category name

   **Slug:** `slug`
   - URL-friendly identifier (auto-generated from name)
   - Example: "email-writing"
   - Must be unique

   **Description:** `description` (optional)
   - Brief explanation of the category

   **Sort:** `sort` (optional)
   - Number for ordering categories
   - Lower numbers appear first

4. Click **Save**

### Category Best Practices

- Use clear, descriptive names
- Keep slugs short and readable
- Use consistent naming conventions
- Assign sort order for logical grouping

---

## Creating Job Roles

### Adding a New Job Role

1. Navigate to **Content → Job Roles**
2. Click **+** or **Create Item**
3. Fill in the form:

   **Name:** `name`
   - Display name (e.g., "Manager", "Marketer", "Writer")

   **Slug:** `slug`
   - URL-friendly identifier (auto-generated)
   - Example: "manager"
   - Must be unique

   **Description:** `description` (optional)
   - Brief explanation of the job role

   **Sort:** `sort` (optional)
   - Number for ordering roles

4. Click **Save**

---

## Assigning Relationships

### Primary Relationship: Subcategory (Required)

**Every prompt MUST have a subcategory assigned** via the `subcategory_id` field.

1. When creating/editing a prompt
2. Find the **Subcategory** field (`subcategory_id`)
3. Use the dropdown to search and select the appropriate subcategory
4. This is the PRIMARY organization method
5. Click **Save**

**Note:** The subcategory automatically links to its parent category, so you don't need to manually link categories separately for basic organization.

### Secondary Relationships (Optional but Recommended)

#### Linking Additional Categories (M2M)

Prompts can also have **multiple categories** via the Many-to-Many relationship. This is useful for:
- Cross-categorization (prompt fits multiple broad categories)
- Enhanced filtering and discovery

**Method 1: From Prompt Edit Page**

1. Open the prompt you want to edit
2. Scroll to the **Categories** field (M2M relationship)
3. Click the dropdown or search field
4. Select one or more additional categories
5. Click **Save**

**Note:** The subcategory's parent category is automatically included, but you can add more categories if the prompt fits multiple broad topics.

#### Linking Job Roles (M2M)

Job roles help users filter prompts by profession.

1. Open the prompt you want to edit
2. Scroll to the **Job Roles** field
3. Click the dropdown or search field
4. Select one or more job roles
5. Click **Save**

### Relationship Hierarchy Summary

```
Prompt
├── subcategory_id (M2O) ⭐ PRIMARY - Required
│   └── category_id (from subcategory) - Automatic
├── categories (M2M) - Optional, for additional categorization
└── job_roles (M2M) - Optional, for profession filtering
```

### Relationship Tips

- **Always assign a subcategory** - This is required and primary
- **Assign job roles** - Helps users find prompts relevant to their profession
- **Add multiple categories** - Only if prompt fits multiple broad topics
- Select all relevant relationships for better discoverability
- Use relationships to help users find prompts via filters

---

## Setting Difficulty and Status

### Difficulty Levels

- **Beginner**: Simple prompts, easy to use, minimal customization needed
- **Intermediate**: Moderate complexity, some customization required
- **Advanced**: Complex prompts, requires understanding of context and customization

### Status Management

**Draft**
- Use for prompts still being written or reviewed
- Not visible to end users
- Safe to experiment

**Published**
- Use for prompts ready for users
- Visible in the frontend
- Appears in search and filters
- **Always set to Published before going live**

**Archived**
- Use for deprecated or outdated prompts
- Hidden from users but preserved in database
- Can be restored later if needed

---

## Bulk Editing

### Editing Multiple Prompts

1. Navigate to **Content → Prompts**
2. Select multiple prompts using checkboxes
3. Click **Batch Edit** (if available) or edit individually
4. Make changes to common fields (e.g., status, difficulty)
5. Click **Save**

### Bulk Status Updates

1. Filter prompts by status (e.g., all "Draft" prompts)
2. Select all visible prompts
3. Use batch edit to change status to "Published"
4. Save changes

### Limitations

- Not all fields can be bulk-edited
- Relationships (categories, job roles) typically require individual editing
- Always review changes before saving

---

## Troubleshooting

### Common Issues

#### Prompt Not Appearing in Frontend

**Possible Causes:**
1. Status is not set to "Published"
   - **Solution**: Change status to "Published"

2. Missing required fields
   - **Solution**: Ensure `title_th`, `title_en`, `description`, and `prompt_text` are filled

3. Missing subcategory assignment
   - **Solution**: Assign a subcategory via `subcategory_id` field (highly recommended)

4. Frontend cache
   - **Solution**: Clear browser cache or wait a few minutes for cache to refresh

#### Subcategory Not Showing

**Possible Causes:**
1. Subcategory not assigned
   - **Solution**: Edit prompt and assign a subcategory via `subcategory_id` field

2. Subcategory not created
   - **Solution**: Create subcategory first in **Content → Subcategories**, then assign to prompt

3. Parent category missing
   - **Solution**: Ensure subcategory has a parent category assigned

#### Categories/Job Roles Not Showing

**Possible Causes:**
1. Relationships not assigned
   - **Solution**: Edit prompt and assign categories/job roles via M2M relationships

2. Categories/roles not created
   - **Solution**: Create categories/job roles first, then assign to prompts

**Note:** Subcategories are separate from M2M categories. The subcategory is the primary organization method.

#### Slug Conflicts

**Error**: "Slug already exists"

**Solution:**
- Change the slug to something unique
- Directus auto-generates slugs, but you can edit them manually

#### Can't Save Prompt

**Possible Causes:**
1. Missing required fields
   - **Solution**: Check that all required fields (marked with *) are filled

2. Invalid data format
   - **Solution**: Check field types (e.g., difficulty must be one of: beginner, intermediate, advanced)

3. Permission issues
   - **Solution**: Contact administrator to check your role permissions

### Getting Help

If you encounter issues not covered here:

1. Check Directus documentation: https://docs.directus.io
2. Contact your system administrator
3. Check the error message for specific details

---

## Quick Reference

### Required Fields for Prompts

- ✅ `title_th` OR `title_en` (at least one)
- ✅ `description`
- ✅ `prompt_text`
- ✅ `difficulty_level`
- ✅ `status`

### Optional Fields

- `subcategory_id` - Link to subcategory
- `prompt_type_id` - Link to prompt type
- `sort` - Display order

### Field Types

- **Text fields**: Plain text input
- **Textarea**: Multi-line text (for descriptions, prompt_text)
- **Dropdown**: Select from predefined options (difficulty, status)
- **Relations**: Link to other collections (categories, job roles)

---

## Best Practices

### Content Quality

1. **Write clear descriptions**
   - Users should understand what the prompt does from the description
   - Keep descriptions concise but informative

2. **Use consistent formatting**
   - Follow existing prompt templates
   - Use consistent placeholder format: `[Placeholder Name]`

3. **Test prompts before publishing**
   - Copy prompt text and test in ChatGPT
   - Verify it produces expected results

### Organization

1. **Always assign a subcategory** ⭐ **CRITICAL**
   - This is the PRIMARY organization method
   - Every prompt must have a subcategory
   - Choose the most specific subcategory that fits

2. **Assign appropriate job roles**
   - Link to all relevant roles
   - Consider who would use this prompt
   - Helps users filter by profession

3. **Add additional categories if needed**
   - Only if prompt fits multiple broad topics
   - Don't over-tag (2-3 categories max per prompt)
   - Use specific categories over generic ones

4. **Set correct difficulty**
   - Be honest about complexity
   - Helps users find appropriate prompts

### Workflow

1. **Create as Draft first**
   - Write and review before publishing
   - Test relationships and formatting

2. **Review before publishing**
   - Check all fields are correct
   - Verify relationships are assigned
   - Test the prompt text

3. **Use consistent naming**
   - Follow existing patterns
   - Keep titles descriptive but concise

---

## Advanced Features

### SEO Fields

Prompts include optional SEO fields for better search engine optimization:

- **Meta Title (Thai/English)**: Override the page title for SEO
- **Meta Description (Thai/English)**: Custom description for search results
- **OG Image**: Image for social media sharing (1200x630px recommended)

These fields are optional but recommended for better discoverability.

### Using Prompt Types

If your instance uses prompt types:

1. Navigate to **Content → Prompt Types**
2. Create prompt type (e.g., "Fill-in-blank", "Open-ended")
3. Link prompts via `prompt_type_id` field

---

## Appendix: Field Reference

### Prompt Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Auto | Unique identifier |
| `title_th` | String | Yes | Thai title |
| `title_en` | String | Yes | English title |
| `description` | Text | Yes | Brief description |
| `prompt_text` | Text | Yes | Full prompt template |
| `difficulty_level` | Dropdown | Yes | beginner/intermediate/advanced |
| `status` | Dropdown | Yes | draft/published/archived |
| `subcategory_id` | Relation (M2O) | ⭐ **Highly Recommended** | **PRIMARY organization** - Link to subcategory |
| `prompt_type_id` | Relation (M2O) | No | Link to prompt type (Fill-in-blank, Open-ended, etc.) |
| `sort` | Integer | No | Display order within subcategory |
| `meta_title_th` | String | No | SEO title override (Thai) |
| `meta_title_en` | String | No | SEO title override (English) |
| `meta_description_th` | Text | No | SEO description (Thai) |
| `meta_description_en` | Text | No | SEO description (English) |
| `og_image` | File (Image) | No | Social media sharing image |

**Relationships (M2M):**
- `categories` - Additional categories (via `prompt_categories` junction)
- `job_roles` - Job roles (via `prompt_job_roles` junction)

### Subcategory Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Auto | Unique identifier |
| `name_th` | String | Yes | Thai name |
| `name_en` | String | Yes | English name |
| `slug` | String | Yes | URL-friendly identifier |
| `category_id` | Relation (M2O) | Yes | Parent category |
| `description_th` | Text | No | Thai description |
| `description_en` | Text | No | English description |
| `sort` | Integer | No | Display order (e.g., 1.1, 1.2) |

### Category Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Auto | Unique identifier |
| `name` | String | Yes | Display name |
| `name_th` | String | No | Thai name |
| `name_en` | String | No | English name |
| `slug` | String | Yes | URL-friendly ID |
| `description` | Text | No | Category description |
| `description_th` | Text | No | Thai description |
| `description_en` | Text | No | English description |
| `sort` | Integer | No | Display order |

### Job Role Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Auto | Unique identifier |
| `name` | String | Yes | Display name |
| `slug` | String | Yes | URL-friendly ID |
| `description` | Text | No | Role description |
| `sort` | Integer | No | Display order |

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-10  
**Maintained by:** Development Team

