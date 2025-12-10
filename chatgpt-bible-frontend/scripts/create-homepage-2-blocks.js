/**
 * Create Homepage 2 Block Collections
 * 
 * Creates three new Directus collections for Homepage 2:
 * - block_pain_points
 * - block_timeline
 * - block_registration
 * 
 * Also updates page_blocks collection to include new block types.
 * 
 * Usage:
 *   node scripts/create-homepage-2-blocks.js
 * 
 * Required Environment Variables (.env.local):
 *   NEXT_PUBLIC_DIRECTUS_URL - Your Directus instance URL
 *   DIRECTUS_TOKEN or directus_token or DIRECTUS_STATIC_TOKEN - Admin token (preferred)
 *   OR
 *   DIRECTUS_ADMIN_EMAIL - Admin email
 *   DIRECTUS_ADMIN_PASSWORD - Admin password
 * 
 * The script is idempotent - it will skip collections/fields that already exist.
 */

require('dotenv').config({ path: '.env.local' });
const { createDirectus, rest, authentication, createCollection, createField, createRelation, readField, updateField } = require('@directus/sdk');

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
// Try multiple possible token variable names
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || process.env.directus_token || process.env.DIRECTUS_STATIC_TOKEN;
const DIRECTUS_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const DIRECTUS_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;

if (!DIRECTUS_URL) {
  console.error('❌ Error: NEXT_PUBLIC_DIRECTUS_URL not found in .env.local');
  process.exit(1);
}

const directus = createDirectus(DIRECTUS_URL).with(rest()).with(authentication('json'));

// Authenticate - prefer static token, fallback to email/password
async function authenticate() {
  if (DIRECTUS_TOKEN) {
    await directus.setToken(DIRECTUS_TOKEN);
    console.log('✅ Authenticated using static token');
  } else if (DIRECTUS_EMAIL && DIRECTUS_PASSWORD) {
    await directus.login(DIRECTUS_EMAIL, DIRECTUS_PASSWORD);
    console.log('✅ Authenticated using email/password');
  } else {
    console.error('❌ Error: No authentication method found. Set either DIRECTUS_STATIC_TOKEN or DIRECTUS_ADMIN_EMAIL/PASSWORD');
    process.exit(1);
  }
}

async function createCollections() {
  try {
    console.log('🚀 Starting Homepage 2 block collections creation...\n');
    
    // Authenticate first
    await authenticate();

    // Step 1: Create block_pain_points collection
    console.log('📦 Creating block_pain_points collection...');
    await createBlockPainPoints();

    // Step 2: Create block_timeline collection
    console.log('\n📦 Creating block_timeline collection...');
    await createBlockTimeline();

    // Step 3: Create block_registration collection
    console.log('\n📦 Creating block_registration collection...');
    await createBlockRegistration();

    // Step 4: Update page_blocks collection field
    console.log('\n📦 Updating page_blocks.collection field...');
    await updatePageBlocksField();

    console.log('\n✅ All collections created successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Set up permissions in Directus Admin UI');
    console.log('   2. Create TypeScript types');
    console.log('   3. Create service functions');
    console.log('   4. Create React components');

  } catch (error) {
    console.error('\n❌ Error creating collections:');
    console.error(error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response, null, 2));
    }
    process.exit(1);
  }
}

