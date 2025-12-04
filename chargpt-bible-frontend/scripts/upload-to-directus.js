/**
 * Upload Parsed Prompts to Directus
 * 
 * This script reads the parsed JSON file and uploads:
 * 1. Categories (if not exist)
 * 2. Subcategories (if not exist)
 * 3. Prompt Types (if not exist)
 * 4. Prompts with relationships
 */

const fs = require('fs');
const path = require('path');

// Directus configuration
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io';

// Prompt type mapping (from parsed data to Directus)
const PROMPT_TYPE_SLUG_MAP = {
  'แบบเติมคำ (FILL-IN-THE-BLANK PROMPTS):': 'fill-in-blank',
  'Fill-in-the-blank Prompts': 'fill-in-blank',
  'แบบปลายเปิด (OPEN-ENDED PROMPTS):': 'open-ended',
  'Open-ended Prompts': 'open-ended',
  'แบบสถานการณ์จำลอง (SCENARIO PROMPTS):': 'scenario-based',
  'Scenario-based Prompts': 'scenario-based',
  'เชิงคำแนะนำ (INSTRUCTIONAL PROMPTS):': 'instructional',
  'Instructional Prompts': 'instructional',
  'เชิงคำถาม (QUESTION-BASED PROMPTS):': 'question-based',
  'Question-based Prompts': 'question-based',
};

/**
 * Convert parsed data structure to arrays
 */
function convertToArrays(parsed) {
  return {
    categories: Array.from(parsed.categories.values()),
    subcategories: Array.from(parsed.subcategories.values()),
    promptTypes: Array.from(parsed.promptTypes.values()),
    prompts: parsed.prompts
  };
}

/**
 * Main execution - will be called by MCP tools
 */
async function prepareUploadData() {
  const parsedPath = path.join(__dirname, '../data/parsed-prompts.json');
  
  if (!fs.existsSync(parsedPath)) {
    throw new Error(`Parsed data file not found: ${parsedPath}`);
  }
  
  const parsed = JSON.parse(fs.readFileSync(parsedPath, 'utf-8'));
  const data = convertToArrays(parsed);
  
  console.log(`\n📦 Prepared for upload:`);
  console.log(`- Categories: ${data.categories.length}`);
  console.log(`- Subcategories: ${data.subcategories.length}`);
  console.log(`- Prompt Types: ${data.promptTypes.length}`);
  console.log(`- Prompts: ${data.prompts.length}`);
  
  return data;
}

module.exports = { prepareUploadData, PROMPT_TYPE_SLUG_MAP };

