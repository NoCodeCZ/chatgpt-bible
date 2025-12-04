/**
 * Upload Prompts to Directus in Batches
 * 
 * This script prepares prompt data with proper subcategory and prompt type mappings
 */

const fs = require('fs');
const path = require('path');

const parsed = require('../data/parsed-prompts.json');

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

// Prompt type mapping (Thai name -> UUID)
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

// Subcategory number to ID mapping (will be populated from Directus)
// Format: "1.1" -> 2, "1.2" -> 3, etc.
const subcategoryMap = {
  '1.1': 2,
  '1.2': 3,
  '1.3': 4,
  '1.4': 5,
  '1.5': 6,
  '1.6': 7,
  '1.7': 8,
  '1.8': 9,
  '2.1': 10,
  '2.2': 11,
  '2.3': 12,
  '2.4': 13,
  '2.5': 14,
  '2.6': 15,
  '2.7': 16,
  '3.1': 17,
  '3.2': 18,
  '3.3': 19,
  '3.4': 20,
  '3.5': 21,
  '3.6': 22,
  '3.7': 23,
  '3.8': 24,
  '4.1': 25, // Use first occurrence
  '4.2': 26,
  '4.3': 27,
  '4.4': 28,
  '4.5': 29,
  '4.6': 35,
  '5.1': 36,
  '5.2': 37,
  '5.3': 38,
  '5.4': 39,
  '5.5': 40,
  '6.2': 41,
  '6.3': 42,
  '6.4': 43,
  '6.5': 44,
  '6.6': 45,
  '6.7': 46,
  '6.8': 47,
  '7.1': 48,
  '7.2': 49,
  '7.3': 50,
  '7.4': 51,
  '8.1': 52,
  '8.2': 53,
  '8.3': 54,
  '8.4': 55,
  '8.5': 56,
  '9.1': 57,
  '9.2': 58,
  '9.3': 59,
  '10.1': 60,
  '10.2': 61,
  '10.3': 62,
  '10.4': 63,
  '10.5': 64,
  '11.1': 65,
  '11.2': 66,
  '11.3': 67,
  '12.1': 68,
  '12.2': 69,
  '12.3': 70,
  '12.4': 71,
  '12.5': 72,
  '12.6': 73,
  '12.7': 74,
  '13.1': 75,
  '13.2': 76,
  '13.3': 77,
  '13.4': 78,
  '13.5': 79,
  '14.1': 80,
  '14.2': 85,
  '14.3': 86,
  '14.4': 87,
  '14.5': 88,
  '15.1': 89,
  '15.2': 81,
  '15.3': 82,
  '16.1': 83,
  '16.2': 84,
  '16.3': 90,
  '16.4': 91,
  '17.1': 95,
  '17.2': 96,
  '17.3': 97,
  '17.4': 98,
  '17.5': 92,
  '17.6': 93,
  '17.7': 94
};

// Clean text function
const cleanText = (text) => {
  if (!text) return text;
  return text
    .replace(/\\\[/g, '[')
    .replace(/\\\]/g, ']')
    .replace(/\\\*/g, '*')
    .trim();
};

// Prepare prompts for upload
const prompts = parsed.prompts
  .filter(p => {
    // Skip already uploaded sample prompts (first 10)
    return true; // Upload all prompts
  })
  .map(p => {
    const subcategoryId = subcategoryMap[p.subcategory_number];
    const promptTypeId = promptTypeMap[p.prompt_type] || promptTypeMap['Fill-in-the-blank Prompts']; // Default fallback
    
    if (!subcategoryId) {
      console.warn(`⚠️  Missing subcategory mapping for: ${p.subcategory_number}`);
    }
    
    return {
      title_th: cleanText(p.title_th),
      title_en: cleanText(p.title_en),
      description: cleanText(p.description) || cleanText(p.title_th)?.substring(0, 200) || '',
      prompt_text: cleanText(p.prompt_text),
      difficulty_level: p.difficulty_level || 'beginner',
      status: p.status || 'published',
      subcategory_id: subcategoryId,
      prompt_type_id: promptTypeId,
      category_number: p.category_number, // Keep for junction table creation
      subcategory_number: p.subcategory_number // Keep for reference
    };
  })
  .filter(p => p.subcategory_id); // Only include prompts with valid subcategory

console.log(`\n📊 Total prompts to upload: ${prompts.length}\n`);

// Split into batches of 50
const batches = [];
for (let i = 0; i < prompts.length; i += 50) {
  batches.push(prompts.slice(i, i + 50));
}

console.log(`📦 Total batches: ${batches.length}\n`);

// Save first batch for immediate use
const outputPath = path.join(__dirname, '../data/prompt-batches.json');
fs.writeFileSync(outputPath, JSON.stringify(batches, null, 2));
console.log(`💾 Saved prompt batches to: ${outputPath}\n`);

// Output first batch
console.log('First batch (50 prompts):\n');
console.log(`Total prompts in batch: ${batches[0].length}`);
console.log(`Sample prompt:`, JSON.stringify(batches[0][0], null, 2));

