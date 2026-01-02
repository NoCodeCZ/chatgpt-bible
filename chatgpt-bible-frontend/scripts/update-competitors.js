require('dotenv').config({ path: '.env.local' });
const { createDirectus, rest, staticToken, updateItem } = require('@directus/sdk');

const directus = process.env.DIRECTUS_TOKEN
  ? createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL)
      .with(staticToken(process.env.DIRECTUS_TOKEN))
      .with(rest())
  : createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL)
      .with(rest());

// Subcategory 2 -> 103 (Researching Competitors) - IDs 941-949
const competitorPrompts = [941, 942, 943, 944, 945, 946, 947, 948, 949];

// Subcategory 3 -> 106 (Creating Your Business Plan) - IDs 950-957
const businessPlanPrompts = [950, 951, 952, 953, 954, 955, 956, 957];

async function update() {
  console.log('Updating Researching Competitors prompts (941-949) → 103...');
  for (const id of competitorPrompts) {
    await directus.request(updateItem('prompts', id, { subcategory_id: 103 }));
    console.log(`  ✓ Updated ${id} → 103`);
  }

  console.log('\nUpdating Business Plan prompts (950-957) → 106...');
  for (const id of businessPlanPrompts) {
    await directus.request(updateItem('prompts', id, { subcategory_id: 106 }));
    console.log(`  ✓ Updated ${id} → 106`);
  }

  console.log('\n✅ All updates complete!');
}
update().catch(console.error);
