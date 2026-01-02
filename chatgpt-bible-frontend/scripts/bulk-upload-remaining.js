/**
 * Bulk Upload Thai Prompts with Deduplication
 * Loads prompts from batch files and skips duplicates already in the database
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

// Directus SDK
const { createDirectus, rest, staticToken, createItem, readItems } = require('@directus/sdk');

// Create Directus client with the new SDK pattern
const directus = process.env.DIRECTUS_TOKEN
  ? createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL)
      .with(staticToken(process.env.DIRECTUS_TOKEN))
      .with(rest())
  : createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL)
      .with(rest());

/**
 * Normalize prompt text for comparison
 * Handles escaped brackets and extra whitespace
 */
function normalizePromptText(text) {
  if (!text) return '';
  return text
    .replace(/\\\[/g, '[')
    .replace(/\\\]/g, ']')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculate a simple hash for comparison
 */
function simpleHash(str) {
  let hash = 0;
  const normalized = normalizePromptText(str);
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * Load all batch files
 */
function loadBatchFiles() {
  const batchesDir = path.join(__dirname, '..');
  const allPrompts = [];

  console.log('📂 Loading batch files...\n');

  for (let i = 1; i <= 15; i++) {
    const filePath = path.join(batchesDir, `batch-${i}.json`);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      allPrompts.push(...data);
      console.log(`  ✓ Loaded batch-${i}.json: ${data.length} prompts`);
    } catch (error) {
      console.log(`  ⚠️  Could not load batch-${i}.json: ${error.message}`);
    }
  }

  return allPrompts;
}

/**
 * Fetch all existing prompts from Directus
 * Returns a Set of normalized prompt text hashes
 */
async function fetchExistingPromptHashes() {
  console.log('\n📋 Fetching existing prompts from Directus...');

  const hashes = new Set();
  let offset = 0;
  const limit = 100;
  let hasMore = true;
  let totalFetched = 0;

  while (hasMore) {
    try {
      const prompts = await directus.request(
        readItems('prompts', {
          fields: ['id', 'prompt_text'],
          limit: limit,
          offset: offset,
        })
      );

      if (prompts.length === 0) {
        hasMore = false;
      } else {
        for (const prompt of prompts) {
          if (prompt.prompt_text) {
            hashes.add(simpleHash(prompt.prompt_text));
          }
        }
        totalFetched += prompts.length;
        offset += limit;
        console.log(`  Fetched ${totalFetched} prompts...`);
      }
    } catch (error) {
      console.error(`Error fetching prompts (offset ${offset}):`, error.message);
      hasMore = false;
    }
  }

  console.log(`✓ Found ${hashes.size} existing prompts in database\n`);
  return hashes;
}

// Track progress
let uploaded = 0;
let failed = 0;
let skipped = 0;
const errors = [];

// Upload a single prompt
async function uploadPrompt(prompt, index, total) {
  try {
    const payload = {
      title_th: prompt.title_th.substring(0, 255),
      title_en: prompt.title_en.substring(0, 255),
      short_title_th: prompt.short_title_th.substring(0, 100),
      short_title_en: prompt.short_title_en.substring(0, 100),
      description: prompt.description.substring(0, 255),
      prompt_text: prompt.prompt_text,
      difficulty_level: prompt.difficulty_level,
      status: prompt.status,
      subcategory_id: prompt.subcategory_id,
      prompt_type_id: prompt.prompt_type_id,
    };

    const result = await directus.request(createItem('prompts', payload));
    uploaded++;
    console.log(`  [${index + 1}/${total}] ✓ Created: ${result.id}`);
    return { success: true, id: result.id };
  } catch (error) {
    failed++;
    const errorMsg = error.message || String(error);
    errors.push({ index, prompt: prompt.short_title_en, error: errorMsg });
    console.log(`  [${index + 1}/${total}] ✗ Failed: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}

// Main function with deduplication
async function uploadWithDeduplication() {
  console.log('========================================');
  console.log('  Bulk Upload with Deduplication');
  console.log('========================================');

  // Step 1: Load batch files
  const allBatchPrompts = loadBatchFiles();
  console.log(`✓ Total prompts in batch files: ${allBatchPrompts.length}\n`);

  // Step 2: Fetch existing prompts
  const existingHashes = await fetchExistingPromptHashes();

  // Step 3: Filter out duplicates
  console.log('🔍 Checking for duplicates...\n');
  const newPrompts = [];

  for (const prompt of allBatchPrompts) {
    const hash = simpleHash(prompt.prompt_text);

    if (existingHashes.has(hash)) {
      skipped++;
    } else {
      newPrompts.push(prompt);
      existingHashes.add(hash); // Avoid duplicates within batch too
    }
  }

  console.log(`📊 Deduplication Results:`);
  console.log(`  Total in batch files: ${allBatchPrompts.length}`);
  console.log(`  Duplicates (skipped): ${skipped}`);
  console.log(`  New to upload: ${newPrompts.length}\n`);

  if (newPrompts.length === 0) {
    console.log('✅ All prompts are already in the database. Nothing to upload.');
    return;
  }

  console.log(`📤 Starting upload of ${newPrompts.length} prompts...\n`);

  // Step 4: Upload new prompts
  const batchSize = 5;
  const delay = 300; // ms between batches

  for (let i = 0; i < newPrompts.length; i += batchSize) {
    const batch = newPrompts.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(newPrompts.length / batchSize);

    console.log(`📦 Batch ${batchNum}/${totalBatches} (${batch.length} prompts)`);

    // Process batch in parallel
    await Promise.all(
      batch.map((prompt, idx) => uploadPrompt(prompt, i + idx, newPrompts.length))
    );

    // Delay between batches (except last)
    if (i + batchSize < newPrompts.length) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📈 Upload Summary:');
  console.log(`  ✓ Uploaded: ${uploaded}`);
  console.log(`  ✗ Failed: ${failed}`);
  console.log(`  ⊘ Skipped (duplicates): ${skipped}`);
  console.log(`  Total processed: ${allBatchPrompts.length}`);

  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach((e) => {
      console.log(`  [${e.index + 1}] ${e.prompt}: ${e.error}`);
    });

    // Save errors to file for retry
    const errorFile = path.join(__dirname, '../upload-errors.json');
    fs.writeFileSync(errorFile, JSON.stringify(errors, null, 2));
    console.log(`\n📄 Errors saved to: ${errorFile}`);
  }
}

// Run upload
uploadWithDeduplication().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
