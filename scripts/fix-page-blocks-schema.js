#!/usr/bin/env node

/**
 * Fix Page Blocks Schema - pages_id type mismatch
 * This script fixes the UUID -> Integer type mismatch in page_blocks.pages_id
 */

const DIRECTUS_URL = 'https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
};

async function main() {
  console.log(`${colors.yellow}=== Directus Page Blocks Schema Fix ===${colors.reset}\n`);

  // Check for admin token
  const token = process.env.DIRECTUS_ADMIN_TOKEN;
  if (!token) {
    console.error(`${colors.red}Error: DIRECTUS_ADMIN_TOKEN environment variable not set${colors.reset}\n`);
    console.log('Please set your Directus admin token:');
    console.log('  export DIRECTUS_ADMIN_TOKEN="nEFu077kl6uIkJQpfk4u3yL-tV1l3wD3"\n');
    console.log('To get your admin token:');
    console.log('  1. Login to Directus Admin');
    console.log('  2. Go to User Menu → Account Settings');
    console.log('  3. Scroll to "Admin Token" section');
    console.log('  4. Generate a new token if needed\n');
    process.exit(1);
  }

  console.log(`${colors.green}✓${colors.reset} Admin token found\n`);

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    // Step 1: Check for existing data
    console.log('Step 1: Checking for existing page_blocks data...');
    const checkResponse = await fetch(`${DIRECTUS_URL}/items/page_blocks?limit=1`, { headers });
    const checkData = await checkResponse.json();

    if (checkData.data && checkData.data.length > 0) {
      console.error(`${colors.red}✗${colors.reset} Found existing page_blocks data`);
      console.log(`${colors.yellow}Warning: This script will delete the pages_id field${colors.reset}`);
      console.log('Please backup your data first or proceed manually via Directus UI');
      process.exit(1);
    }
    console.log(`${colors.green}✓${colors.reset} No existing data found - safe to proceed\n`);

    // Step 2: Delete old field
    console.log('Step 2: Deleting pages_id field (UUID type)...');
    const deleteResponse = await fetch(`${DIRECTUS_URL}/fields/page_blocks/pages_id`, {
      method: 'DELETE',
      headers,
    });

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json();
      console.error(`${colors.red}✗${colors.reset} Failed to delete field (HTTP ${deleteResponse.status})`);
      console.error('Response:', JSON.stringify(errorData, null, 2));
      console.log('\nIf you see a permissions error, try using the Directus UI instead:');
      console.log('  Settings → Data Model → page_blocks → Delete "pages_id" field');
      process.exit(1);
    }
    console.log(`${colors.green}✓${colors.reset} Field deleted successfully\n`);

    // Wait for database to update
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 3: Create new field
    console.log('Step 3: Creating pages_id field (integer type with M2O relationship)...');
    const createResponse = await fetch(`${DIRECTUS_URL}/fields/page_blocks`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        field: 'pages_id',
        type: 'integer',
        meta: {
          interface: 'select-dropdown-m2o',
          required: true,
          special: ['m2o'],
          hidden: false,
          options: {
            template: '{{id}} - {{title}}'
          },
          display: 'related-values',
          display_options: {
            template: '{{id}} - {{title}}'
          }
        },
        schema: {
          is_nullable: false,
          foreign_key_table: 'pages',
          foreign_key_column: 'id'
        }
      })
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      console.error(`${colors.red}✗${colors.reset} Failed to create field (HTTP ${createResponse.status})`);
      console.error('Response:', JSON.stringify(errorData, null, 2));
      process.exit(1);
    }
    console.log(`${colors.green}✓${colors.reset} Field created successfully\n`);

    // Step 4: Verify
    console.log('Step 4: Verifying the schema...');
    const verifyResponse = await fetch(`${DIRECTUS_URL}/fields/page_blocks/pages_id`, { headers });
    const verifyData = await verifyResponse.json();

    if (verifyData.data?.type === 'integer') {
      console.log(`${colors.green}✓${colors.reset} Schema verified - pages_id is now integer type\n`);
    } else {
      console.log(`${colors.yellow}⚠${colors.reset} Could not verify field type`);
    }

    // Success message
    console.log(`${colors.green}=== Schema Fix Complete ===${colors.reset}\n`);
    console.log('You can now link blocks to pages:\n');
    console.log(`  • Go to: ${DIRECTUS_URL}/admin/content/page_blocks`);
    console.log('  • Click "Create Item"');
    console.log('  • Select a page from the pages_id dropdown');
    console.log('  • Choose block type and item');
    console.log('  • Save\n');
    console.log('Sample blocks ready to use:');
    console.log('  - Hero: 803b6698-52c1-4ec3-a3ed-2ae9d197f1a0');
    console.log('  - Features: c1c3d0fa-2cd7-4f91-811f-2e79e3796400');
    console.log('  - CTA: 54f4dbbf-670b-440f-bfbc-6a942ea5a6ac');
    console.log('  - Rich Text: 0e463d8c-3382-4e7e-914b-e83edf38854c\n');

  } catch (error) {
    console.error(`${colors.red}✗${colors.reset} Unexpected error:`, error.message);
    process.exit(1);
  }
}

main();
