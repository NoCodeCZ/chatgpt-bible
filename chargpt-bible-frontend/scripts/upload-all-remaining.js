/**
 * Upload All Remaining Prompts
 * This script will upload all remaining prompts in batches
 */

const fs = require('fs');
const path = require('path');

// Load batches
const batches = require('../data/prompt-batches.json');

// Prepare all batches (remove category_number and subcategory_number)
const allBatches = batches.map(batch => 
  batch.map(p => {
    const {category_number, subcategory_number, ...rest} = p;
    return rest;
  })
);

console.log(`\n📊 Total batches: ${allBatches.length}`);
console.log(`📦 Batch sizes: ${allBatches.map(b => b.length).join(', ')}`);
console.log(`📝 Total prompts: ${allBatches.reduce((sum, b) => sum + b.length, 0)}\n`);

// Save each batch to a separate file for easy upload
allBatches.forEach((batch, index) => {
  const batchNum = index + 1;
  const outputPath = path.join(__dirname, `../data/batch-${batchNum}-ready.json`);
  fs.writeFileSync(outputPath, JSON.stringify(batch, null, 2));
  console.log(`✅ Batch ${batchNum}: ${batch.length} prompts → batch-${batchNum}-ready.json`);
});

console.log(`\n💡 To upload, use MCP Directus tool with data from batch-X-ready.json files\n`);

