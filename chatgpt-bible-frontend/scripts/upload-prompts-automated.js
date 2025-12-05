/**
 * Automated Prompt Upload Script
 * 
 * This script uploads prompts to Directus in batches with:
 * - Error handling and retry logic
 * - Progress tracking and resume capability
 * - Detailed logging
 * - Safe to run multiple times (skips existing)
 * 
 * Usage:
 *   node scripts/upload-prompts-automated.js [batch-start] [batch-end]
 * 
 * Examples:
 *   node scripts/upload-prompts-automated.js           # Upload all batches
 *   node scripts/upload-prompts-automated.js 1 5       # Upload batches 1-5
 *   node scripts/upload-prompts-automated.js 2         # Upload from batch 2 onwards
 */

// Load environment variables
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not installed, use process.env directly
}

const { createDirectus, rest, readItems } = require('@directus/sdk');
const fs = require('fs');
const path = require('path');

// Configuration
const BATCH_SIZE = 50; // Prompts per API call
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // ms

// Initialize Directus client
const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL).with(rest());

// Progress tracking
const PROGRESS_FILE = path.join(__dirname, '../data/upload-progress.json');

function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  }
  return { uploaded: [], failed: [], lastBatch: 0 };
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '📝',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    progress: '📊'
  }[type] || '📝';
  
  console.log(`${prefix} [${timestamp}] ${message}`);
}

async function uploadBatch(prompts, batchNum) {
  log(`Uploading batch ${batchNum} (${prompts.length} prompts)...`, 'progress');
  
  let attempts = 0;
  while (attempts < RETRY_ATTEMPTS) {
    try {
      // Use REST API directly for batch creation
      const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/prompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prompts)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.errors?.[0]?.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const results = await response.json();
      const data = results.data || results; // Handle different response formats
      const uploadedIds = Array.isArray(data) 
        ? data.map(r => r.id)
        : [data.id];
      
      log(`✅ Batch ${batchNum}: Uploaded ${uploadedIds.length} prompts (IDs: ${uploadedIds.join(', ')})`, 'success');
      return { success: true, ids: uploadedIds };
    } catch (error) {
      attempts++;
      const errorMsg = error?.message || error.toString();
      
      if (attempts < RETRY_ATTEMPTS) {
        log(`⚠️ Batch ${batchNum} failed (attempt ${attempts}/${RETRY_ATTEMPTS}): ${errorMsg}. Retrying...`, 'warning');
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempts));
      } else {
        log(`❌ Batch ${batchNum} failed after ${RETRY_ATTEMPTS} attempts: ${errorMsg}`, 'error');
        return { success: false, error: errorMsg, prompts };
      }
    }
  }
}

async function checkExistingPrompts(promptTexts) {
  // Check if prompts already exist by comparing prompt_text
  // This allows safe re-runs
  try {
    const existing = await directus.request(
      readItems('prompts', {
        filter: {
          prompt_text: { _in: promptTexts }
        },
        fields: ['id', 'prompt_text'],
        limit: 1000
      })
    );
    
    return new Set(existing.map(p => p.prompt_text));
  } catch (error) {
    log(`⚠️ Could not check existing prompts: ${error.message}`, 'warning');
    return new Set();
  }
}

async function main() {
  const args = process.argv.slice(2);
  const startBatch = args[0] ? parseInt(args[0]) : 1;
  const endBatch = args[1] ? parseInt(args[1]) : null;
  
  log('🚀 Starting automated prompt upload...', 'info');
  log(`📦 Batches: ${startBatch}${endBatch ? `-${endBatch}` : ' onwards'}`, 'info');
  
  // Load batches
  const batches = require('../data/prompt-batches.json');
  const allBatches = batches.map(batch => 
    batch.map(p => {
      const {category_number, subcategory_number, ...rest} = p;
      return rest;
    })
  );
  
  // Load progress
  const progress = loadProgress();
  const uploadedTexts = new Set(progress.uploaded.map(u => u.prompt_text));
  
  log(`📊 Total batches: ${allBatches.length}`, 'info');
  log(`📊 Already uploaded: ${progress.uploaded.length} prompts`, 'info');
  log(`📊 Previously failed: ${progress.failed.length} prompts`, 'info');
  
  // Determine batches to process
  const batchesToProcess = allBatches.slice(startBatch - 1, endBatch || allBatches.length);
  let totalUploaded = 0;
  let totalFailed = 0;
  
  for (let i = 0; i < batchesToProcess.length; i++) {
    const batchNum = startBatch + i;
    const batch = batchesToProcess[i];
    
    // Filter out already uploaded prompts
    const newPrompts = batch.filter(p => !uploadedTexts.has(p.prompt_text));
    
    if (newPrompts.length === 0) {
      log(`⏭️ Batch ${batchNum}: All prompts already uploaded, skipping...`, 'info');
      continue;
    }
    
    log(`📦 Batch ${batchNum}: ${newPrompts.length} new prompts (${batch.length - newPrompts.length} already uploaded)`, 'progress');
    
    // Upload in chunks of BATCH_SIZE
    for (let j = 0; j < newPrompts.length; j += BATCH_SIZE) {
      const chunk = newPrompts.slice(j, j + BATCH_SIZE);
      const chunkNum = Math.floor(j / BATCH_SIZE) + 1;
      const totalChunks = Math.ceil(newPrompts.length / BATCH_SIZE);
      
      log(`📤 Batch ${batchNum}, Chunk ${chunkNum}/${totalChunks} (${chunk.length} prompts)...`, 'progress');
      
      const result = await uploadBatch(chunk, `${batchNum}.${chunkNum}`);
      
      if (result.success) {
        // Update progress
        chunk.forEach(p => {
          progress.uploaded.push({
            id: result.ids[chunk.indexOf(p)],
            prompt_text: p.prompt_text,
            title_th: p.title_th,
            batch: batchNum,
            uploaded_at: new Date().toISOString()
          });
          uploadedTexts.add(p.prompt_text);
        });
        totalUploaded += chunk.length;
      } else {
        // Track failed prompts
        chunk.forEach(p => {
          progress.failed.push({
            prompt_text: p.prompt_text,
            title_th: p.title_th,
            batch: batchNum,
            error: result.error,
            failed_at: new Date().toISOString()
          });
        });
        totalFailed += chunk.length;
      }
      
      // Save progress after each chunk
      progress.lastBatch = batchNum;
      saveProgress(progress);
      
      // Small delay between chunks to avoid rate limiting
      if (j + BATCH_SIZE < newPrompts.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }
  
  // Final summary
  log('\n📊 Upload Summary:', 'info');
  log(`✅ Successfully uploaded: ${totalUploaded} prompts`, 'success');
  log(`❌ Failed: ${totalFailed} prompts`, totalFailed > 0 ? 'error' : 'info');
  log(`📝 Total in database: ${progress.uploaded.length} prompts`, 'info');
  
  if (totalFailed > 0) {
    log(`\n⚠️ Some prompts failed. Check upload-progress.json for details.`, 'warning');
    log(`💡 You can re-run this script to retry failed uploads.`, 'info');
  }
  
  log('\n✅ Upload process completed!', 'success');
}

// Run the script
main().catch(error => {
  log(`❌ Fatal error: ${error.message}`, 'error');
  console.error(error);
  process.exit(1);
});

