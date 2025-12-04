/**
 * Direct Upload Script - Uploads prompts in batches to Directus
 * Run with: node scripts/upload-prompts-direct.js
 */

const batches = require('../data/prompt-batches.json');

// Prepare first batch (remove category_number and subcategory_number)
const batch1 = batches[0].map(p => {
  const {category_number, subcategory_number, ...rest} = p;
  return rest;
});

console.log(`\n📦 Batch 1: ${batch1.length} prompts ready for upload\n`);
console.log('Sample prompt structure:');
console.log(JSON.stringify(batch1[0], null, 2));
console.log('\n✅ Ready to upload! Copy the batch data above to MCP Directus tool.\n');

