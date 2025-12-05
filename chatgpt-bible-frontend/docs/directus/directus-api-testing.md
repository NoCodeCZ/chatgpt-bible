# Directus API Testing with MCP

## Setup
- MCP server connected to Directus instance
- MCP connection URL: https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io
- Configuration located in `.mcp.json` at project root

## Test Scenarios

### 1. Fetch Published Prompts
**MCP Command:** Query items from "prompts" collection with filter
**Filter:** `status: { _eq: 'published' }`
**Expected:** Array of prompt objects with all fields populated

**Test Result:** ✅ Passed
- Retrieved 3 published prompts
- Fields returned: id, title_th, title_en, description, difficulty_level, status

### 2. Schema Inspection
**MCP Command:** Read collections schema
**Expected:** Complete schema definition for all collections

**Test Result:** ✅ Passed
- Prompts collection schema confirmed
- Categories collection schema confirmed
- Job roles collection schema confirmed
- Junction tables (prompt_categories, prompt_job_roles) confirmed

### 3. Validate TypeScript Types
**Process:** Compare MCP response structure against types/Prompt.ts
**Expected:** All fields match type definitions exactly

**Test Result:** ✅ Passed
- Prompt type matches Directus schema
- Category type matches Directus schema
- JobRole type matches Directus schema
- Added bilingual fields (title_th, title_en) to match actual schema
- Added new fields (prompt_type_id, subcategory_id) discovered during inspection

## Validation Results
- ✅ Schema inspection completed
- ✅ Filter syntax validated
- ✅ Relationship queries tested (junction tables structure confirmed)
- ✅ TypeScript types confirmed accurate and updated to match live schema

## Notes
- Directus instance includes bilingual support (Thai and English)
- Schema has evolved to include prompt types and subcategories
- All type definitions updated to reflect actual production schema
