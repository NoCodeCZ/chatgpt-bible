/**
 * Update Prompt Subcategories for Growth Strategy
 * Fixes incorrect subcategory assignments for recently uploaded prompts
 */

require('dotenv').config({ path: '.env.local' });
const { createDirectus, rest, staticToken, updateItem, readItems } = require('@directus/sdk');

const directus = process.env.DIRECTUS_TOKEN
  ? createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL)
      .with(staticToken(process.env.DIRECTUS_TOKEN))
      .with(rest())
  : createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL)
      .with(rest());

// Growth Strategy Subcategory IDs
const GROWTH_SUBCATEGORIES = {
  METRICS: 102,           // Setting up Metrics
  COMPETITORS: 103,       // Researching Competitors
  LAUNCHING: 104,         // Launching a Product
  BRAINSTORMING: 105,     // Brainstorming Business Ideas
  BUSINESS_PLAN: 106,     // Creating Your Business Plan
};

// Map prompts by content analysis
const PROMPT_MAPPINGS = [
  // Subcategory 2 -> 103 (Researching Competitors) - all about competitors
  ...Array.from({ start: 941, end: 950 }, id => ({ id: id, newSubcategory: GROWTH_SUBCATEGORIES.COMPETITORS })),

  // Subcategory 3 -> 106 (Creating Your Business Plan) - business plans, goals, financials
  ...Array.from({ start: 950, end: 957 }, id => ({ id: id, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN })),
  { id: 958, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },
  { id: 960, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },

  // Subcategory 4 -> 106 (Creating Your Business Plan) - business strategy elements
  { id: 959, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },
  { id: 961, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },
  { id: 962, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },
  { id: 963, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },
  { id: 964, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },
  { id: 965, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },
  { id: 967, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },
  { id: 970, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },

  // Subcategory 5 -> 106 (Creating Your Business Plan) - vision, values, culture
  { id: 966, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },
  { id: 968, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },
  { id: 969, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },
  { id: 971, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },
  { id: 972, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },
  { id: 973, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },
  { id: 974, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },
  { id: 975, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },
  { id: 978, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },
  { id: 979, newSubcategory: GROWTH_SUBCATEGORIES.BUSINESS_PLAN },

  // Subcategory 6 -> 105 (Brainstorming Business Ideas)
  { id: 976, newSubcategory: GROWTH_SUBCATEGORIES.BRAINSTORMING },
  { id: 977, newSubcategory: GROWTH_SUBCATEGORIES.BRAINSTORMING },
  { id: 980, newSubcategory: GROWTH_SUBCATEGORIES.BRAINSTORMING },
  { id: 981, newSubcategory: GROWTH_SUBCATEGORIES.BRAINSTORMING },
  { id: 982, newSubcategory: GROWTH_SUBCATEGORIES.BRAINSTORMING },
  { id: 983, newSubcategory: GROWTH_SUBCATEGORIES.BRAINSTORMING },
  { id: 984, newSubcategory: GROWTH_SUBCATEGORIES.BRAINSTORMING },
  { id: 985, newSubcategory: GROWTH_SUBCATEGORIES.BRAINSTORMING },
  { id: 986, newSubcategory: GROWTH_SUBCATEGORIES.BRAINSTORMING },
  { id: 987, newSubcategory: GROWTH_SUBCATEGORIES.BRAINSTORMING },
  { id: 988, newSubcategory: GROWTH_SUBCATEGORIES.BRAINSTORMING },
  { id: 989, newSubcategory: GROWTH_SUBCATEGORIES.BRAINSTORMING },
  { id: 990, newSubcategory: GROWTH_SUBCATEGORIES.BRAINSTORMING },
  { id: 991, newSubcategory: GROWTH_SUBCATEGORIES.BRAINSTORMING },
  { id: 992, newSubcategory: GROWTH_SUBCATEGORIES.BRAINSTORMING },
  { id: 993, newSubcategory: GROWTH_SUBCATEGORIES.BRAINSTORMING },
  { id: 994, newSubcategory: GROWTH_SUBCATEGORIES.BRAINSTORMING },
  { id: 995, newSubcategory: GROWTH_SUBCATEGORIES.BRAINSTORMING },

  // Subcategory 10, 11: 1025 is a product launch -> 104
  { id: 1025, newSubcategory: GROWTH_SUBCATEGORIES.LAUNCHING },
  { id: 1031, newSubcategory: GROWTH_SUBCATEGORIES.LAUNCHING },
];

async function updatePromptSubcategories() {
  console.log('========================================');
  console.log('  Updating Prompt Subcategories');
  console.log('========================================\n');

  let updated = 0;
  let failed = 0;
  const errors = [];

  for (const mapping of PROMPT_MAPPINGS) {
    try {
      await directus.request(
        updateItem('prompts', mapping.id, {
          subcategory_id: mapping.newSubcategory,
        })
      );
      updated++;
      console.log(`  ✓ Updated prompt ${mapping.id} → subcategory ${mapping.newSubcategory}`);
    } catch (error) {
      failed++;
      const errorMsg = error.message || String(error);
      errors.push({ id: mapping.id, error: errorMsg });
      console.log(`  ✗ Failed to update prompt ${mapping.id}: ${errorMsg}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📈 Summary:');
  console.log(`  ✓ Updated: ${updated}`);
  console.log(`  ✗ Failed: ${failed}`);
  console.log(`  Total processed: ${PROMPT_MAPPINGS.length}`);

  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach((e) => {
      console.log(`  [${e.id}] ${e.error}`);
    });
  }

  console.log('\n✅ Subcategory update complete!');
}

updatePromptSubcategories().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
