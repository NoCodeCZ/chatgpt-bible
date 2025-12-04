# Directus Migration Scripts Reference

**Purpose:** Create Node.js scripts in `scripts/` for migrating data to Directus, seeding collections, and bulk operations. Scripts run outside Next.js app.

## Overall Pattern

```
Script Entry → Load Env → Initialize Directus → Validate Data → Process in Batches → Log Results
```

## Step 1: Setup Script Structure

```javascript
// scripts/migrate-my-data.js
/**
 * Migration Script for My Data
 * 
 * Migrates data to Directus with:
 * - Dry-run mode for preview
 * - Bulk import via Directus SDK
 * - Comprehensive error handling
 * - Progress tracking
 * 
 * Usage: node scripts/migrate-my-data.js [--dry-run] [source-path]
 */

// Load environment variables
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not installed, use process.env directly
}

const { createDirectus, rest, createItems, readItems } = require('@directus/sdk');
const fs = require('fs');
const path = require('path');

// Configuration
const DEFAULT_SOURCE_PATH = path.join(__dirname, '../data');
const BATCH_SIZE = 50;
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

// Initialize Directus client
const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
if (!directusUrl) {
  console.error('❌ Error: NEXT_PUBLIC_DIRECTUS_URL environment variable is required');
  process.exit(1);
}

const directus = createDirectus(directusUrl).with(rest());
```

**Rules:** Use CommonJS (`require`), load `.env.local` with try/catch, validate required env vars, exit on missing config, define constants at top.

## Step 2: Create Logging Utility

```javascript
// Migration result tracking
let migrationResult = {
  success: 0,
  failed: 0,
  skipped: 0,
  errors: [],
  startTime: new Date(),
  endTime: null,
};

/**
 * Logging utility with timestamps and icons
 */
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '📝',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    progress: '📊',
    dryrun: '🔍',
  }[type] || '📝';
  
  console.log(`${prefix} [${timestamp}] ${message}`);
}
```

**Rules:** Track results in object, use emoji prefixes for readability, include timestamps, support multiple log levels.

## Step 3: Validate Data

```javascript
/**
 * Validate data structure
 */
function validateItem(item, index) {
  const errors = [];
  
  if (!item.title) {
    errors.push('Missing title');
  }
  
  if (!item.status) {
    errors.push('Missing status');
  } else if (!['draft', 'published', 'archived'].includes(item.status)) {
    errors.push(`Invalid status: ${item.status}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
```

**Rules:** Validate required fields, check enum values, return validation result object, include index for error reporting.

## Step 4: Implement Retry Logic

```javascript
/**
 * Create item in Directus with retry logic
 */
async function createItem(item, dryRun = false) {
  if (dryRun) {
    log(`[DRY-RUN] Would create: ${item.title}`, 'dryrun');
    return { success: true, id: 'dry-run-id' };
  }
  
  let attempts = 0;
  while (attempts < RETRY_ATTEMPTS) {
    try {
      const response = await directus.request(
        createItems('my_collection', [item])
      );
      
      const createdItem = Array.isArray(response) ? response[0] : response;
      log(`Created item: ${item.title} (ID: ${createdItem.id})`, 'success');
      
      return { success: true, id: createdItem.id };
    } catch (error) {
      attempts++;
      const errorMsg = error?.message || error.toString();
      
      if (attempts < RETRY_ATTEMPTS) {
        log(`Attempt ${attempts}/${RETRY_ATTEMPTS} failed: ${errorMsg}. Retrying...`, 'warning');
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempts));
      } else {
        log(`Failed after ${RETRY_ATTEMPTS} attempts: ${errorMsg}`, 'error');
        return { success: false, error: errorMsg };
      }
    }
  }
  
  return { success: false, error: 'Max retries exceeded' };
}
```

**Rules:** Support dry-run mode, implement exponential backoff, log retry attempts, return success/error object.

## Step 5: Process in Batches

```javascript
/**
 * Main migration function
 */
async function migrateData(sourcePath, dryRun = false) {
  log('🚀 Starting migration...', 'info');
  log(`Mode: ${dryRun ? 'DRY-RUN' : 'LIVE'}`, dryRun ? 'dryrun' : 'info');
  
  migrationResult.startTime = new Date();
  
  try {
    // Load source data
    const items = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    log(`Loaded ${items.length} items`, 'info');
    
    // Validate
    const validItems = [];
    for (let i = 0; i < items.length; i++) {
      const validation = validateItem(items[i], i);
      if (validation.valid) {
        validItems.push(items[i]);
      } else {
        migrationResult.failed++;
        migrationResult.errors.push({
          item: items[i].title || `Item #${i}`,
          errors: validation.errors,
        });
      }
    }
    
    // Process in batches
    for (let i = 0; i < validItems.length; i += BATCH_SIZE) {
      const batch = validItems.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      
      log(`Processing batch ${batchNum} (${batch.length} items)...`, 'progress');
      
      for (const item of batch) {
        const result = await createItem(item, dryRun);
        if (result.success) {
          migrationResult.success++;
        } else {
          migrationResult.failed++;
          migrationResult.errors.push({
            item: item.title,
            error: result.error,
          });
        }
      }
      
      // Delay between batches
      if (i + BATCH_SIZE < validItems.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Summary
    migrationResult.endTime = new Date();
    const duration = (migrationResult.endTime - migrationResult.startTime) / 1000;
    
    log(`✅ Success: ${migrationResult.success}`, 'success');
    log(`❌ Failed: ${migrationResult.failed}`, 'error');
    log(`⏱️  Duration: ${duration.toFixed(2)}s`, 'info');
    
  } catch (error) {
    log(`❌ Migration failed: ${error.message}`, 'error');
    process.exit(1);
  }
}
```

**Rules:** Load and validate data first, process in configurable batch sizes, add delays between batches, track progress, log summary at end.

## Step 6: Add CLI Interface

```javascript
// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const sourcePath = args.find((arg) => !arg.startsWith('--')) || DEFAULT_SOURCE_PATH;
  
  migrateData(sourcePath, dryRun)
    .then(() => {
      process.exit(migrationResult.failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { migrateData, validateItem };
```

**Rules:** Parse CLI arguments, support dry-run flag, exit with appropriate code, export functions for testing.

## Quick Checklist

- [ ] Created script in `scripts/` directory
- [ ] Added JSDoc header with usage instructions
- [ ] Loaded environment variables with dotenv
- [ ] Validated required env vars (exit on missing)
- [ ] Initialized Directus client
- [ ] Created logging utility with icons/timestamps
- [ ] Implemented data validation function
- [ ] Added retry logic with exponential backoff
- [ ] Implemented batch processing with delays
- [ ] Tracked migration results (success/failed/skipped)
- [ ] Supported dry-run mode
- [ ] Added CLI argument parsing
- [ ] Exported functions for testing
- [ ] Tested with --dry-run first
- [ ] Tested with real data
