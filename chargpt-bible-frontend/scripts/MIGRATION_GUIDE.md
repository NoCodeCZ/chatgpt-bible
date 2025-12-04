# Prompt Migration Script Guide

## Overview

The migration script (`migrate-prompts.js`) is designed to import existing prompt library data into Directus. It's part of **Story 2.1: Design Migration Script for Prompts**.

## Features

- ✅ **Dry-run mode** - Preview what would be migrated without making changes
- ✅ **Bulk import** - Processes prompts in batches for efficiency
- ✅ **Idempotent** - Safe to re-run (skips existing prompts)
- ✅ **Error handling** - Comprehensive validation and retry logic
- ✅ **Progress tracking** - Detailed logging and summary reports
- ✅ **Fast** - Complete migration in <5 minutes for full library

## Prerequisites

1. **Directus instance** - Must be accessible and configured
2. **Environment variables** - Set `NEXT_PUBLIC_DIRECTUS_URL` in `.env.local`
3. **Source data** - JSON files in `data/` directory (or custom path)
4. **Database backup** - Recommended before running migration

## Usage

### Basic Commands

```bash
# Dry-run (preview only, no changes)
npm run migrate:dry-run

# Actual migration
npm run migrate

# Or use node directly
node scripts/migrate-prompts.js --dry-run
node scripts/migrate-prompts.js
```

### Custom Source Path

```bash
# Migrate from specific directory
node scripts/migrate-prompts.js ./data/custom-prompts

# Dry-run with custom path
node scripts/migrate-prompts.js --dry-run ./data/custom-prompts

# Migrate specific file
node scripts/migrate-prompts.js ./data/batch-1-ready.json
```

## Source Data Format

The script expects JSON files with prompt arrays. Each prompt should have:

```json
{
  "title_th": "Thai title",
  "title_en": "English title",
  "description": "Prompt description",
  "prompt_text": "Full prompt text",
  "difficulty_level": "beginner|intermediate|advanced",
  "status": "draft|published|archived",
  "subcategory_id": 1,
  "prompt_type_id": "uuid-here"
}
```

### Required Fields
- `title_th` or `title_en` (at least one)
- `description`
- `prompt_text`
- `difficulty_level` (beginner/intermediate/advanced)
- `status` (draft/published/archived)

### Optional Fields
- `subcategory_id`
- `prompt_type_id`

## Migration Workflow

### Step 1: Dry-Run (Always Do This First!)

```bash
npm run migrate:dry-run
```

This will:
- Load all source files
- Validate all prompts
- Check for duplicates
- Show summary report
- **No prompts are created**

### Step 2: Review Results

Check the dry-run output:
- ✅ Valid prompts count
- ❌ Invalid prompts (fix source data if needed)
- ⏭️  Already existing prompts (will be skipped)

### Step 3: Create Database Backup

**IMPORTANT:** Before running actual migration:

```bash
# Backup your Directus database
# (Use your database tool or Directus admin interface)
```

### Step 4: Run Migration

```bash
npm run migrate
```

The script will:
- Process prompts in batches of 50
- Create prompts in Directus
- Skip duplicates automatically
- Retry failed items (up to 3 attempts)
- Show progress in real-time

### Step 5: Validate Migration

After migration completes, run the validation script:

```bash
npm run validate
```

Or manually:
```bash
node scripts/validate-migration.js
```

This will:
1. ✅ **Compare counts** - Verify total prompts match source
2. ✅ **Show statistics** - Published, draft, archived, difficulty levels
3. ✅ **Random sample** - Display 10 random prompts for manual inspection
4. ✅ **Structure validation** - Check all prompts have required fields
5. ✅ **Generate report** - Save validation report to `data/validation-report.json`

**Manual validation checklist:**
- [ ] Count matches source data
- [ ] Published prompts exist (status=published)
- [ ] Manually inspect 10 random prompts for accuracy
- [ ] Test search functionality in frontend
- [ ] Verify prompts appear correctly in `/prompts` page
- [ ] Check relationships (categories/job_roles) if applicable

## Output Examples

### Dry-Run Output

