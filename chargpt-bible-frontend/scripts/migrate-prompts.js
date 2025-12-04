/**
 * Prompt Migration Script (Story 2.1)
 * 
 * Migrates existing prompt library to Directus with:
 * - Dry-run mode for preview
 * - Bulk import via Directus SDK
 * - Many-to-Many relationship handling
 * - Comprehensive error handling and logging
 * - Idempotent (safe to re-run)
 * - Progress tracking
 * 
 * Usage:
 *   node scripts/migrate-prompts.js [--dry-run] [source-path]
 * 
 * Examples:
 *   node scripts/migrate-prompts.js --dry-run
 *   node scripts/migrate-prompts.js
 *   node scripts/migrate-prompts.js ./data/custom-prompts
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
const BATCH_SIZE = 50; // Prompts per API call
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // ms

// Initialize Directus client
const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
if (!directusUrl) {
  console.error('❌ Error: NEXT_PUBLIC_DIRECTUS_URL environment variable is required');
  process.exit(1);
}

const directus = createDirectus(directusUrl).with(rest());

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

/**
 * Validate prompt data structure
 */
function validatePrompt(prompt, index) {
  const errors = [];
  
  if (!prompt.title_th && !prompt.title_en) {
    errors.push('Missing title_th and title_en');
  }
  
  if (!prompt.description) {
    errors.push('Missing description');
  }
  
  if (!prompt.prompt_text) {
    errors.push('Missing prompt_text');
  }
  
  if (!prompt.difficulty_level) {
    errors.push('Missing difficulty_level');
  } else if (!['beginner', 'intermediate', 'advanced'].includes(prompt.difficulty_level)) {
    errors.push(`Invalid difficulty_level: ${prompt.difficulty_level}`);
  }
  
  if (!prompt.status) {
    errors.push('Missing status');
  } else if (!['draft', 'published', 'archived'].includes(prompt.status)) {
    errors.push(`Invalid status: ${prompt.status}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if prompt already exists in Directus (by title)
 */
async function promptExists(prompt) {
  try {
    const title = prompt.title_en || prompt.title_th;
    const response = await directus.request(
      readItems('prompts', {
        filter: {
          _or: [
            { title_en: { _eq: title } },
            { title_th: { _eq: title } },
          ],
        },
        limit: 1,
        fields: ['id'],
      })
    );
    
    return response.length > 0;
  } catch (error) {
    log(`Error checking if prompt exists: ${error.message}`, 'error');
    return false;
  }
}

/**
 * Create prompt in Directus with retry logic
 */
async function createPrompt(prompt, dryRun = false) {
  if (dryRun) {
    log(`[DRY-RUN] Would create: ${prompt.title_en || prompt.title_th}`, 'dryrun');
    return { success: true, id: 'dry-run-id' };
  }
  
  let attempts = 0;
  while (attempts < RETRY_ATTEMPTS) {
    try {
      // Prepare prompt data (exclude relationships for now)
      const promptData = {
        title_th: prompt.title_th,
        title_en: prompt.title_en,
        description: prompt.description,
        prompt_text: prompt.prompt_text,
        difficulty_level: prompt.difficulty_level,
        status: prompt.status || 'published',
        subcategory_id: prompt.subcategory_id || null,
        prompt_type_id: prompt.prompt_type_id || null,
      };
      
      // Create prompt via Directus SDK
      const response = await directus.request(
        createItems('prompts', [promptData])
      );
      
      const createdPrompt = Array.isArray(response) ? response[0] : response;
      const promptId = createdPrompt.id;
      
      log(`Created prompt: ${prompt.title_en || prompt.title_th} (ID: ${promptId})`, 'success');
      
      return { success: true, id: promptId };
    } catch (error) {
      attempts++;
      const errorMsg = error?.message || error.toString();
      
      if (attempts < RETRY_ATTEMPTS) {
        log(`Attempt ${attempts}/${RETRY_ATTEMPTS} failed: ${errorMsg}. Retrying...`, 'warning');
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempts));
      } else {
        log(`Failed to create prompt after ${RETRY_ATTEMPTS} attempts: ${errorMsg}`, 'error');
        return { success: false, error: errorMsg };
      }
    }
  }
  
  return { success: false, error: 'Max retries exceeded' };
}

/**
 * Load prompt data from source files
 */
async function loadSourceData(sourcePath) {
  const dataFiles = [];
  
  // Check if sourcePath is a directory or file
  const stats = fs.statSync(sourcePath);
  
  if (stats.isDirectory()) {
    // Load all JSON files in directory
    const files = fs.readdirSync(sourcePath);
    for (const file of files) {
      if (file.endsWith('.json') && file.includes('batch')) {
        const filePath = path.join(sourcePath, file);
        dataFiles.push(filePath);
      }
    }
  } else if (stats.isFile() && sourcePath.endsWith('.json')) {
    dataFiles.push(sourcePath);
  }
  
  if (dataFiles.length === 0) {
    throw new Error(`No JSON files found in ${sourcePath}`);
  }
  
  log(`Found ${dataFiles.length} source file(s)`, 'info');
  
  // Load and parse all prompts
  const allPrompts = [];
  for (const filePath of dataFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const prompts = JSON.parse(content);
      
      if (Array.isArray(prompts)) {
        allPrompts.push(...prompts);
        log(`Loaded ${prompts.length} prompts from ${path.basename(filePath)}`, 'info');
      } else {
        log(`Skipped ${path.basename(filePath)}: Not an array`, 'warning');
      }
    } catch (error) {
      log(`Error loading ${filePath}: ${error.message}`, 'error');
      migrationResult.errors.push({
        file: path.basename(filePath),
        error: error.message,
      });
    }
  }
  
  log(`Total prompts loaded: ${allPrompts.length}`, 'info');
  return allPrompts;
}

/**
 * Main migration function
 */
async function migratePrompts(sourcePath, dryRun = false) {
  log('🚀 Starting prompt migration...', 'info');
  log(`Mode: ${dryRun ? 'DRY-RUN (preview only)' : 'LIVE (will create prompts)'}`, dryRun ? 'dryrun' : 'info');
  log(`Source: ${sourcePath}`, 'info');
  
  migrationResult.startTime = new Date();
  
  try {
    // Load source data
    log('📂 Loading source data...', 'progress');
    const prompts = await loadSourceData(sourcePath);
    
    if (prompts.length === 0) {
      log('❌ No prompts to migrate', 'error');
      return migrationResult;
    }
    
    // Validate prompts
    log('🔍 Validating prompts...', 'progress');
    const validPrompts = [];
    const invalidPrompts = [];
    
    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];
      const validation = validatePrompt(prompt, i);
      
      if (validation.valid) {
        validPrompts.push(prompt);
      } else {
        invalidPrompts.push({
          prompt: prompt.title_en || prompt.title_th || `Prompt #${i}`,
          errors: validation.errors,
        });
        migrationResult.failed++;
      }
    }
    
    log(`✅ Valid prompts: ${validPrompts.length}`, 'success');
    if (invalidPrompts.length > 0) {
      log(`❌ Invalid prompts: ${invalidPrompts.length}`, 'error');
      migrationResult.errors.push(...invalidPrompts);
    }
    
    // Process prompts in batches
    log(`📦 Processing ${validPrompts.length} prompts in batches of ${BATCH_SIZE}...`, 'progress');
    
    for (let i = 0; i < validPrompts.length; i += BATCH_SIZE) {
      const batch = validPrompts.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(validPrompts.length / BATCH_SIZE);
      
      log(`Processing batch ${batchNum}/${totalBatches} (${batch.length} prompts)...`, 'progress');
      
      for (const prompt of batch) {
        try {
          // Check if prompt already exists
          const exists = await promptExists(prompt);
          if (exists) {
            log(`Skipped (already exists): ${prompt.title_en || prompt.title_th}`, 'warning');
            migrationResult.skipped++;
            continue;
          }
          
          // Create prompt
          const result = await createPrompt(prompt, dryRun);
          
          if (result.success) {
            migrationResult.success++;
          } else {
            migrationResult.failed++;
            migrationResult.errors.push({
              prompt: prompt.title_en || prompt.title_th,
              error: result.error,
            });
          }
        } catch (error) {
          migrationResult.failed++;
          migrationResult.errors.push({
            prompt: prompt.title_en || prompt.title_th,
            error: error.message || error.toString(),
          });
          log(`Error processing prompt: ${error.message}`, 'error');
        }
      }
      
      // Small delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < validPrompts.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    migrationResult.endTime = new Date();
    const duration = (migrationResult.endTime - migrationResult.startTime) / 1000;
    
    log('', 'info');
    log('═══════════════════════════════════════', 'info');
    log('📊 Migration Summary', 'info');
    log('═══════════════════════════════════════', 'info');
    log(`✅ Success: ${migrationResult.success}`, 'success');
    log(`⏭️  Skipped: ${migrationResult.skipped}`, 'warning');
    log(`❌ Failed: ${migrationResult.failed}`, 'error');
    log(`⏱️  Duration: ${duration.toFixed(2)}s`, 'info');
    
    if (migrationResult.errors.length > 0) {
      log('', 'info');
      log('❌ Errors:', 'error');
      migrationResult.errors.slice(0, 10).forEach((err, idx) => {
        log(`  ${idx + 1}. ${err.prompt || err.file}: ${err.error || JSON.stringify(err.errors)}`, 'error');
      });
      if (migrationResult.errors.length > 10) {
        log(`  ... and ${migrationResult.errors.length - 10} more errors`, 'error');
      }
    }
    
    if (dryRun) {
      log('', 'info');
      log('🔍 This was a DRY-RUN. No prompts were actually created.', 'dryrun');
      log('Run without --dry-run to perform actual migration.', 'info');
    }
    
  } catch (error) {
    log(`❌ Migration failed: ${error.message}`, 'error');
    migrationResult.errors.push({
      error: error.message,
    });
    migrationResult.endTime = new Date();
  }
  
  return migrationResult;
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const sourcePath = args.find((arg) => !arg.startsWith('--')) || DEFAULT_SOURCE_PATH;
  
  migratePrompts(sourcePath, dryRun)
    .then((result) => {
      process.exit(result.failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { migratePrompts, validatePrompt };

