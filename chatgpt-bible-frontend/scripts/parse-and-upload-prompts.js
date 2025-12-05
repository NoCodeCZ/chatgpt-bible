/**
 * Parse Thai Markdown Prompt File and Upload to Directus
 * 
 * This script parses the markdown file structure:
 * - Main categories (### **1. ...**)
 * - Subcategories (#### **1.1 ...**)
 * - Prompt types (**PROMPT แบบ...**)
 * - Individual prompts (numbered lists or bullet points)
 */

const fs = require('fs');
const path = require('path');

// Directus configuration
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io';
const DIRECTUS_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || '';

// Prompt type mappings (Thai to English)
const PROMPT_TYPE_MAP = {
  'PROMPT แบบเติมคำ': 'Fill-in-the-blank Prompts',
  'FILL-IN-THE-BLANK PROMPTS': 'Fill-in-the-blank Prompts',
  'PROMPT แบบปลายเปิด': 'Open-ended Prompts',
  'OPEN-ENDED PROMPTS': 'Open-ended Prompts',
  'PROMPT แบบสถานการณ์': 'Scenario-based Prompts',
  'SCENARIO PROMPTS': 'Scenario-based Prompts',
  'PROMPT เชิงคำแนะนำ': 'Instructional Prompts',
  'INSTRUCTIONAL PROMPTS': 'Instructional Prompts',
  'PROMPT เชิงคำถาม': 'Question-based Prompts',
  'QUESTION-BASED PROMPTS': 'Question-based Prompts',
};

/**
 * Parse markdown file and extract structured prompt data
 */
function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const result = {
    categories: new Map(),
    subcategories: new Map(),
    promptTypes: new Map(),
    prompts: []
  };
  
  let currentCategory = null;
  let currentSubcategory = null;
  let currentPromptType = null;
  let currentSection = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Main category: ### **1. Thai Name (English Name)** or ### **1\. Thai Name (English Name)**
    if (line.match(/^### \*\*\d+\\?\.\s+(.+?)\s*\((.+?)\)\*\*$/)) {
      const match = line.match(/^### \*\*\d+\\?\.\s+(.+?)\s*\((.+?)\)\*\*$/);
      const thaiName = match[1].trim();
      const englishName = match[2].trim();
      const categoryNumber = line.match(/^### \*\*(\d+)\\?\./)[1];
      
      currentCategory = {
        number: categoryNumber,
        name_th: thaiName,
        name_en: englishName,
        slug: `category-${categoryNumber}`,
        description_th: `หมวดหมู่ ${categoryNumber}: ${thaiName}`,
        description_en: `Category ${categoryNumber}: ${englishName}`,
        sort: parseInt(categoryNumber)
      };
      
      result.categories.set(categoryNumber, currentCategory);
      currentSubcategory = null;
      continue;
    }
    
    // Subcategory: #### **1.1 Thai Name (English Name)** or #### **1\.1 Thai Name (English Name)**
    if (line.match(/^#### \*\*\d+\\?\.\d+\s+(.+?)\s*\((.+?)\)\*\*$/)) {
      const match = line.match(/^#### \*\*\d+\\?\.(\d+)\s+(.+?)\s*\((.+?)\)\*\*$/);
      const subNumber = match[1];
      const thaiName = match[2].trim();
      const englishName = match[3].trim();
      const fullNumber = line.match(/^#### \*\*(\d+\\?\.\d+)/)[1].replace(/\\/g, '');
      
      if (currentCategory) {
        currentSubcategory = {
          number: fullNumber,
          name_th: thaiName,
          name_en: englishName,
          slug: `subcategory-${fullNumber.replace(/\./g, '-')}`,
          description_th: `${fullNumber} ${thaiName}`,
          description_en: `${fullNumber} ${englishName}`,
          category_id: currentCategory.number,
          sort: parseInt(subNumber)
        };
        
        result.subcategories.set(fullNumber, currentSubcategory);
      }
      continue;
    }
    
    // Prompt type: **PROMPT แบบ...** or **PROMPT ... PROMPTS:**
    if (line.match(/^\*\*PROMPT\s+(.+?)\s*\*\*:?$/) || line.match(/^\*\*(.+?)\s+PROMPTS?\*\*:?$/)) {
      const match = line.match(/^\*\*PROMPT\s+(.+?)\s*\*\*:?$/) || line.match(/^\*\*(.+?)\s+PROMPTS?\*\*:?$/);
      const promptTypeText = match[1].trim();
      const englishName = PROMPT_TYPE_MAP[promptTypeText] || promptTypeText;
      
      currentPromptType = {
        name_th: promptTypeText,
        name_en: englishName,
        slug: englishName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description_th: `ประเภท Prompt: ${promptTypeText}`,
        description_en: `Prompt Type: ${englishName}`
      };
      
      result.promptTypes.set(englishName, currentPromptType);
      continue;
    }
    
    // Individual prompts: numbered lists (1. "..." or * ...)
    if (currentCategory && currentSubcategory && currentPromptType) {
      // Numbered prompt: 1. "text" or * text (with or without quotes)
      const numberedMatch = line.match(/^\d+\.\s+["'](.+?)["']/) || line.match(/^\d+\.\s+(.+)$/);
      const bulletMatch = line.match(/^\*\s+(.+)$/);
      const match = numberedMatch || bulletMatch;
      
      if (match) {
        const promptText = match[1].trim();
        
        // Extract title from first 50 chars
        const title = promptText.length > 50 
          ? promptText.substring(0, 47) + '...' 
          : promptText;
        
        // Determine difficulty based on prompt type
        let difficulty = 'beginner';
        if (currentPromptType.name_en.includes('Scenario') || currentPromptType.name_en.includes('Instructional')) {
          difficulty = 'intermediate';
        }
        
        result.prompts.push({
          title_th: title,
          title_en: title, // Will be translated if needed
          description: promptText.substring(0, 200), // First 200 chars
          prompt_text: promptText,
          difficulty_level: difficulty,
          status: 'published',
          category_number: currentCategory.number,
          subcategory_number: currentSubcategory.number,
          prompt_type: currentPromptType.name_en
        });
      }
    }
  }
  
  return result;
}

/**
 * Main execution
 */
async function main() {
  const filePath = process.argv[2] || '/Users/techathamn/Downloads/บท 1.md';
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
  
  console.log('📖 Parsing markdown file...');
  const parsed = parseMarkdownFile(filePath);
  
  console.log(`\n📊 Parsed Data:`);
  console.log(`- Categories: ${parsed.categories.size}`);
  console.log(`- Subcategories: ${parsed.subcategories.size}`);
  console.log(`- Prompt Types: ${parsed.promptTypes.size}`);
  console.log(`- Prompts: ${parsed.prompts.length}`);
  
  // Convert Maps to objects for JSON serialization
  const output = {
    categories: Array.from(parsed.categories.entries()).map(([key, value]) => ({ key, ...value })),
    subcategories: Array.from(parsed.subcategories.entries()).map(([key, value]) => ({ key, ...value })),
    promptTypes: Array.from(parsed.promptTypes.entries()).map(([key, value]) => ({ key, ...value })),
    prompts: parsed.prompts
  };
  
  // Output parsed data as JSON for review
  const outputPath = path.join(__dirname, '../data/parsed-prompts.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\n💾 Saved parsed data to: ${outputPath}`);
  
  console.log('\n✅ Parsing complete! Review the JSON file, then we can upload to Directus.');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { parseMarkdownFile };