async function createBlockPainPoints() {
  // Create collection
  try {
    await directus.request(
      createCollection({
        collection: 'block_pain_points',
        meta: {
          collection: 'block_pain_points',
          icon: 'sentiment_dissatisfied',
          note: 'Pain points section highlighting user problems',
          display_template: '{{heading}}',
          hidden: false,
          singleton: false,
          translations: null,
          archive_field: 'status',
          archive_app_filter: true,
          archive_value: 'archived',
          unarchive_value: 'draft',
          sort_field: null,
          accountability: 'all',
          group: 'Blocks',
        },
        schema: {
          name: 'block_pain_points',
        },
      })
    );
    console.log('   ✅ Collection created');
  } catch (error) {
    if (error.message && error.message.includes('already exists')) {
      console.log('   ⚠️  Collection already exists, skipping creation');
    } else {
      throw error;
    }
  }

  // Create fields
  const fields = [
    // Primary key
    {
      field: 'id',
      type: 'uuid',
      meta: {
        hidden: true,
        readonly: true,
        interface: 'input',
        special: ['uuid'],
      },
      schema: {
        is_primary_key: true,
        length: 36,
        has_auto_increment: false,
      },
    },
    // heading
    {
      field: 'heading',
      type: 'string',
      meta: {
        interface: 'input',
        width: 'full',
        note: 'Main heading for the pain points section',
      },
      schema: {
        max_length: 255,
        is_nullable: true,
      },
    },
    // description
    {
      field: 'description',
      type: 'text',
      meta: {
        interface: 'input-multiline',
        width: 'full',
        note: 'Supporting text below the heading',
      },
      schema: {
        is_nullable: true,
      },
    },
    // pain_points (JSON)
    {
      field: 'pain_points',
      type: 'json',
      meta: {
        interface: 'list',
        width: 'full',
        note: 'Array of pain point items',
        special: ['cast-json'],
        required: true,
        options: {
          fields: [
            {
              field: 'icon',
              type: 'string',
              name: 'Icon',
              meta: {
                interface: 'input',
                width: 'half',
              },
              schema: {
                max_length: 100,
              },
            },
            {
              field: 'title',
              type: 'string',
              name: 'Title',
              meta: {
                interface: 'input',
                width: 'half',
                required: true,
              },
              schema: {
                max_length: 255,
              },
            },
            {
              field: 'description',
              type: 'text',
              name: 'Description',
              meta: {
                interface: 'input-multiline',
                width: 'full',
                required: true,
              },
            },
          ],
        },
      },
      schema: {
        is_nullable: false,
      },
    },
    // transition_text
    {
      field: 'transition_text',
      type: 'text',
      meta: {
        interface: 'input-multiline',
        width: 'full',
        note: "Text shown in the special transition card (e.g., 'แต่ถ้าบอกว่า...')",
      },
      schema: {
        is_nullable: true,
      },
    },
    // theme
    {
      field: 'theme',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        width: 'half',
        options: {
          choices: [
            { text: 'Light', value: 'light' },
            { text: 'Dark', value: 'dark' },
          ],
        },
      },
      schema: {
        default_value: 'dark',
        is_nullable: true,
        max_length: 50,
      },
    },
    // status
    {
      field: 'status',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        width: 'half',
        required: true,
        display: 'labels',
        display_options: {
          showAsDot: true,
          choices: [
            {
              text: 'Draft',
              value: 'draft',
              foreground: 'var(--theme--foreground)',
              background: 'var(--theme--background-normal)',
            },
            {
              text: 'Published',
              value: 'published',
              foreground: 'var(--theme--primary)',
              background: 'var(--theme--primary-background)',
            },
            {
              text: 'Archived',
              value: 'archived',
              foreground: 'var(--theme--warning)',
              background: 'var(--theme--warning-background)',
            },
          ],
        },
        options: {
          choices: [
            { text: 'Draft', value: 'draft' },
            { text: 'Published', value: 'published' },
            { text: 'Archived', value: 'archived' },
          ],
        },
      },
      schema: {
        default_value: 'draft',
        is_nullable: false,
        max_length: 50,
      },
    },
    // System fields
    {
      field: 'date_created',
      type: 'timestamp',
      meta: {
        special: ['date-created'],
        interface: 'datetime',
        readonly: true,
        hidden: true,
        width: 'half',
      },
      schema: {},
    },
    {
      field: 'date_updated',
      type: 'timestamp',
      meta: {
        special: ['date-updated'],
        interface: 'datetime',
        readonly: true,
        hidden: true,
        width: 'half',
      },
      schema: {},
    },
    {
      field: 'user_created',
      type: 'uuid',
      meta: {
        special: ['user-created'],
        interface: 'select-dropdown-m2o',
        display: 'user',
        display_options: {
          template: '{{first_name}} {{last_name}}',
        },
        readonly: true,
        hidden: true,
        width: 'half',
      },
      schema: {},
    },
    {
      field: 'user_updated',
      type: 'uuid',
      meta: {
        special: ['user-updated'],
        interface: 'select-dropdown-m2o',
        display: 'user',
        display_options: {
          template: '{{first_name}} {{last_name}}',
        },
        readonly: true,
        hidden: true,
        width: 'half',
      },
      schema: {},
    },
  ];

  for (const field of fields) {
    try {
      await directus.request(
        createField('block_pain_points', {
          field: field.field,
          type: field.type,
          schema: field.schema,
          meta: field.meta,
        })
      );
    } catch (error) {
      if (error.message && error.message.includes('already exists')) {
        console.log(`   ⚠️  Field ${field.field} already exists, skipping`);
      } else {
        console.error(`   ❌ Error creating field ${field.field}:`, error.message);
        throw error;
      }
    }
  }

  // Create relations for user fields
  try {
    await directus.request(
      createRelation({
        collection: 'block_pain_points',
        field: 'user_created',
        related_collection: 'directus_users',
        schema: {
          on_delete: 'SET NULL',
        },
      })
    );
  } catch (error) {
    if (!error.message || !error.message.includes('already exists')) {
      console.error('   ⚠️  Error creating user_created relation:', error.message);
    }
  }

  try {
    await directus.request(
      createRelation({
        collection: 'block_pain_points',
        field: 'user_updated',
        related_collection: 'directus_users',
        schema: {
          on_delete: 'SET NULL',
        },
      })
    );
  } catch (error) {
    if (!error.message || !error.message.includes('already exists')) {
      console.error('   ⚠️  Error creating user_updated relation:', error.message);
    }
  }

  console.log('   ✅ block_pain_points collection created with all fields');
}

