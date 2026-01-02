/**
 * Bulk Prompt Upload Script for ChatGPT Bible
 *
 * Usage:
 *   node scripts/upload-prompts.js
 *   node scripts/upload-prompts.js --dry-run
 *   node scripts/upload-prompts.js --file prompts.json
 *
 * Environment:
 *   Requires DIRECTUS_URL and DIRECTUS_TOKEN in .env.local
 */

require('dotenv').config({ path: '.env.local' });
const { createDirectus, rest, readItems, createItem } = require('@directus/sdk');

// Directus client
const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL, {
  transport: rest({
    accessToken: process.env.DIRECTUS_TOKEN,
  }),
});

// Prompt type mappings (slug -> ID)
const PROMPT_TYPES = {
  'fill-in-blank': '4ca6b038-9242-4caa-b429-7b823cfd0bad',
  'open-ended': 'c9d4ccc8-a8f3-467d-a9bc-00f6de1ff61c',
  'question-based': '7d12f5c7-5858-44cc-8a44-014e551fcacb',
  'educational': 'eb28da0c-d851-4ba2-b20b-2f6473cb8bbb',
};

// Helper to get prompt type ID from slug
function getPromptTypeId(slug) {
  return PROMPT_TYPES[slug] || null;
}

// Helper to get subcategory ID by slug
async function getSubcategoryId(slug) {
  try {
    const subcategories = await directus.request(
      readItems('subcategories', {
        filter: { slug: { _eq: slug } },
        fields: ['id'],
        limit: 1,
      })
    );
    return subcategories[0]?.id || null;
  } catch (error) {
    console.error(`Error fetching subcategory ${slug}:`, error.message);
    return null;
  }
}

// Validate prompt data
function validatePrompt(prompt) {
  const errors = [];

  if (!prompt.title_th) errors.push('Missing title_th');
  if (!prompt.title_en) errors.push('Missing title_en');
  if (!prompt.prompt_text) errors.push('Missing prompt_text');
  if (!prompt.difficulty_level || !['beginner', 'intermediate', 'advanced'].includes(prompt.difficulty_level)) {
    errors.push('Invalid or missing difficulty_level (must be: beginner, intermediate, advanced)');
  }
  if (!prompt.subcategory_slug) errors.push('Missing subcategory_slug');

  if (prompt.prompt_type && !PROMPT_TYPES[prompt.prompt_type]) {
    errors.push(`Invalid prompt_type: ${prompt.prompt_type}. Must be one of: ${Object.keys(PROMPT_TYPES).join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Create a single prompt
async function createPrompt(prompt, isDryRun = false) {
  const validation = validatePrompt(prompt);

  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  try {
    const subcategoryId = await getSubcategoryId(prompt.subcategory_slug);

    if (!subcategoryId) {
      return {
        success: false,
        errors: [`Subcategory not found: ${prompt.subcategory_slug}`],
      };
    }

    const payload = {
      title_th: prompt.title_th,
      title_en: prompt.title_en,
      short_title_th: prompt.short_title_th || null,
      short_title_en: prompt.short_title_en || null,
      description: prompt.description || '',
      prompt_text: prompt.prompt_text,
      difficulty_level: prompt.difficulty_level,
      sort: prompt.sort || null,
      status: prompt.status || 'draft',
      subcategory_id: subcategoryId,
      prompt_type_id: getPromptTypeId(prompt.prompt_type || 'open-ended'),
      meta_title_th: prompt.meta_title_th || null,
      meta_title_en: prompt.meta_title_en || null,
      meta_description_th: prompt.meta_description_th || null,
      meta_description_en: prompt.meta_description_en || null,
    };

    if (isDryRun) {
      return {
        success: true,
        dryRun: true,
        data: payload,
      };
    }

    const result = await directus.request(
      createItem('prompts', payload)
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const fileArg = args.find((arg) => arg.startsWith('--file=')) || args.find((arg) => !arg.startsWith('--'));

  console.log('🚀 ChatGPT Bible - Prompt Upload Script');
  console.log('='.repeat(50));
  console.log(`Mode: ${isDryRun ? 'DRY RUN (no changes)' : 'LIVE'}`);
  console.log('');

  // Sample prompts data (replace with your actual data or load from file)
  const promptsToUpload = [
    {
      title_th: 'ตัวอย่าง Prompt ใหม่',
      title_en: 'Example New Prompt',
      short_title_th: 'Prompt ตัวอย่าง',
      short_title_en: 'Example Prompt',
      description: 'คำอธิบายสั้นๆ',
      prompt_text: 'นี่คือ prompt ตัวอย่างสำหรับ **[บริษัทของคุณ]**',
      difficulty_level: 'beginner',
      prompt_type: 'fill-in-blank',
      subcategory_slug: 'competitor-analysis',
      sort: 100,
      status: 'draft',
    },
  ];

  // If file specified, load from file
  if (fileArg && !fileArg.startsWith('--')) {
    const filePath = fileArg.startsWith('--file=') ? fileArg.split('=')[1] : fileArg;
    console.log(`📁 Loading prompts from: ${filePath}`);
    try {
      const fs = require('fs');
      const data = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(data);
      promptsToUpload.length = 0;
      promptsToUpload.push(...(Array.isArray(parsed) ? parsed : parsed.prompts || []));
    } catch (error) {
      console.error(`❌ Failed to load file: ${error.message}`);
      process.exit(1);
    }
  }

  console.log(`📊 Total prompts to upload: ${promptsToUpload.length}`);
  console.log('');

  let successCount = 0;
  let errorCount = 0;
  const results = [];

  for (let i = 0; i < promptsToUpload.length; i++) {
    const prompt = promptsToUpload[i];
    console.log(`[${i + 1}/${promptsToUpload.length}] Processing: ${prompt.title_en || prompt.title_th}`);

    const result = await createPrompt(prompt, isDryRun);

    if (result.success) {
      successCount++;
      if (result.dryRun) {
        console.log(`  ✓ Would create prompt with data:`, JSON.stringify(result.data, null, 2));
      } else {
        console.log(`  ✓ Created: ${result.data.id}`);
      }
    } else {
      errorCount++;
      console.log(`  ✗ Errors: ${result.errors.join(', ')}`);
    }

    results.push({
      prompt: prompt.title_en || prompt.title_th,
      ...result,
    });

    // Rate limiting delay
    if (!isDryRun && i < promptsToUpload.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  console.log('');
  console.log('='.repeat(50));
  console.log('📈 Summary:');
  console.log(`  ✓ Success: ${successCount}`);
  console.log(`  ✗ Errors: ${errorCount}`);
  console.log(`  Total: ${promptsToUpload.length}`);
  console.log('');

  if (errorCount > 0) {
    console.log('❌ Errors encountered:');
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`  - ${r.prompt}: ${r.errors.join(', ')}`);
      });
  }

  if (isDryRun) {
    console.log('⚠️  This was a DRY RUN. No actual changes were made.');
    console.log('   Run without --dry-run to apply changes.');
  }
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
