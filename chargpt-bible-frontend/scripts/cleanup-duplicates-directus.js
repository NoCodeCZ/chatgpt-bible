/**
 * Cleanup Duplicates in Directus
 * 
 * This script identifies and removes duplicate entries in:
 * - Categories (by slug)
 * - Subcategories (by slug)
 * - Prompts (by title_th or title_en)
 * 
 * For each duplicate group, it keeps the entry with the most relationships
 * and migrates all relationships to the kept entry before deleting duplicates.
 */

require('dotenv').config({ path: '.env.local' });
const { createDirectus, rest, readItems, updateItem } = require('@directus/sdk');

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

if (!directusUrl) {
  console.error('NEXT_PUBLIC_DIRECTUS_URL environment variable is required');
  process.exit(1);
}

const directus = createDirectus(directusUrl).with(rest());

async function cleanupDuplicates() {
  console.log('🔍 Starting duplicate cleanup...\n');

  // Step 1: Clean up duplicate categories
  console.log('📁 Step 1: Cleaning up duplicate categories...');
  await cleanupCategories();

  // Step 2: Clean up duplicate subcategories
  console.log('\n📁 Step 2: Cleaning up duplicate subcategories...');
  await cleanupSubcategories();

  // Step 3: Clean up duplicate prompts (optional - be careful!)
  // console.log('\n📁 Step 3: Cleaning up duplicate prompts...');
  // await cleanupPrompts();

  console.log('\n✅ Cleanup complete!');
}

