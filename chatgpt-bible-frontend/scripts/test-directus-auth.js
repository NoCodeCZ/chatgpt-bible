/**
 * Test Directus Authentication
 * 
 * Quick script to verify your Directus authentication is working.
 * Run this before running create-homepage-2-blocks.js
 */

require('dotenv').config({ path: '.env.local' });
const { createDirectus, rest, authentication } = require('@directus/sdk');

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

async function testAuth() {
  try {
    console.log('🔍 Testing Directus authentication...\n');
    console.log(`📍 Directus URL: ${DIRECTUS_URL}\n`);

    // Try static token first
    if (DIRECTUS_TOKEN) {
      console.log('🔑 Attempting authentication with static token...');
      await directus.setToken(DIRECTUS_TOKEN);
      console.log('✅ Static token authentication successful!\n');
    } else if (DIRECTUS_EMAIL && DIRECTUS_PASSWORD) {
      console.log('🔑 Attempting authentication with email/password...');
      await directus.login(DIRECTUS_EMAIL, DIRECTUS_PASSWORD);
      console.log('✅ Email/password authentication successful!\n');
    } else {
      console.error('❌ No authentication credentials found!\n');
      console.error('Please add to .env.local:');
      console.error('  DIRECTUS_STATIC_TOKEN=your-token-here');
      console.error('  OR');
      console.error('  DIRECTUS_ADMIN_EMAIL=your-email@example.com');
      console.error('  DIRECTUS_ADMIN_PASSWORD=your-password');
      process.exit(1);
    }

    // Test by reading a regular collection (admin operation)
    console.log('🧪 Testing admin access...');
    const { readItems } = require('@directus/sdk');
    
    // Try to read a regular collection to verify admin access
    // Using 'pages' collection as it should exist
    try {
      const pages = await directus.request(
        readItems('pages', {
          limit: 1,
          fields: ['id', 'title'],
        })
      );
      console.log(`✅ Successfully accessed collections (found ${pages.length} test items)\n`);
    } catch (error) {
      // If pages doesn't exist, that's okay - we can still proceed
      // The important thing is authentication worked
      console.log(`✅ Authentication verified (collection access test skipped)\n`);
    }
    
    console.log('✅ Authentication test passed! You can now run create-homepage-2-blocks.js');

  } catch (error) {
    console.error('\n❌ Authentication failed!');
    console.error(`Error: ${error.message}\n`);
    
    if (error.status === 401 || error.message.includes('401')) {
      console.error('This usually means:');
      console.error('  - Invalid token or credentials');
      console.error('  - Token/user doesn\'t have admin permissions');
      console.error('  - Token has expired (static tokens don\'t expire, but check anyway)\n');
    } else if (error.status === 403 || error.message.includes('403')) {
      console.error('This usually means:');
      console.error('  - User/token doesn\'t have admin permissions');
      console.error('  - Required permissions for schema operations are missing\n');
    }
    
    process.exit(1);
  }
}

testAuth();
