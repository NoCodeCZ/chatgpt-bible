/**
 * Thai Prompts Parser & Uploader
 * Parses the Thai prompt markdown files and uploads them to Directus
 */

require('dotenv').config({ path: '.env.local' });
const { createDirectus, rest, readItems, createItem } = require('@directus/sdk');
const fs = require('fs');
const path = require('path');

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL, {
  transport: rest({
    accessToken: process.env.DIRECTUS_TOKEN,
  }),
});

// Prompt type mappings
const PROMPT_TYPES = {
  'fill-in-blank': '4ca6b038-9242-4caa-b429-7b823cfd0bad',
  'open-ended': 'c9d4ccc8-a8f3-467d-a9bc-00f6de1ff61c',
  'question-based': '7d12f5c7-5858-44cc-8a44-014e551fcacb',
  'educational': 'eb28da0c-d851-4ba2-b20b-2f6473cb8bbb',
};

// Subcategory mappings (slug based on Thai names)
const SUBCATEGORY_MAP = {
  'competitor-analysis': 'competitor-analysis',
  'business-plan': 'business-plan',
  'writing-proposals': 'writing-proposals',
  'vision-statement': 'vision-statement',
  'business-ideas': 'business-ideas',
  'pitching-investors': 'pitching-investors',
  'hiring-leadership': 'hiring-leadership',
  'meeting-summary': 'meeting-summary',
  'email-marketing': 'email-marketing',
  'email-subject-lines': 'email-subject-lines',
  'sales-emails': 'sales-emails',
};

// Get subcategory ID by slug
async function getSubcategoryId(slug) {
  try {
    const result = await directus.request(
      readItems('subcategories', {
        filter: { slug: { _eq: slug } },
        fields: ['id'],
        limit: 1,
      })
    );
    return result[0]?.id || null;
  } catch (error) {
    console.error(`Error finding subcategory ${slug}:`, error.message);
    return null;
  }
}

