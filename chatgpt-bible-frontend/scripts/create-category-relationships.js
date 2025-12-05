/**
 * Create Category Relationships via Junction Table
 * 
 * This script links prompts to categories through the subcategory relationship:
 * prompt → subcategory_id → subcategory → category_id → category
 * 
 * Creates entries in prompt_categories junction table.
 */

require('dotenv').config({ path: '.env.local' });
const { createDirectus, rest, readItems, createItems } = require('@directus/sdk');

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;

if (!DIRECTUS_URL) {
  console.error('❌ Error: NEXT_PUBLIC_DIRECTUS_URL not found in .env.local');
  process.exit(1);
}

const directus = createDirectus(DIRECTUS_URL).with(rest());

async function createCategoryRelationships() {
  try {
    console.log('🚀 Starting category relationship creation...\n');

    // Step 1: Fetch all prompts with subcategory_id
    console.log('📥 Fetching all prompts...');
    const prompts = await directus.request(
      readItems('prompts', {
        fields: ['id', 'subcategory_id'],
        limit: -1, // Fetch all
      })
    );

    console.log(`   Found ${prompts.length} prompts\n`);

    // Step 2: Fetch all subcategories with category_id
    console.log('📥 Fetching all subcategories...');
    const subcategories = await directus.request(
      readItems('subcategories', {
        fields: ['id', 'category_id'],
        limit: -1, // Fetch all
      })
    );

    // Create a map: subcategory_id → category_id
    const subcategoryToCategory = new Map();
    subcategories.forEach(sub => {
      if (sub.category_id) {
        subcategoryToCategory.set(sub.id, sub.category_id);
      }
    });

    console.log(`   Found ${subcategories.length} subcategories`);
    console.log(`   Mapped ${subcategoryToCategory.size} subcategory→category relationships\n`);

    // Step 3: Build junction table entries
    console.log('🔗 Building junction table entries...');
    const junctionEntries = [];
    const skipped = [];

    prompts.forEach(prompt => {
      if (!prompt.subcategory_id) {
        skipped.push({ prompt_id: prompt.id, reason: 'No subcategory_id' });
        return;
      }

      const categoryId = subcategoryToCategory.get(prompt.subcategory_id);
      if (!categoryId) {
        skipped.push({ 
          prompt_id: prompt.id, 
          subcategory_id: prompt.subcategory_id,
          reason: 'Subcategory has no category_id' 
        });
        return;
      }

      junctionEntries.push({
        prompts_id: prompt.id,
        categories_id: categoryId,
      });
    });

    console.log(`   Created ${junctionEntries.length} junction entries`);
    console.log(`   Skipped ${skipped.length} prompts (no valid category relationship)\n`);

    if (skipped.length > 0) {
      console.log('⚠️  Skipped prompts:');
      skipped.slice(0, 10).forEach(s => {
        console.log(`   - Prompt ${s.prompt_id}: ${s.reason}`);
      });
      if (skipped.length > 10) {
        console.log(`   ... and ${skipped.length - 10} more`);
      }
      console.log('');
    }

    // Step 4: Check for existing relationships
    console.log('🔍 Checking for existing relationships...');
    const existing = await directus.request(
      readItems('prompt_categories', {
        fields: ['prompts_id', 'categories_id'],
        limit: -1,
      })
    );

    const existingMap = new Set(
      existing.map(e => `${e.prompts_id}-${e.categories_id}`)
    );

    const newEntries = junctionEntries.filter(
      entry => !existingMap.has(`${entry.prompts_id}-${entry.categories_id}`)
    );

    console.log(`   Found ${existing.length} existing relationships`);
    console.log(`   ${newEntries.length} new relationships to create\n`);

    if (newEntries.length === 0) {
      console.log('✅ All relationships already exist!');
      return;
    }

    // Step 5: Create relationships in batches
    console.log('📤 Creating relationships in batches...');
    const BATCH_SIZE = 50;
    let created = 0;
    let failed = 0;

    for (let i = 0; i < newEntries.length; i += BATCH_SIZE) {
      const batch = newEntries.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(newEntries.length / BATCH_SIZE);

      try {
        await directus.request(
          createItems('prompt_categories', batch)
        );
        created += batch.length;
        console.log(`   ✅ Batch ${batchNum}/${totalBatches}: ${batch.length} relationships created`);
      } catch (error) {
        failed += batch.length;
        console.error(`   ❌ Batch ${batchNum}/${totalBatches}: Error creating relationships`);
        console.error(`      ${error.message}`);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Created: ${created} relationships`);
    console.log(`   ❌ Failed: ${failed} relationships`);
    console.log(`   ⏭️  Skipped (already exist): ${existing.length} relationships`);
    console.log(`   ⚠️  Skipped (no category): ${skipped.length} prompts`);

    // Step 6: Verify
    console.log('\n🔍 Verifying relationships...');
    const finalCount = await directus.request(
      readItems('prompt_categories', {
        fields: ['id'],
        limit: -1,
      })
    );

    console.log(`   Total relationships in Directus: ${finalCount.length}`);
    console.log('\n✅ Category relationship creation complete!');

  } catch (error) {
    console.error('\n❌ Error creating category relationships:');
    console.error(error);
    process.exit(1);
  }
}

// Run the script
createCategoryRelationships();





