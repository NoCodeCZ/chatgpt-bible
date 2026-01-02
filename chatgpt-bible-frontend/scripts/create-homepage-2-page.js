/**
 * Create Homepage 2 Page and Link Blocks
 * 
 * Creates a page in Directus with permalink "/homepage-2" and links
 * all three blocks (Pain Points, Timeline, Registration) to it.
 * 
 * Usage:
 *   node scripts/create-homepage-2-page.js
 */

require('dotenv').config({ path: '.env.local' });
const { createDirectus, rest, authentication, createItems, readItems } = require('@directus/sdk');

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || process.env.directus_token || process.env.DIRECTUS_STATIC_TOKEN;
const DIRECTUS_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const DIRECTUS_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;

if (!DIRECTUS_URL) {
  console.error('❌ Error: NEXT_PUBLIC_DIRECTUS_URL not found in .env.local');
  process.exit(1);
}

const directus = createDirectus(DIRECTUS_URL).with(rest()).with(authentication('json'));

async function authenticate() {
  if (DIRECTUS_TOKEN) {
    await directus.setToken(DIRECTUS_TOKEN);
    console.log('✅ Authenticated using token');
  } else if (DIRECTUS_EMAIL && DIRECTUS_PASSWORD) {
    await directus.login(DIRECTUS_EMAIL, DIRECTUS_PASSWORD);
    console.log('✅ Authenticated using email/password');
  } else {
    console.error('❌ Error: No authentication method found');
    process.exit(1);
  }
}

async function createHomepage2Page() {
  try {
    console.log('🚀 Creating Homepage 2 page and linking blocks...\n');
    
    await authenticate();

    // 1. Check if page already exists
    console.log('🔍 Checking if page already exists...');
    const existingPages = await directus.request(
      readItems('pages', {
        filter: {
          permalink: { _eq: '/homepage-2' },
        },
        fields: ['id', 'title', 'permalink', 'status'],
        limit: 1,
      })
    );

    let pageId;
    if (existingPages && existingPages.length > 0) {
      console.log(`   ⚠️  Page already exists with ID: ${existingPages[0].id}`);
      pageId = existingPages[0].id;
      console.log('   ℹ️  Will link blocks to existing page\n');
    } else {
      // 2. Create the page
      console.log('📝 Creating new page...');
      const pageData = {
        title: 'Homepage 2 - Ultimate AIGC Affiliate System',
        permalink: '/homepage-2',
        page_type: 'landing',
        status: 'published',
        seo_title: 'Ultimate AIGC Affiliate System - สร้างรายได้ด้วย AI',
        seo_description: 'ทำ Affiliate ไม่ออกกล้อง ไม่ซื้อสินค้า ไม่ต้องมี Follower แต่ได้ค่าคอม 400-900 บาทต่อวัน ด้วยคลิป AI',
      };

      const pageResult = await directus.request(
        createItems('pages', [pageData])
      );
      pageId = pageResult[0].id;
      console.log(`   ✅ Created page with ID: ${pageId}\n`);
    }

    // 3. Get block IDs
    console.log('🔍 Finding blocks...');
    
    const painPointsBlocks = await directus.request(
      readItems('block_pain_points', {
        filter: { status: { _eq: 'published' } },
        fields: ['id'],
        limit: 1,
        sort: ['-date_created'],
      })
    );

    const timelineBlocks = await directus.request(
      readItems('block_timeline', {
        filter: { status: { _eq: 'published' } },
        fields: ['id'],
        limit: 1,
        sort: ['-date_created'],
      })
    );

    const registrationBlocks = await directus.request(
      readItems('block_registration', {
        filter: { status: { _eq: 'published' } },
        fields: ['id'],
        limit: 1,
        sort: ['-date_created'],
      })
    );

    if (!painPointsBlocks || painPointsBlocks.length === 0) {
      throw new Error('Pain Points block not found. Run populate-homepage-2-content.js first.');
    }
    if (!timelineBlocks || timelineBlocks.length === 0) {
      throw new Error('Timeline block not found. Run populate-homepage-2-content.js first.');
    }
    if (!registrationBlocks || registrationBlocks.length === 0) {
      throw new Error('Registration block not found. Run populate-homepage-2-content.js first.');
    }

    const painPointsId = painPointsBlocks[0].id;
    const timelineId = timelineBlocks[0].id;
    const registrationId = registrationBlocks[0].id;

    console.log(`   ✅ Found Pain Points block: ${painPointsId}`);
    console.log(`   ✅ Found Timeline block: ${timelineId}`);
    console.log(`   ✅ Found Registration block: ${registrationId}\n`);

    // 4. Check existing page_blocks links
    console.log('🔍 Checking existing block links...');
    const existingBlocks = await directus.request(
      readItems('page_blocks', {
        filter: {
          pages_id: { _eq: pageId },
        },
        fields: ['id', 'collection', 'item', 'sort'],
      })
    );

    const existingLinks = new Map();
    existingBlocks.forEach(block => {
      const key = `${block.collection}-${block.item}`;
      existingLinks.set(key, block);
    });

    // 5. Create page_blocks entries
    console.log('📝 Creating page_blocks links...');
    const pageBlocksToCreate = [];

    const painPointsKey = `block_pain_points-${painPointsId}`;
    if (!existingLinks.has(painPointsKey)) {
      pageBlocksToCreate.push({
        pages_id: pageId,
        collection: 'block_pain_points',
        item: painPointsId,
        sort: 1,
        hide_block: false,
      });
    } else {
      console.log(`   ⚠️  Pain Points block already linked (sort: ${existingLinks.get(painPointsKey).sort})`);
    }

    const timelineKey = `block_timeline-${timelineId}`;
    if (!existingLinks.has(timelineKey)) {
      pageBlocksToCreate.push({
        pages_id: pageId,
        collection: 'block_timeline',
        item: timelineId,
        sort: 2,
        hide_block: false,
      });
    } else {
      console.log(`   ⚠️  Timeline block already linked (sort: ${existingLinks.get(timelineKey).sort})`);
    }

    const registrationKey = `block_registration-${registrationId}`;
    if (!existingLinks.has(registrationKey)) {
      pageBlocksToCreate.push({
        pages_id: pageId,
        collection: 'block_registration',
        item: registrationId,
        sort: 3,
        hide_block: false,
      });
    } else {
      console.log(`   ⚠️  Registration block already linked (sort: ${existingLinks.get(registrationKey).sort})`);
    }

    if (pageBlocksToCreate.length > 0) {
      const pageBlocksResult = await directus.request(
        createItems('page_blocks', pageBlocksToCreate)
      );
      console.log(`   ✅ Created ${pageBlocksToCreate.length} block link(s)\n`);
    } else {
      console.log('   ✅ All blocks already linked\n');
    }

    console.log('✅ Homepage 2 setup complete!\n');
    console.log('📋 Summary:');
    console.log(`   • Page ID: ${pageId}`);
    console.log(`   • Permalink: /homepage-2`);
    console.log(`   • Status: published`);
    console.log(`   • Blocks linked: 3\n`);
    console.log('🌐 Access the page at:');
    console.log(`   http://localhost:3000/homepage-2`);
    console.log(`   (or your production URL)\n`);

  } catch (error) {
    console.error('\n❌ Error creating homepage 2 page:');
    console.error(error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response, null, 2));
    }
    process.exit(1);
  }
}

createHomepage2Page();
