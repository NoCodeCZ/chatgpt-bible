/**
 * Fix Duplicate Descriptions Script
 *
 * This script fixes prompts where description and prompt_text contain the same content.
 * The description should be a short summary, while prompt_text is the full template.
 *
 * Usage: node scripts/fix-descriptions.js [--dry-run] [--limit N]
 */

// Load environment variables from .env.local for Node.js scripts
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  console.log('dotenv not loaded, using process.env directly');
}

const { createDirectus, rest, readItems, updateItem } = require('@directus/sdk');

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

// Create Directus client
function createClient() {
  if (!directusUrl) {
    console.error('❌ NEXT_PUBLIC_DIRECTUS_URL not found in environment');
    process.exit(1);
  }

  return createDirectus(directusUrl).with(rest());
}

const directus = createClient();

/**
 * Truncate text to create a short description
 */
function createShortDescription(fullText, maxLength = 100) {
  if (!fullText) return '';

  // Remove markdown formatting for cleaner description
  let cleaned = fullText
    .replace(/\*\*/g, '') // Remove bold markdown
    .replace(/\*/g, '')   // Remove remaining asterisks
    .replace(/\[.*?\]/g, '[...]') // Replace bracketed content with [...] placeholder
    .trim();

  // Truncate to max length
  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  // Find last complete word within limit
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  const lastQuestion = Math.max(
    truncated.lastIndexOf('?'),
    truncated.lastIndexOf('。')
  );

  if (lastQuestion > maxLength * 0.7) {
    return cleaned.substring(0, lastQuestion + 1);
  }

  if (lastSpace > maxLength * 0.8) {
    return cleaned.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

/**
 * Check if description is duplicate of prompt_text
 */
function isDuplicateDescription(description, promptText) {
  if (!description || !promptText) return false;

  // Normalize for comparison
  const normalize = (text) => text.trim().replace(/\s+/g, ' ');

  const desc = normalize(description);
  const text = normalize(promptText);

  // Check if they're exactly the same
  if (desc === text) return true;

  // Check if description is 90%+ of prompt_text (likely a duplicate)
  if (text.length > 0 && desc.length >= text.length * 0.9) {
    return true;
  }

  return false;
}

/**
 * Main function to fix descriptions
 */
async function fixDescriptions(options = {}) {
  const { dryRun = false, limit = null } = options;

  console.log('🔍 Fetching prompts from Directus...');
  console.log(`   URL: ${directusUrl}`);

  try {
    // Fetch all published prompts using the SDK
    const prompts = await directus.request(
      readItems('prompts', {
        filter: {
          status: { _eq: 'published' }
        },
        fields: ['id', 'title_th', 'description', 'prompt_text'],
        limit: limit || -1,
        sort: ['id']
      })
    );

    console.log(`📊 Found ${prompts.length} prompts`);

    // Find duplicates
    const duplicates = [];
    for (const prompt of prompts) {
      if (isDuplicateDescription(prompt.description, prompt.prompt_text)) {
        duplicates.push({
          id: prompt.id,
          title: prompt.title_th?.substring(0, 50) + '...',
          oldDescription: prompt.description?.substring(0, 80) + '...',
          newDescription: createShortDescription(prompt.prompt_text)
        });
      }
    }

    console.log(`\n🔍 Found ${duplicates.length} prompts with duplicate descriptions`);

    if (duplicates.length === 0) {
      console.log('✅ No duplicates found!');
      return;
    }

    // Show samples
    console.log('\n📋 Sample duplicates to fix:');
    console.log('─'.repeat(80));
    duplicates.slice(0, 5).forEach(d => {
      console.log(`\nID: ${d.id}`);
      console.log(`Title: ${d.title}`);
      console.log(`Old: ${d.oldDescription}`);
      console.log(`New: ${d.newDescription}`);
    });

    if (duplicates.length > 5) {
      console.log(`\n... and ${duplicates.length - 5} more`);
    }

    if (dryRun) {
      console.log('\n🔍 DRY RUN - No changes made');
      console.log(`Run without --dry-run to fix ${duplicates.length} prompts`);
      return;
    }

    // Ask for confirmation
    console.log(`\n⚠️  About to update ${duplicates.length} prompts in Directus`);
    console.log('Continue? (ctrl+c to cancel)');

    // Wait a bit for user to see the message
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update prompts
    console.log('\n🔧 Updating descriptions...');
    let updated = 0;
    let errors = 0;

    for (const duplicate of duplicates) {
      try {
        await directus.request(
          updateItem('prompts', duplicate.id, {
            description: duplicate.newDescription
          })
        );

        updated++;
        if (updated % 50 === 0) {
          console.log(`   Progress: ${updated}/${duplicates.length}`);
        }
      } catch (error) {
        errors++;
        console.error(`   ❌ Error updating ID ${duplicate.id}:`, error.message);
      }
    }

    console.log(`\n✅ Done!`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Errors: ${errors}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  dryRun: args.includes('--dry-run'),
  limit: null
};

// Parse --limit N
const limitIndex = args.indexOf('--limit');
if (limitIndex !== -1 && args[limitIndex + 1]) {
  options.limit = parseInt(args[limitIndex + 1], 10);
}

// Run
fixDescriptions(options).catch(console.error);