// Parse a single prompt from the markdown content
function parsePrompt(promptText, category, subcategory, promptType) {
  // Extract the prompt text (remove bullet points, numbers, quotes)
  let cleanText = promptText
    .replace(/^[*\d+.\s]+|^\*\s*/gm, '') // Remove bullet points and numbers
    .replace(/^["'`]|["'`]$/gm, '') // Remove surrounding quotes
    .trim();

  // Generate short title (first 50 chars)
  const shortTitle = cleanText.substring(0, 50).trim();

  // Generate titles
  const titleTh = shortTitle + (cleanText.length > 50 ? '...' : '');
  const titleEn = shortTitle + (cleanText.length > 50 ? '...' : '');

  return {
    title_th: titleTh,
    title_en: titleEn,
    short_title_th: shortTitle,
    short_title_en: shortTitle,
    description: category,
    prompt_text: cleanText,
    difficulty_level: 'beginner',
    prompt_type: promptType,
    subcategory_slug: subcategory,
    status: 'published',
  };
}

// Parse a section (e.g., "#### 1.1 ...")
function parseSection(content, categoryName, subsectionName) {
  const prompts = [];
  let currentPromptType = 'open-ended'; // default

  // Detect prompt type from headers
  if (content.includes('PROMPT แบบเติมคำ')) {
    currentPromptType = 'fill-in-blank';
  } else if (content.includes('PROMPT แบบปลายเปิด')) {
    currentPromptType = 'open-ended';
  } else if (content.includes('PROMPT เชิงคำถาม')) {
    currentPromptType = 'question-based';
  } else if (content.includes('PROMPT เชิงคำแนะนำ') || content.includes('PROMPT แบบเติมคำ')) {
    currentPromptType = 'educational';
  }

  // Split by bullet points or numbered lists
  const lines = content.split('\n');
  let currentPrompt = '';

  for (const line of lines) {
    // Check if it's a prompt line (starts with *, -, or number followed by .)
    if (/^[\*\-]|\d+\.\s+/.test(line) && line.length > 20) {
      if (currentPrompt) {
        const parsed = parsePrompt(currentPrompt, categoryName, subsectionName, currentPromptType);
        prompts.push(parsed);
      }
      currentPrompt = line;
    } else if (currentPrompt) {
      // Continue multi-line prompt
      currentPrompt += '\n' + line;
    }
  }

  // Don't forget the last prompt
  if (currentPrompt) {
    const parsed = parsePrompt(currentPrompt, categoryName, subsectionName, currentPromptType);
    prompts.push(parsed);
  }

  return prompts;
}

// Parse the entire markdown file
function parseMarkdownFile(content) {
  const prompts = [];
  const lines = content.split('\n');

  let currentCategory = '';
  let currentSubcategory = '';
  let currentSection = '';
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
    if (line.startsWith('###')) {
      currentCategory = line.replace(/###\s*/g, '').trim();
      currentSection = '';
      continue;
    }

    // Subcategory headers (####)
    if (line.startsWith('####')) {
      if (currentSection) {
        // Parse previous section
        const sectionPrompts = parseSection(currentSection, currentCategory, currentSubcategory);
        prompts.push(...sectionPrompts);
      }
      currentSubcategory = line.replace(/####\s*/g, '').trim();
      currentSection = '';
      continue;
    }

    // Build current section
    if (line.trim()) {
      currentSection += (currentSection ? '\n' : '') + line;
    }
  }

  // Don't forget the last section
  if (currentSection) {
    const sectionPrompts = parseSection(currentSection, currentCategory, currentSubcategory);
    prompts.push(...sectionPrompts);
  }

  return prompts;
}

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
  return mappings[thaiName] || thaiName.toLowerCase().replace(/\s+/g, '-');
}

// Main upload function
async function uploadPrompts() {
  console.log('📂 Reading prompt files...');

  const promptsDir = '/Users/techathamn/Desktop/AI Projects/Chatgpt Bible/prompts';
  const files = fs.readdirSync(promptsDir).filter(f => f.endsWith('.md'));

  console.log(`Found ${files.length} files`);
  console.log('');

  // Get existing prompts to avoid duplicates
  console.log('📋 Fetching existing prompts from Directus...');
  const existingPrompts = await directus.request(
    readItems('prompts', {
      fields: ['prompt_text'],
      limit: -1,
    })
  );

  const existingTexts = new Set(existingPrompts.map(p => p.prompt_text.substring(0, 100)));
  console.log(`Found ${existingPrompts.length} existing prompts`);

  let totalParsed = 0;
  let totalNew = 0;
  let totalUploaded = 0;

  for (const file of files) {
    console.log(`\n📖 Processing: ${file}`);
    const filePath = path.join(promptsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    const parsedPrompts = parseMarkdownFile(content);
    totalParsed += parsedPrompts.length;
    console.log(`  Parsed ${parsedPrompts.length} prompts`);

    // Filter new prompts
    const newPrompts = parsedPrompts.filter(p => {
      const textPreview = p.prompt_text.substring(0, 100);
      return !existingTexts.has(textPreview);
    });

    totalNew += newPrompts.length;
    console.log(`  New prompts: ${newPrompts.length}`);

    // Upload new prompts
    for (const prompt of newPrompts) {
      try {
        const subcategorySlug = generateSubcategorySlug(prompt.subcategory_slug);
        const subcategoryId = await getSubcategoryId(subcategorySlug);

        if (!subcategoryId) {
          console.log(`  ⚠️  Skipped (no subcategory): ${prompt.short_title_en}`);
          continue;
        }

        const payload = {
          title_th: prompt.title_th,
          title_en: prompt.title_en,
          short_title_th: prompt.short_title_th,
          short_title_en: prompt.short_title_en,
          description: prompt.description,
          prompt_text: prompt.prompt_text,
          difficulty_level: prompt.difficulty_level,
          status: prompt.status,
          subcategory_id: subcategoryId,
          prompt_type_id: PROMPT_TYPES[prompt.prompt_type] || PROMPT_TYPES['open-ended'],
        };

        const result = await directus.request(
          createItem('prompts', payload)
        );

        totalUploaded++;
        console.log(`  ✓ Created: ${result.id}`);
      } catch (error) {
        console.log(`  ✗ Failed: ${error.message}`);
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`  Total parsed: ${totalParsed}`);
  console.log(`  New prompts: ${totalNew}`);
  console.log(`  Uploaded: ${totalUploaded}`);
  console.log(`  Skipped (duplicates): ${totalParsed - totalNew}`);
}

// Run the upload
uploadPrompts().catch(console.error);
