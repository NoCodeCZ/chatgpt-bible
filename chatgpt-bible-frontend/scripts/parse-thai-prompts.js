/**
 * Thai Prompts Parser v2
 * Parses the Thai prompt markdown files and outputs JSON for upload
 */

const fs = require('fs');
const path = require('path');

// Prompt type ID mappings (slug -> ID)
const PROMPT_TYPES = {
  'fill-in-blank': '4ca6b038-9242-4caa-b429-7b823cfd0bad',
  'open-ended': 'c9d4ccc8-a8f3-467d-a9bc-00f6de1ff61c',
  'question-based': '7d12f5c7-5858-44cc-8a44-014e551fcacb',
  'educational': 'eb28da0c-d851-4ba2-b20b-2f6473cb8bbb',
};

// Generate subcategory slug from Thai name
function generateSubcategorySlug(thaiName) {
  const mappings = {
    'การวิเคราะห์คู่แข่ง': 'competitor-analysis',
    'การสร้างแผนธุรกิจ': 'business-plan',
    'การเขียนข้อเสนอให้ลูกค้า': 'writing-proposals',
    'การสร้างวิสัยทัศน์บริษัท': 'vision-statement',
    'การสร้างไอเดียธุรกิจ': 'business-ideas',
    'การเตรียมเสนอแผนต่อนักลงทุน': 'pitching-investors',
    'การจ้างงานและภาวะผู้นำ': 'hiring-leadership',
    'การเขียนสรุปการประชุม': 'meeting-summary',
    'การตลาดผ่านอีเมล': 'email-marketing',
    'การสร้างหัวข้ออีเมล': 'email-subject-lines',
    'การเขียนอีเมลการขาย': 'sales-emails',
  };
  return mappings[thaiName] || null;
}

// Clean text and generate short title
function cleanAndShorten(text) {
  let cleanText = text
    .replace(/^[\*\d+.\s]+|^\*\s*/gm, '') // Remove bullet points and numbers
    .replace(/^["'`]|["'`]$/gm, '') // Remove surrounding quotes
    .replace(/\*\*/g, '') // Remove markdown bold
    .trim();

  // Generate short title (first 50 chars)
  const shortTitle = cleanText.substring(0, 50).trim();
  return {
    short_title: shortTitle,
    full_text: cleanText,
  };
}

// Parse the entire markdown file
function parseMarkdownFile(content) {
  const prompts = [];
  const lines = content.split('\n');

  let currentCategory = '';
  let currentSubcategory = '';
  let currentPromptType = 'open-ended';
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track code blocks
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Category headers (###)
    const categoryMatch = line.match(/^###\s+(.+)/);
    if (categoryMatch) {
      currentCategory = categoryMatch[1].replace(/\*\*/g, '').trim();
      continue;
    }

    // Subcategory headers (####)
    const subcategoryMatch = line.match(/^####\s+(.+)/);
    if (subcategoryMatch) {
      currentSubcategory = subcategoryMatch[1].replace(/\*\*/g, '').trim();
      // Extract Thai name (remove the number prefix and English translation)
      const thaiNameMatch = currentSubcategory.match(/^[\d.]+\s+([^()]+)/);
      if (thaiNameMatch) {
        currentSubcategory = thaiNameMatch[1].trim();
      }
      currentPromptType = 'open-ended'; // Reset to default
      continue;
    }

    // Detect prompt type from content
    if (line.includes('PROMPT แบบเติมคำ') || line.includes('FILL-IN-THE-BLANK')) {
      currentPromptType = 'fill-in-blank';
    } else if (line.includes('PROMPT แบบปลายเปิด') || line.includes('OPEN-ENDED')) {
      currentPromptType = 'open-ended';
    } else if (line.includes('PROMPT เชิงคำถาม') || line.includes('QUESTIONS-BASED')) {
      currentPromptType = 'question-based';
    } else if (line.includes('PROMPT เชิงคำแนะนำ') || line.includes('EDUCATIONAL')) {
      currentPromptType = 'educational';
    }

    // Check if it's a prompt line (starts with *, -, or number followed by .)
    const isPromptStart = /^[\*\-]|\d+\.\s+/.test(line) && line.length > 20;

    if (isPromptStart) {
      const { short_title, full_text } = cleanAndShorten(line);

      // Skip if prompt text is too short or looks like a header
      if (full_text.length < 30 || full_text.startsWith('PROMPT')) {
        continue;
      }

      const subcategorySlug = generateSubcategorySlug(currentSubcategory);

      prompts.push({
        title_th: short_title + (full_text.length > 50 ? '...' : ''),
        title_en: short_title + (full_text.length > 50 ? '...' : ''),
        short_title_th: short_title,
        short_title_en: short_title,
        description: currentCategory,
        prompt_text: full_text,
        difficulty_level: 'beginner',
        prompt_type: currentPromptType,
        prompt_type_id: PROMPT_TYPES[currentPromptType],
        subcategory_name: currentSubcategory,
        subcategory_slug: subcategorySlug,
        status: 'published',
      });
    }
  }

  return prompts;
}

// Main function
function main() {
  const promptsDir = '/Users/techathamn/Desktop/AI Projects/Chatgpt Bible/prompts';
  const files = fs.readdirSync(promptsDir).filter(f => f.endsWith('.md'));

  console.log(`Found ${files.length} files`);

  const allPrompts = [];

  for (const file of files) {
    console.log(`Processing: ${file}`);
    const filePath = path.join(promptsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    const parsedPrompts = parseMarkdownFile(content);
    console.log(`  Parsed ${parsedPrompts.length} prompts`);
    allPrompts.push(...parsedPrompts);
  }

  // Write output
  const outputPath = path.join(__dirname, '../parsed-prompts.json');
  fs.writeFileSync(outputPath, JSON.stringify(allPrompts, null, 2));
  console.log(`\nTotal prompts: ${allPrompts.length}`);
  console.log(`Output saved to: ${outputPath}`);

  // Show subcategory distribution
  const subcategoryCounts = {};
  for (const p of allPrompts) {
    if (p.subcategory_slug) {
      subcategoryCounts[p.subcategory_slug] = (subcategoryCounts[p.subcategory_slug] || 0) + 1;
    }
  }
  console.log('\nSubcategory distribution:');
  console.log(JSON.stringify(subcategoryCounts, null, 2));
}

main();
