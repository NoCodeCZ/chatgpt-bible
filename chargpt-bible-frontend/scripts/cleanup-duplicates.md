# Cleanup Duplicates - Manual Steps Required

## Current State

**Duplicates Found:**
1. Category: `baa5b0de-5e8b-4c83-bd99-d6144648717c` (old) vs `e5df043e-8777-4aba-9086-8725dbbda592` (new)
2. Subcategory: ID 1 (old, linked to old category) vs ID 2 (new, linked to new category)

**Foreign Key Constraints:**
- Prompt 4 has `subcategory_id = 1` (old)
- Prompt_categories records 1 & 2 point to old category UUID
- Cannot delete old entries until references are updated

## Cleanup Steps (Execute in Directus Admin UI)

### Step 1: Update Prompt 4
- Navigate to: Content → Prompts → Prompt ID 4
- Change `subcategory_id` from `1` to `2`
- Save

### Step 2: Update Prompt_Categories Junction Records
- Navigate to: Content → Prompt_Categories
- Record ID 1: Change `categories_id` from `baa5b0de-5e8b-4c83-bd99-d6144648717c` to `e5df043e-8777-4aba-9086-8725dbbda592`
- Record ID 2: Change `categories_id` from `baa5b0de-5e8b-4c83-bd99-d6144648717c` to `e5df043e-8777-4aba-9086-8725dbbda592`
- Save both

### Step 3: Delete Old Subcategory
- Navigate to: Content → Subcategories → ID 1
- Delete (should work now since prompt 4 is updated)

### Step 4: Delete Old Category
- Navigate to: Content → Categories → `baa5b0de-5e8b-4c83-bd99-d6144648717c`
- Delete (should work now since junction records are updated)

### Step 5: Clean Up Other Test Categories (Optional)
- Delete: `517561d0-6a1a-4d5a-94fb-1b57b9af56c6` (Test Category)
- Delete: `0901519d-158a-47ff-9578-3bcba1a7ce28` (General Business Toolkit - different slug)
- Delete: `550e8400-e29b-41d4-a716-446655440001` (Email Writing - if not needed)

## After Cleanup

**Expected Final State:**
- ✅ One "General Business Toolkit" category: `e5df043e-8777-4aba-9086-8725dbbda592`
- ✅ One "Researching Your Competitors" subcategory: ID 2
- ✅ All prompts linked to correct subcategory
- ✅ All category relationships via junction table point to correct category

## Verify Cleanup

After cleanup, verify:
```bash
# Check categories
mcp_directus_items read categories --filter slug=general-business-toolkit
# Should return only 1 result

# Check subcategories  
mcp_directus_items read subcategories --filter category_id=e5df043e-8777-4aba-9086-8725dbbda592
# Should show subcategory ID 2

# Check prompts
mcp_directus_items read prompts --filter subcategory_id=2
# Should show prompts 4, 7-16
```

