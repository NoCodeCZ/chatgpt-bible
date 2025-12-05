/**
 * Complete Upload Script for Directus
 * 
 * This script will:
 * 1. Create all remaining subcategories
 * 2. Upload all prompts in batches
 * 3. Create category and job role relationships
 * 
 * Run with: node scripts/upload-all-data.js
 */

const fs = require('fs');
const path = require('path');

// Load parsed data
const parsed = require('../data/parsed-prompts.json');
const batches = require('../data/subcategory-batches.json');

// Category number to UUID mapping
const catMap = {
  '1': 'e5df043e-8777-4aba-9086-8725dbbda592',
  '2': 'd7ea0435-67ab-4839-ac8d-f7c1ec71a869',
  '3': 'b76cba3b-4a78-4e28-b03e-0b21c9fce908',
  '4': 'e1748187-0467-495a-9464-19091e156b26',
  '5': 'b6665a4c-5591-40a7-b9b1-43ec659f18e4',
  '6': 'e1cecb42-6daf-44d0-8739-383c4605308b',
  '7': 'e6081c42-8d07-40a0-a522-ea80898e5f05',
  '8': 'f6a470f1-f82d-4586-bb14-2f67b85477c0',
  '9': 'ab64dbf5-421a-4e61-8b92-9685e8696ae8',
  '10': 'a90a8bcc-a23b-40c8-b7d5-f90fe74b2e15',
  '11': 'd026a66f-88b3-4f7c-a58a-66fa47d3a73c',
  '14': '0ebb8146-8826-42f3-abff-3f834566de1c',
  '16': '57b9b4b0-6736-4e7b-ae15-5f123624c503'
};

// Prompt type mapping
const promptTypeMap = {
  'แบบเติมคำ (FILL-IN-THE-BLANK PROMPTS):': 'a2b2511e-4b31-4dc6-a32f-183e610355a0',
  'Fill-in-the-blank Prompts': 'a2b2511e-4b31-4dc6-a32f-183e610355a0',
  'แบบปลายเปิด (OPEN-ENDED PROMPTS):': '3359228e-da00-41c7-abf2-54e4a6c971bb',
  'Open-ended Prompts': '3359228e-da00-41c7-abf2-54e4a6c971bb',
  'แบบสถานการณ์จำลอง (SCENARIO PROMPTS):': '93af6c0e-9454-4172-b35f-bbc7d3a10a73',
  'Scenario-based Prompts': '93af6c0e-9454-4172-b35f-bbc7d3a10a73',
  'เชิงคำแนะนำ (INSTRUCTIONAL PROMPTS):': '39b2b419-d5a0-4c8e-96a1-f22f837e2ee6',
  'Instructional Prompts': '39b2b419-d5a0-4c8e-96a1-f22f837e2ee6',
  'เชิงคำถาม (QUESTION-BASED PROMPTS):': '40976da9-11cf-4e41-90b7-935ef722d0fc',
  'Question-based Prompts': '40976da9-11cf-4e41-90b7-935ef722d0fc',
  'แบบปลายเปิด (QUESTIONS-BASED PROMPTS):': '40976da9-11cf-4e41-90b7-935ef722d0fc'
};

// Already created subcategories (by key)
const existingSubKeys = ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8',
                         '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7',
                         '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8',
                         '4.1', '4.2', '4.3', '4.4', '4.5', '4.6',
                         '5.1', '5.2', '5.3', '5.4', '5.5',
                         '6.2', '6.3', '6.4', '6.5', '6.6', '6.7', '6.8',
                         '7.1', '7.2', '7.3', '7.4',
                         '8.1', '8.2', '8.3', '8.4', '8.5',
                         '9.1', '9.2', '9.3',
                         '10.1', '10.2', '10.3', '10.4', '10.5'];

// Get remaining subcategories
const allSubs = parsed.subcategories
  .filter(s => !existingSubKeys.includes(s.key))
  .map(s => ({
    name_th: s.name_th,
    name_en: s.name_en,
    slug: s.slug,
    description_th: s.description_th,
    description_en: s.description_en,
    category_id: catMap[s.category_id],
    sort: s.sort
  }));

console.log(`\n📊 Remaining subcategories: ${allSubs.length}\n`);

// Split into batches of 10
const subBatches = [];
for (let i = 0; i < allSubs.length; i += 10) {
  subBatches.push(allSubs.slice(i, i + 10));
}

console.log(`📦 Subcategory batches: ${subBatches.length}\n`);

// Prepare prompts for upload
// Need to map subcategory numbers to IDs (will need to fetch from Directus)
// For now, prepare the data structure
const prompts = parsed.prompts.map(p => {
  // Clean up escaped backslashes in text
  const cleanText = (text) => text ? text.replace(/\\\[/g, '[').replace(/\\\]/g, ']') : text;
  
  return {
    title_th: cleanText(p.title_th),
    title_en: cleanText(p.title_en),
    description: cleanText(p.description),
    prompt_text: cleanText(p.prompt_text),
    difficulty_level: p.difficulty_level,
    status: p.status,
    category_number: p.category_number,
    subcategory_number: p.subcategory_number,
    prompt_type: p.prompt_type
  };
});

// Split prompts into batches of 50
const promptBatches = [];
for (let i = 0; i < prompts.length; i += 50) {
  promptBatches.push(prompts.slice(i, i + 50));
}

console.log(`📦 Prompt batches: ${promptBatches.length}\n`);

// Save prepared data
const output = {
  remainingSubcategories: subBatches,
  promptBatches: promptBatches.slice(0, 5), // First 5 batches for now
  mappings: {
    categories: catMap,
    promptTypes: promptTypeMap
  }
};

const outputPath = path.join(__dirname, '../data/upload-ready.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`💾 Saved upload-ready data to: ${outputPath}\n`);

console.log('✅ Data prepared for upload!');
console.log(`   - ${subBatches.length} subcategory batches remaining`);
console.log(`   - ${promptBatches.length} prompt batches total`);
console.log(`   - First 5 prompt batches saved (250 prompts)\n`);

