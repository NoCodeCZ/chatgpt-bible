/**
 * Update All Prompt Subcategories from Batch Uploads
 * Reassigns prompts to correct categories based on content analysis
 */

require('dotenv').config({ path: '.env.local' });
const { createDirectus, rest, staticToken, updateItem } = require('@directus/sdk');

const directus = process.env.DIRECTUS_TOKEN
  ? createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL)
      .with(staticToken(process.env.DIRECTUS_TOKEN))
      .with(rest())
  : createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL)
      .with(rest());

// New Subcategory IDs
const SUBCATEGORIES = {
  // General Business (496f6b0d-2467-4697-bd1e-8366c26c2f5a)
  BUSINESS_VISION: 107,
  BUSINESS_MISSION: 108,
  PITCHING_INVESTORS: 109,
  GENERATING_IDEAS: 110,
  UNIQUE_VALUE: 111,

  // Hiring (c4122207-a891-4f2a-96bb-fc10b90b5253)
  JOB_DESCRIPTIONS: 112,
  JOB_OFFERS: 113,
  ONBOARDING: 114,
  INTERVIEW_QUESTIONS: 115,
  COMPANY_CULTURE: 116,
  FIRING: 117,

  // Leadership (3c1168c0-829b-46ac-922c-d953e24f5ffe)
  COMMUNICATING_VISION: 118,
  BRAINSTORMING_VALUES: 119,
  PERFORMANCE_REVIEWS: 120,
  VIRTUAL_MEETINGS: 121,
  DELEGATING: 122,
  PERSONAL_DEVELOPMENT: 123,
  PRODUCTIVITY: 124,
  LEADERSHIP_DEVELOPMENT: 125,

  // Operations (6f0cee31-d14f-49e3-8d12-309649311e05)
  SOPS: 126,
  OKRS: 127,
  KPIS: 128,
  MEETING_NOTES: 129,
  ORG_CHART: 130,

  // Legal (202a87e3-cb1b-4142-a113-7708b5ece20b)
  WRITING_CONTRACTS: 131,
  REVIEWING_CONTRACTS: 132,
  LEGAL_TERMINOLOGY: 133,
  CREATING_NDAS: 134,
  TERMS_CONDITIONS: 135,
  PRIVACY_POLICIES: 136,

  // Finances (c0de5ccc-75fd-4e62-a430-e1d6c5fea44d)
  SETTING_BUDGETS: 137,
  FINANCIAL_FORECASTING: 138,
  ANALYZING_FINANCIALS: 139,
  ACCOUNTING_PROCESSES: 140,
  PREPARING_TAXES: 141,
  AUDITING_FINANCES: 142,
};

// Prompts from old subcategory 8 (Hiring) → new Hiring subcategories
const HIRING_PROMPTS = {
  // Writing Job Descriptions (112)
  [SUBCATEGORIES.JOB_DESCRIPTIONS]: [
    999, 1010, 997, 1004, 1000, 1002, 1008, 1001, 1009, 1003, 1005, 1006, 1007
  ],
  // Onboarding New Employees (114)
  [SUBCATEGORIES.ONBOARDING]: [996, 998],
  // Interview Questions / Hiring Process (115)
  [SUBCATEGORIES.INTERVIEW_QUESTIONS]: [1013],
};

// Meeting Summary prompts → Operations (129)
const MEETING_SUMMARY_PROMPTS = [
  1014, 1019, 1015, 1011, 1012, 1017, 1016, 1018
];

// Business Vision prompts (currently in 106 - Business Plan)
const BUSINESS_VISION_PROMPTS = [
  966, 968, 969, 971, 972, 973, 974, 975, 978, 979
];

// Email subject line prompts (already in 10 - keep)
// Sales email prompts (already in 11 - keep)

async function updatePrompts() {
  console.log('========================================');
  console.log('  Updating Prompt Subcategories');
  console.log('========================================\n');

  let updated = 0;
  let failed = 0;
  const errors = [];

  // Update Hiring prompts
  console.log('📝 Updating Hiring prompts...\n');
  for (const [subcategoryId, promptIds] of Object.entries(HIRING_PROMPTS)) {
    const subcategoryIdNum = parseInt(subcategoryId);
    for (const promptId of promptIds) {
      try {
        await directus.request(
          updateItem('prompts', promptId, {
            subcategory_id: subcategoryIdNum
          })
        );
        updated++;
        console.log(`  ✓ Updated prompt ${promptId} → ${subcategoryIdNum}`);
      } catch (error) {
        failed++;
        const errorMsg = error.message || String(error);
        errors.push({ id: promptId, error: errorMsg });
        console.log(`  ✗ Failed to update prompt ${promptId}: ${errorMsg}`);
      }
    }
  }

  // Update Meeting Summary prompts → Operations
  console.log('\n📝 Updating Meeting Summary prompts → Operations...\n');
  for (const promptId of MEETING_SUMMARY_PROMPTS) {
    try {
      await directus.request(
        updateItem('prompts', promptId, {
          subcategory_id: SUBCATEGORIES.MEETING_NOTES
        })
      );
      updated++;
      console.log(`  ✓ Updated prompt ${promptId} → ${SUBCATEGORIES.MEETING_NOTES} (Meeting Notes)`);
    } catch (error) {
      failed++;
      const errorMsg = error.message || String(error);
      errors.push({ id: promptId, error: errorMsg });
      console.log(`  ✗ Failed to update prompt ${promptId}: ${errorMsg}`);
    }
  }

  // Update Business Vision prompts (currently in 106)
  console.log('\n📝 Updating Business Vision prompts...\n');
  for (const promptId of BUSINESS_VISION_PROMPTS) {
    try {
      await directus.request(
        updateItem('prompts', promptId, {
          subcategory_id: SUBCATEGORIES.BUSINESS_VISION
        })
      );
      updated++;
      console.log(`  ✓ Updated prompt ${promptId} → ${SUBCATEGORIES.BUSINESS_VISION} (Business Vision)`);
    } catch (error) {
      failed++;
      const errorMsg = error.message || String(error);
      errors.push({ id: promptId, error: errorMsg });
      console.log(`  ✗ Failed to update prompt ${promptId}: ${errorMsg}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📈 Summary:');
  console.log(`  ✓ Updated: ${updated}`);
  console.log(`  ✗ Failed: ${failed}`);
  console.log(`  Total processed: ${updated + failed}`);

  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach((e) => {
      console.log(`  [${e.id}] ${e.error}`);
    });
  }

  console.log('\n✅ Subcategory update complete!');
}

updatePrompts().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