async function createBlockTimeline() {
  // Create collection
  try {
    await directus.request(
      createCollection({
        collection: 'block_timeline',
        meta: {
          collection: 'block_timeline',
          icon: 'timeline',
          note: 'Timeline section with color-coded items and price anchor',
          display_template: '{{heading}}',
          hidden: false,
          singleton: false,
          translations: null,
          archive_field: 'status',
          archive_app_filter: true,
          archive_value: 'archived',
          unarchive_value: 'draft',
          sort_field: null,
          accountability: 'all',
          group: 'Blocks',
        },
        schema: {
          name: 'block_timeline',
        },
      })
    );
    console.log('   ✅ Collection created');
  } catch (error) {
    if (error.message && error.message.includes('already exists')) {
      console.log('   ⚠️  Collection already exists, skipping creation');
    } else {
      throw error;
    }
  }

  // Create fields
  const fields = [
    // Primary key
    {
      field: 'id',
      type: 'uuid',
      meta: {
        hidden: true,
        readonly: true,
        interface: 'input',
        special: ['uuid'],
      },
      schema: {
        is_primary_key: true,
        length: 36,
        has_auto_increment: false,
      },
    },
    // heading
    {
      field: 'heading',
      type: 'string',
      meta: {
        interface: 'input',
        width: 'full',
        note: 'Main heading for the timeline section',
      },
      schema: {
        max_length: 255,
        is_nullable: true,
      },
    },
    // description
    {
      field: 'description',
      type: 'text',
      meta: {
        interface: 'input-multiline',
        width: 'full',
        note: 'Supporting text below the heading',
      },
      schema: {
        is_nullable: true,
      },
    },
    // timeline_items (JSON)
    {
      field: 'timeline_items',
      type: 'json',
      meta: {
        interface: 'list',
        width: 'full',
        note: 'Array of timeline items',
        special: ['cast-json'],
        required: true,
        options: {
          fields: [
            {
              field: 'year',
              type: 'string',
              name: 'Year',
              meta: {
                interface: 'input',
                width: 'half',
                required: true,
              },
              schema: {
                max_length: 50,
              },
            },
            {
              field: 'title',
              type: 'string',
              name: 'Title',
              meta: {
                interface: 'input',
                width: 'half',
                required: true,
              },
              schema: {
                max_length: 255,
              },
            },
            {
              field: 'description',
              type: 'text',
              name: 'Description',
              meta: {
                interface: 'input-multiline',
                width: 'full',
                required: true,
              },
            },
            {
              field: 'color',
              type: 'string',
              name: 'Color',
              meta: {
                interface: 'select-dropdown',
                width: 'half',
                options: {
                  choices: [
                    { text: 'Red', value: 'red' },
                    { text: 'Amber', value: 'amber' },
                    { text: 'Emerald', value: 'emerald' },
                  ],
                },
              },
              schema: {
                max_length: 50,
              },
            },
          ],
        },
      },
      schema: {
        is_nullable: false,
      },
    },
    // price_anchor_text
    {
      field: 'price_anchor_text',
      type: 'text',
      meta: {
        interface: 'input-multiline',
        width: 'full',
        note: 'Text above the price anchor section',
      },
      schema: {
        is_nullable: true,
      },
    },
    // price_anchor_time
    {
      field: 'price_anchor_time',
      type: 'string',
      meta: {
        interface: 'input',
        width: 'half',
        note: "Time value (e.g., '2 ปี')",
      },
      schema: {
        max_length: 50,
        is_nullable: true,
      },
    },
    // price_anchor_cost
    {
      field: 'price_anchor_cost',
      type: 'string',
      meta: {
        interface: 'input',
        width: 'half',
        note: "Cost value (e.g., '500,000 บาท')",
      },
      schema: {
        max_length: 50,
        is_nullable: true,
      },
    },
    // theme
    {
      field: 'theme',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        width: 'half',
        options: {
          choices: [
            { text: 'Light', value: 'light' },
            { text: 'Dark', value: 'dark' },
          ],
        },
      },
      schema: {
        default_value: 'dark',
        is_nullable: true,
        max_length: 50,
      },
    },
    // status
    {
      field: 'status',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        width: 'half',
        required: true,
        display: 'labels',
        display_options: {
          showAsDot: true,
          choices: [
            {
              text: 'Draft',
              value: 'draft',
              foreground: 'var(--theme--foreground)',
              background: 'var(--theme--background-normal)',
            },
            {
              text: 'Published',
              value: 'published',
              foreground: 'var(--theme--primary)',
              background: 'var(--theme--primary-background)',
            },
            {
              text: 'Archived',
              value: 'archived',
              foreground: 'var(--theme--warning)',
              background: 'var(--theme--warning-background)',
            },
          ],
        },
        options: {
          choices: [
            { text: 'Draft', value: 'draft' },
            { text: 'Published', value: 'published' },
            { text: 'Archived', value: 'archived' },
          ],
        },
      },
      schema: {
        default_value: 'draft',
        is_nullable: false,
        max_length: 50,
      },
    },
    // System fields
    {
      field: 'date_created',
      type: 'timestamp',
      meta: {
        special: ['date-created'],
        interface: 'datetime',
        readonly: true,
        hidden: true,
        width: 'half',
      },
      schema: {},
    },
    {
      field: 'date_updated',
      type: 'timestamp',
      meta: {
        special: ['date-updated'],
        interface: 'datetime',
        readonly: true,
        hidden: true,
        width: 'half',
      },
      schema: {},
    },
    {
      field: 'user_created',
      type: 'uuid',
      meta: {
        special: ['user-created'],
        interface: 'select-dropdown-m2o',
        display: 'user',
        display_options: {
          template: '{{first_name}} {{last_name}}',
        },
        readonly: true,
        hidden: true,
        width: 'half',
      },
      schema: {},
    },
    {
      field: 'user_updated',
      type: 'uuid',
      meta: {
        special: ['user-updated'],
        interface: 'select-dropdown-m2o',
        display: 'user',
        display_options: {
          template: '{{first_name}} {{last_name}}',
        },
        readonly: true,
        hidden: true,
        width: 'half',
      },
      schema: {},
    },
  ];

  for (const field of fields) {
    try {
      await directus.request(
        createField('block_timeline', {
          field: field.field,
          type: field.type,
          schema: field.schema,
          meta: field.meta,
        })
      );
    } catch (error) {
      if (error.message && error.message.includes('already exists')) {
        console.log(`   ⚠️  Field ${field.field} already exists, skipping`);
      } else {
        console.error(`   ❌ Error creating field ${field.field}:`, error.message);
        throw error;
      }
    }
  }

  // Create relations for user fields
  try {
    await directus.request(
      createRelation({
        collection: 'block_timeline',
        field: 'user_created',
        related_collection: 'directus_users',
        schema: {
          on_delete: 'SET NULL',
        },
      })
    );
  } catch (error) {
    if (!error.message || !error.message.includes('already exists')) {
      console.error('   ⚠️  Error creating user_created relation:', error.message);
    }
  }

  try {
    await directus.request(
      createRelation({
        collection: 'block_timeline',
        field: 'user_updated',
        related_collection: 'directus_users',
        schema: {
          on_delete: 'SET NULL',
        },
      })
    );
  } catch (error) {
    if (!error.message || !error.message.includes('already exists')) {
      console.error('   ⚠️  Error creating user_updated relation:', error.message);
    }
  }

  console.log('   ✅ block_timeline collection created with all fields');
}