```
📝 [2025-11-10T10:00:00.000Z] 🚀 Starting prompt migration...
🔍 [2025-11-10T10:00:00.100Z] Mode: DRY-RUN (preview only)
📝 [2025-11-10T10:00:00.200Z] Source: ./data
📂 [2025-11-10T10:00:00.300Z] Loading source data...
📝 [2025-11-10T10:00:01.000Z] Found 18 source file(s)
📝 [2025-11-10T10:00:02.000Z] Loaded 50 prompts from batch-1-ready.json
...
📊 [2025-11-10T10:00:10.000Z] Total prompts loaded: 900
🔍 [2025-11-10T10:00:11.000Z] Validating prompts...
✅ [2025-11-10T10:00:12.000Z] Valid prompts: 900
📦 [2025-11-10T10:00:13.000Z] Processing 900 prompts in batches of 50...
🔍 [2025-11-10T10:00:14.000Z] [DRY-RUN] Would create: Prompt Title 1
...

═══════════════════════════════════════
📊 Migration Summary
═══════════════════════════════════════
✅ Success: 900
⏭️  Skipped: 0
❌ Failed: 0
⏱️  Duration: 45.23s

🔍 This was a DRY-RUN. No prompts were actually created.
```

### Live Migration Output

```
📝 [2025-11-10T10:00:00.000Z] 🚀 Starting prompt migration...
📝 [2025-11-10T10:00:00.100Z] Mode: LIVE (will create prompts)
📂 [2025-11-10T10:00:00.200Z] Loading source data...
...
✅ [2025-11-10T10:01:00.000Z] Created prompt: Prompt Title 1 (ID: 123)
✅ [2025-11-10T10:01:00.500Z] Created prompt: Prompt Title 2 (ID: 124)
...

═══════════════════════════════════════
📊 Migration Summary
═══════════════════════════════════════
✅ Success: 900
⏭️  Skipped: 0
❌ Failed: 0
⏱️  Duration: 120.45s
```

## Error Handling

### Common Errors

**Missing environment variable:**
```
❌ Error: NEXT_PUBLIC_DIRECTUS_URL environment variable is required
```
**Solution:** Set `NEXT_PUBLIC_DIRECTUS_URL` in `.env.local`

**No source files found:**
```
❌ No JSON files found in ./data
```
**Solution:** Check that source files exist in the specified directory

**Invalid prompt data:**
```
❌ Invalid prompts: 5
  Error: Missing description
```
**Solution:** Fix source data format before running migration

### Retry Logic

The script automatically retries failed operations:
- **3 attempts** per prompt
- **Exponential backoff** between retries
- **Detailed error logging** for debugging

## Performance

- **Batch size:** 50 prompts per API call
- **Rate limiting:** 500ms delay between batches
- **Expected speed:** ~900 prompts in 2-3 minutes
- **Memory usage:** Processes in batches (low memory footprint)

## Safety Features

1. **Idempotent** - Can safely re-run without duplicating data
2. **Duplicate detection** - Checks existing prompts by title
3. **Validation** - Validates all prompts before migration
4. **Dry-run mode** - Test before actual migration
5. **Error isolation** - One failed prompt doesn't stop entire migration

## Troubleshooting

### Migration is slow

- Check Directus server performance
- Verify network connection
- Consider reducing batch size (edit `BATCH_SIZE` constant)

### Many prompts skipped

- This is normal if prompts already exist
- Check if you're re-running migration
- Verify prompt titles match source data

### Errors during migration

1. Check error messages in output
2. Fix source data issues
3. Verify Directus permissions
4. Check Directus logs for API errors

### Prompts not appearing in frontend

1. Verify `status` is set to `published`
2. Check Directus permissions
3. Verify frontend is querying correct collection
4. Clear browser cache

## Next Steps

After successful migration:

1. ✅ **Story 2.1 Complete** - Migration script created and tested
2. ➡️ **Story 2.2** - Execute migration and validate library
3. ➡️ **Story 2.3-2.8** - Frontend features (filtering, search, caching)

## Related Documentation

- [Epic 2 Architecture](../app-planning/docs/shards/epic-2-content-discovery.md)
- [Upload Scripts README](./README.md)
- [Directus API Testing](../../docs/directus-api-testing.md)