async function cleanupCategories() {
  // Fetch all categories
  const categories = await directus.request(
    readItems('categories', {
      fields: ['id', 'name', 'slug', 'name_th', 'name_en'],
    })
  );

  // Group by slug (case-insensitive)
  const slugGroups = {};
  categories.forEach(cat => {
    const slugKey = cat.slug?.toLowerCase() || '';
    if (!slugGroups[slugKey]) {
      slugGroups[slugKey] = [];
    }
    slugGroups[slugKey].push(cat);
  });

  // Find duplicates
  const duplicates = Object.entries(slugGroups).filter(([_, group]) => group.length > 1);
  
  if (duplicates.length === 0) {
    console.log('  ✅ No duplicate categories found');
    return;
  }

  console.log(`  Found ${duplicates.length} duplicate category group(s)`);

  for (const [slug, group] of duplicates) {
    console.log(`  \n  Processing: "${slug}" (${group.length} duplicates)`);
    
    // Get relationship counts for each category
    const relationshipCounts = await Promise.all(
      group.map(async (cat) => {
        const relationships = await directus.request(
          readItems('prompt_categories', {
            filter: { categories_id: { _eq: cat.id } },
            fields: ['id'],
          })
        );
        return { category: cat, count: relationships.length };
      })
    );

    // Sort by relationship count (descending), then by ID (keep oldest)
    relationshipCounts.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.category.id.localeCompare(b.category.id);
    });

    const keepCategory = relationshipCounts[0].category;
    const deleteCategories = relationshipCounts.slice(1);

    console.log(`    Keeping: ${keepCategory.id} (${relationshipCounts[0].count} relationships)`);

    // Migrate relationships from duplicates to kept category
    for (const { category: deleteCat } of deleteCategories) {
      const relationships = await directus.request(
        readItems('prompt_categories', {
          filter: { categories_id: { _eq: deleteCat.id } },
          fields: ['id', 'prompts_id'],
        })
      );

      console.log(`    Migrating ${relationships.length} relationships from ${deleteCat.id}...`);

      for (const rel of relationships) {
        // Check if relationship already exists
        const existing = await directus.request(
          readItems('prompt_categories', {
            filter: {
              prompts_id: { _eq: rel.prompts_id },
              categories_id: { _eq: keepCategory.id },
            },
            fields: ['id'],
          })
        );

        if (existing.length === 0) {
          // Update relationship to point to kept category
          await directus.request(
            updateItem('prompt_categories', rel.id, {
              categories_id: keepCategory.id,
            })
          );
        } else {
          // Relationship already exists, delete duplicate using REST API
          await fetch(`${directusUrl}/items/prompt_categories/${rel.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      // Delete duplicate category using REST API
      const deleteResponse = await fetch(`${directusUrl}/items/categories/${deleteCat.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!deleteResponse.ok) {
        const error = await deleteResponse.json();
        console.log(`    ⚠️  Failed to delete category ${deleteCat.id}:`, error.message || 'Unknown error');
      }
      console.log(`    ✅ Deleted duplicate category: ${deleteCat.id}`);
    }
  }
}

async function cleanupSubcategories() {
  // Fetch all subcategories
  const subcategories = await directus.request(
    readItems('subcategories', {
      fields: ['id', 'name_th', 'name_en', 'slug'],
    })
  );

  // Group by slug
  const slugGroups = {};
  subcategories.forEach(sub => {
    const slugKey = sub.slug?.toLowerCase() || '';
    if (!slugGroups[slugKey]) {
      slugGroups[slugKey] = [];
    }
    slugGroups[slugKey].push(sub);
  });

  // Also group by name_th (for duplicates with different slugs)
  const nameGroups = {};
  subcategories.forEach(sub => {
    const nameKey = sub.name_th?.toLowerCase() || '';
    if (nameKey && nameKey !== '') {
      if (!nameGroups[nameKey]) {
        nameGroups[nameKey] = [];
      }
      nameGroups[nameKey].push(sub);
    }
  });

  // Find duplicates by slug
  const slugDuplicates = Object.entries(slugGroups).filter(([_, group]) => group.length > 1);
  
  // Find duplicates by name_th
  const nameDuplicates = Object.entries(nameGroups).filter(([_, group]) => {
    // Only consider if they have different slugs (true duplicates)
    const slugs = new Set(group.map(g => g.slug?.toLowerCase()));
    return group.length > 1 && slugs.size > 1;
  });

  const allDuplicates = [...slugDuplicates, ...nameDuplicates];
  
  if (allDuplicates.length === 0) {
    console.log('  ✅ No duplicate subcategories found');
    return;
  }

  console.log(`  Found ${allDuplicates.length} duplicate subcategory group(s)`);

  for (const [key, group] of allDuplicates) {
    console.log(`  \n  Processing: "${key}" (${group.length} duplicates)`);
    
    // Get relationship counts for each subcategory
    const relationshipCounts = await Promise.all(
      group.map(async (sub) => {
        const prompts = await directus.request(
          readItems('prompts', {
            filter: { subcategory_id: { _eq: sub.id } },
            fields: ['id'],
          })
        );
        return { subcategory: sub, count: prompts.length };
      })
    );

    // Sort by relationship count (descending), then by ID (keep oldest)
    relationshipCounts.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.subcategory.id - b.subcategory.id;
    });

    const keepSubcategory = relationshipCounts[0].subcategory;
    const deleteSubcategories = relationshipCounts.slice(1);

    console.log(`    Keeping: ${keepSubcategory.id} (${relationshipCounts[0].count} prompts)`);

    // Migrate prompts from duplicates to kept subcategory
    for (const { subcategory: deleteSub } of deleteSubcategories) {
      const prompts = await directus.request(
        readItems('prompts', {
          filter: { subcategory_id: { _eq: deleteSub.id } },
          fields: ['id'],
        })
      );

      console.log(`    Migrating ${prompts.length} prompts from ${deleteSub.id}...`);

      for (const prompt of prompts) {
        await directus.request(
          updateItem('prompts', prompt.id, {
            subcategory_id: keepSubcategory.id,
          })
        );
      }

      // Delete duplicate subcategory using REST API
      const deleteResponse = await fetch(`${directusUrl}/items/subcategories/${deleteSub.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!deleteResponse.ok) {
        const error = await deleteResponse.json();
        console.log(`    ⚠️  Failed to delete subcategory ${deleteSub.id}:`, error.message || 'Unknown error');
      }
      console.log(`    ✅ Deleted duplicate subcategory: ${deleteSub.id}`);
    }
  }
}

// Run cleanup
cleanupDuplicates().catch(console.error);

