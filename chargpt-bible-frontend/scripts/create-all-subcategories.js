/**
 * Generate all remaining subcategories for Directus upload
 * This script outputs JSON that can be used with MCP Directus tools
 */

const fs = require('fs');
const path = require('path');

const data = require('../data/parsed-prompts.json');

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

// Already created subcategories
const existing = ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', 
                  '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7',
                  '3.1', '3.2', '3.3'];

const subs = data.subcategories
  .filter(s => !existing.includes(s.key))
  .map(s => ({
    name_th: s.name_th,
    name_en: s.name_en,
    slug: s.slug,
    description_th: s.description_th,
    description_en: s.description_en,
    category_id: catMap[s.category_id],
    sort: s.sort
  }));

console.log(`\n📊 Remaining subcategories to create: ${subs.length}\n`);

// Split into batches of 10
const batches = [];
for (let i = 0; i < subs.length; i += 10) {
  batches.push(subs.slice(i, i + 10));
}

console.log(`📦 Split into ${batches.length} batches\n`);

// Save batches to file
const outputPath = path.join(__dirname, '../data/subcategory-batches.json');
fs.writeFileSync(outputPath, JSON.stringify(batches, null, 2));
console.log(`💾 Saved batches to: ${outputPath}\n`);

// Output first batch for immediate use
console.log('First batch (10 subcategories):\n');
console.log(JSON.stringify(batches[0], null, 2));