async function createBlockRegistration() {
  // Create collection
  try {
    await directus.request(
      createCollection({
        collection: 'block_registration',
        meta: {
          collection: 'block_registration',
          icon: 'person_add',
          note: 'Line registration block with QR code, steps, and bonuses',
          display_template: '{{heading}}',
          hidden: false,
          singleton: false,
          translations: null,
          archive_field: 'status',
          archive_app_filter: true,
          archive_value: 'archived',
          unarchive_value: 'draft',
          sort_field: null,
          accountability: 'all',
          group: 'Blocks',
        },
        schema: {
          name: 'block_registration',
        },
      })
    );
    console.log('   ✅ Collection created');
  } catch (error) {
    if (error.message && error.message.includes('already exists')) {
      console.log('   ⚠️  Collection already exists, skipping creation');
    } else {
      throw error;
    }
  }

  // Create fields
  const fields = [
    // Primary key
    {
      field: 'id',
      type: 'uuid',
      meta: {
        hidden: true,
        readonly: true,
        interface: 'input',
        special: ['uuid'],
      },
      schema: {
        is_primary_key: true,
        length: 36,
        has_auto_increment: false,
      },
    },
    // heading
    {
      field: 'heading',
      type: 'string',
      meta: {
        interface: 'input',
        width: 'full',
        note: 'Main heading for the registration section',
      },
      schema: {
        max_length: 255,
        is_nullable: true,
      },
    },
    // description
    {
      field: 'description',
      type: 'text',
      meta: {
        interface: 'input-multiline',
        width: 'full',
        note: 'Supporting text below the heading',
      },
      schema: {
        is_nullable: true,
      },
    },
    // steps (JSON)
    {
      field: 'steps',
      type: 'json',
      meta: {
        interface: 'list',
        width: 'full',
        note: 'Registration steps (usually 3 steps)',
        special: ['cast-json'],
        required: false,
        options: {
          fields: [
            {
              field: 'number',
              type: 'integer',
              name: 'Number',
              meta: {
                interface: 'input',
                width: 'half',
                required: true,
              },
              schema: {},
            },
            {
              field: 'title',
              type: 'string',
              name: 'Title',
              meta: {
                interface: 'input',
                width: 'half',
                required: true,
              },
              schema: {
                max_length: 255,
              },
            },
            {
              field: 'description',
              type: 'text',
              name: 'Description',
              meta: {
                interface: 'input-multiline',
                width: 'full',
                required: true,
              },
            },
          ],
        },
      },
      schema: {
        is_nullable: true,
      },
    },
    // line_id
    {
      field: 'line_id',
      type: 'string',
      meta: {
        interface: 'input',
        width: 'half',
        note: "Line ID (without @ symbol, e.g., 'chatgpt-bible')",
      },
      schema: {
        max_length: 50,
        is_nullable: true,
      },
    },
    // line_qr_code (File)
    {
      field: 'line_qr_code',
      type: 'uuid',
      meta: {
        interface: 'file-image',
        width: 'half',
        note: 'QR code image for Line registration',
        special: ['file'],
      },
      schema: {
        is_nullable: true,
        foreign_key_table: 'directus_files',
        foreign_key_column: 'id',
      },
    },
    // line_url
    {
      field: 'line_url',
      type: 'string',
      meta: {
        interface: 'input',
        width: 'full',
        note: "Line URL for direct link (e.g., 'https://line.me/R/ti/p/@chatgpt-bible')",
      },
      schema: {
        max_length: 255,
        is_nullable: true,
      },
    },
    // bonuses (JSON)
    {
      field: 'bonuses',
      type: 'json',
      meta: {
        interface: 'list',
        width: 'full',
        note: 'Bonus items shown below registration',
        special: ['cast-json'],
        required: false,
        options: {
          fields: [
            {
              field: 'icon',
              type: 'string',
              name: 'Icon',
              meta: {
                interface: 'input',
                width: 'half',
              },
              schema: {
                max_length: 100,
              },
            },
            {
              field: 'title',
              type: 'string',
              name: 'Title',
              meta: {
                interface: 'input',
                width: 'half',
                required: true,
              },
              schema: {
                max_length: 255,
              },
            },
            {
              field: 'value',
              type: 'string',
              name: 'Value',
              meta: {
                interface: 'input',
                width: 'full',
                required: true,
              },
              schema: {
                max_length: 255,
              },
            },
          ],
        },
      },
      schema: {
        is_nullable: true,
      },
    },
    // future_pacing_text
    {
      field: 'future_pacing_text',
      type: 'text',
      meta: {
        interface: 'input-multiline',
        width: 'full',
        note: 'Future pacing text shown at the bottom',
      },
      schema: {
        is_nullable: true,
      },
    },
    // theme
    {
      field: 'theme',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        width: 'half',
        options: {
          choices: [
            { text: 'Light', value: 'light' },
            { text: 'Dark', value: 'dark' },
          ],
        },
      },
      schema: {
        default_value: 'dark',
        is_nullable: true,
        max_length: 50,
      },
    },
    // status
    {
      field: 'status',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        width: 'half',
        required: true,
        display: 'labels',
        display_options: {
          showAsDot: true,
          choices: [
            {
              text: 'Draft',
              value: 'draft',
              foreground: 'var(--theme--foreground)',
              background: 'var(--theme--background-normal)',
            },
            {
              text: 'Published',
              value: 'published',
              foreground: 'var(--theme--primary)',
              background: 'var(--theme--primary-background)',
            },
            {
              text: 'Archived',
              value: 'archived',
              foreground: 'var(--theme--warning)',
              background: 'var(--theme--warning-background)',
            },
          ],
        },
        options: {
          choices: [
            { text: 'Draft', value: 'draft' },
            { text: 'Published', value: 'published' },
            { text: 'Archived', value: 'archived' },
          ],
        },
      },
      schema: {
        default_value: 'draft',
        is_nullable: false,
        max_length: 50,
      },
    },
    // System fields
    {
      field: 'date_created',
      type: 'timestamp',
      meta: {
        special: ['date-created'],
        interface: 'datetime',
        readonly: true,
        hidden: true,
        width: 'half',
      },
      schema: {},
    },
    {
      field: 'date_updated',
      type: 'timestamp',
      meta: {
        special: ['date-updated'],
        interface: 'datetime',
        readonly: true,
        hidden: true,
        width: 'half',
      },
      schema: {},
    },
    {
      field: 'user_created',
      type: 'uuid',
      meta: {
        special: ['user-created'],
        interface: 'select-dropdown-m2o',
        display: 'user',
        display_options: {
          template: '{{first_name}} {{last_name}}',
        },
        readonly: true,
        hidden: true,
        width: 'half',
      },
      schema: {},
    },
    {
      field: 'user_updated',
      type: 'uuid',
      meta: {
        special: ['user-updated'],
        interface: 'select-dropdown-m2o',
        display: 'user',
        display_options: {
          template: '{{first_name}} {{last_name}}',
        },
        readonly: true,
        hidden: true,
        width: 'half',
      },
      schema: {},
    },
  ];

  for (const field of fields) {
    try {
      await directus.request(
        createField('block_registration', {
          field: field.field,
          type: field.type,
          schema: field.schema,
          meta: field.meta,
        })
      );
    } catch (error) {
      if (error.message && error.message.includes('already exists')) {
        console.log(`   ⚠️  Field ${field.field} already exists, skipping`);
      } else {
        console.error(`   ❌ Error creating field ${field.field}:`, error.message);
        throw error;
      }
    }
  }

  // Create relations
  try {
    await directus.request(
      createRelation({
        collection: 'block_registration',
        field: 'user_created',
        related_collection: 'directus_users',
        schema: {
          on_delete: 'SET NULL',
        },
      })
    );
  } catch (error) {
    if (!error.message || !error.message.includes('already exists')) {
      console.error('   ⚠️  Error creating user_created relation:', error.message);
    }
  }

  try {
    await directus.request(
      createRelation({
        collection: 'block_registration',
        field: 'user_updated',
        related_collection: 'directus_users',
        schema: {
          on_delete: 'SET NULL',
        },
      })
    );
  } catch (error) {
    if (!error.message || !error.message.includes('already exists')) {
      console.error('   ⚠️  Error creating user_updated relation:', error.message);
    }
  }

  try {
    await directus.request(
      createRelation({
        collection: 'block_registration',
        field: 'line_qr_code',
        related_collection: 'directus_files',
        schema: {
          on_delete: 'SET NULL',
        },
      })
    );
  } catch (error) {
    if (!error.message || !error.message.includes('already exists')) {
      console.error('   ⚠️  Error creating line_qr_code relation:', error.message);
    }
  }

  console.log('   ✅ block_registration collection created with all fields');
}

async function updatePageBlocksField() {
  // Read current field definition
  const field = await directus.request(
    readField('page_blocks', 'collection')
  );

  // Update choices to include new block types
  const currentChoices = field.meta?.options?.choices || [];
  const newChoices = [
    ...currentChoices,
    { text: 'Pain Points', value: 'block_pain_points' },
    { text: 'Timeline', value: 'block_timeline' },
    { text: 'Registration', value: 'block_registration' },
  ];

  // Remove duplicates
  const uniqueChoices = Array.from(
    new Map(newChoices.map(c => [c.value, c])).values()
  );

  await directus.request(
    updateField('page_blocks', 'collection', {
      meta: {
        ...field.meta,
        options: {
          ...field.meta?.options,
          choices: uniqueChoices,
        },
      },
    })
  );

  console.log('   ✅ page_blocks.collection field updated with new block types');
}

// Run the script
createCollections();
