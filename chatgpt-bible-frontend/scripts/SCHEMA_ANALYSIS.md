# Directus Schema Analysis - Pre-Upload Review

## ✅ Schema Structure - CORRECT

### Collections Verified

1. **`prompts`** (Main Collection)
   - ✅ Primary Key: INTEGER (auto-increment)
   - ✅ Required Fields: `status`, `description`, `prompt_text`, `difficulty_level`, `title_th`, `title_en`
   - ✅ Relationships:
     - `subcategory_id` → `subcategories.id` (M2O, INTEGER)
     - `prompt_type_id` → `prompt_types.id` (M2O, UUID)
   - ✅ Status: Working correctly

2. **`categories`** (Taxonomy)
   - ✅ Primary Key: UUID
   - ✅ Bilingual Fields: `name_th`, `name_en`, `description_th`, `description_en`
   - ✅ Fields: `name`, `slug`, `description`, `sort`
   - ✅ Status: Working correctly

3. **`subcategories`** (Hierarchical Taxonomy)
   - ✅ Primary Key: INTEGER
   - ✅ Bilingual Fields: `name_th`, `name_en`, `description_th`, `description_en`
   - ✅ Relationship: `category_id` → `categories.id` (M2O, UUID)
   - ✅ Fields: `slug`, `sort`
   - ✅ Status: Working correctly

4. **`prompt_types`** (Taxonomy)
   - ✅ Primary Key: UUID
   - ✅ Bilingual Fields: `name_th`, `name_en`, `description_th`, `description_en`
   - ✅ Fields: `slug`, `icon`, `sort`
   - ✅ Status: Working correctly

5. **`job_roles`** (Taxonomy)
   - ✅ Primary Key: INTEGER
   - ✅ Fields: `name`, `slug`, `description`, `sort`
   - ✅ Status: Working correctly

6. **`prompt_categories`** (Junction Table - Many-to-Many)
   - ✅ Primary Key: INTEGER
   - ✅ Fields:
     - `prompts_id` (INTEGER) → `prompts.id`
     - `categories_id` (UUID) → `categories.id`
   - ✅ Status: **Working correctly** (accessible via MCP)

7. **`prompt_job_roles`** (Junction Table - Many-to-Many)
   - ✅ Primary Key: INTEGER
   - ✅ Fields:
     - `prompts_id` (INTEGER) → `prompts.id`
     - `job_roles_id` (INTEGER) → `job_roles.id`
   - ✅ Status: **Working correctly** (accessible via MCP)

## ⚠️ Issues Found

### 1. Duplicate Categories

**Problem:** Two "General Business Toolkit" categories exist:

| UUID | Name | Slug | Created | Relationships |
|------|------|------|---------|---------------|
| `baa5b0de-5e8b-4c83-bd99-d6144648717c` | General Business Toolkit | general-business-toolkit | Older | Has relationships (prompts 4, 6) |
| `e5df043e-8777-4aba-9086-8725dbbda592` | General Business Toolkit | general-business-toolkit | Newer | No relationships yet |

**Impact:**
- Confusion about which category to use
- Existing prompts (4, 6) linked to old category
- New prompts (7-16) should link to new category, but we haven't created junction records yet

**Recommendation:**
- **Option A (Recommended):** Use the newer category (`e5df043e-8777-4aba-9086-8725dbbda592`) and migrate existing relationships
- **Option B:** Delete the newer category and use the older one
- **Action Required:** Before full upload, decide which category to use and clean up duplicates

### 2. Duplicate Subcategories

**Problem:** Subcategory "การวิเคราะห์คู่แข่ง" (Researching Your Competitors) exists twice:

| ID | Name | Slug | Category UUID | Created |
|----|------|------|---------------|---------|
| 1 | Researching Your Competitors | researching-competitors | `baa5b0de-5e8b-4c83-bd99-d6144648717c` | Older |
| 2 | Researching Your Competitors | researching-competitors | `e5df043e-8777-4aba-9086-8725dbbda592` | Newer |

**Impact:**
- New prompts (7-16) are correctly linked to subcategory ID 2
- Old prompts (4, 6) may be linked to subcategory ID 1
- Need to verify and consolidate

**Recommendation:**
- Use subcategory ID 2 (newer one) for all new uploads
- Verify old prompts and migrate if needed

### 3. Missing Category/Job Role Relationships

**Current Status:**
- ✅ Prompts have `subcategory_id` relationships (working)
- ✅ Prompts have `prompt_type_id` relationships (working)
- ❌ Prompts do NOT have `categories` relationships via junction table (not created yet)
- ❌ Prompts do NOT have `job_roles` relationships via junction table (not created yet)

**Note:** Junction tables are accessible, but we haven't created the relationships for new prompts (7-16) yet.

## ✅ Schema Validation - PASSED

### Field Types Match
- ✅ `prompts.id` (INTEGER) matches `prompt_categories.prompts_id` (INTEGER)
- ✅ `prompts.id` (INTEGER) matches `prompt_job_roles.prompts_id` (INTEGER)
- ✅ `categories.id` (UUID) matches `prompt_categories.categories_id` (UUID)
- ✅ `job_roles.id` (INTEGER) matches `prompt_job_roles.job_roles_id` (INTEGER)
- ✅ `subcategories.id` (INTEGER) matches `prompts.subcategory_id` (INTEGER)
- ✅ `prompt_types.id` (UUID) matches `prompts.prompt_type_id` (UUID)

### Required Fields Present
- ✅ All required fields exist and are properly typed
- ✅ Bilingual support (Thai/English) is correctly implemented
- ✅ Status field with correct choices (draft, published, archived)
- ✅ Difficulty level with correct choices (beginner, intermediate, advanced)

## 📋 Pre-Upload Checklist

### Before Full Upload:

- [ ] **Resolve duplicate categories**
  - Decide which "General Business Toolkit" category to use
  - Migrate existing relationships if needed
  - Delete unused duplicate

- [ ] **Resolve duplicate subcategories**
  - Verify all prompts use consistent subcategory IDs
  - Migrate if needed

- [ ] **Create category mapping**
  - Map category numbers (1-16) to UUIDs
  - Document for upload script

- [ ] **Create subcategory mapping**
  - Map subcategory numbers (1.1, 1.2, etc.) to IDs
  - Document for upload script

- [ ] **Verify prompt type mapping**
  - All prompt types exist and are mapped correctly
  - ✅ Already verified: 5 prompt types ready

- [ ] **Test junction table access**
  - ✅ Verified: `prompt_categories` accessible
  - ✅ Verified: `prompt_job_roles` accessible

## 🎯 Recommended Action Plan

1. **Clean up duplicates** (5 minutes)
   - Delete old category `baa5b0de-5e8b-4c83-bd99-d6144648717c` OR migrate its relationships
   - Delete old subcategory ID 1 OR migrate its relationships

2. **Create category/subcategory mapping** (10 minutes)
   - Build mapping from parsed data numbers to Directus UUIDs/IDs
   - Save to mapping file for upload script

3. **Proceed with full upload** (30-60 minutes)
   - Create remaining 91 subcategories
   - Upload 920 remaining prompts in batches
   - Create junction table relationships for categories and job roles

## ✅ Conclusion

**Schema is structurally sound and ready for upload.** 

The only issues are:
1. Duplicate categories/subcategories (data cleanup needed)
2. Missing junction table relationships (will be created during upload)

**Recommendation:** Clean up duplicates first, then proceed with full upload.

