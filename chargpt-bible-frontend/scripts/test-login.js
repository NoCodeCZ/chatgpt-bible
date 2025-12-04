#!/usr/bin/env node

/**
 * Test Directus Login
 * 
 * This script tests if you can log into Directus with your credentials.
 * Useful for debugging authentication issues.
 * 
 * Usage:
 *   node scripts/test-login.js <email> <password>
 */

// Load environment variables
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not installed, use process.env directly
}

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

/**
 * Test login to Directus
 */
async function testLogin(email, password) {
  console.log(`${colors.blue}=== Testing Directus Login ===${colors.reset}\n`);

  // Check environment variables
  if (!DIRECTUS_URL) {
    console.error(`${colors.red}Error: NEXT_PUBLIC_DIRECTUS_URL environment variable is required${colors.reset}\n`);
    process.exit(1);
  }

  if (!email || !password) {
    console.error(`${colors.red}Error: Email and password are required${colors.reset}\n`);
    console.log('Usage: node scripts/test-login.js <email> <password>');
    process.exit(1);
  }

  try {
    console.log(`${colors.yellow}→${colors.reset} Attempting login to: ${DIRECTUS_URL}`);
    console.log(`   Email: ${email}\n`);

    // Try to login
    const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    console.log(`${colors.yellow}→${colors.reset} Response status: ${response.status} ${response.statusText}\n`);

    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.errors?.[0]?.message || error.message || 'Unknown error';
      
      console.error(`${colors.red}✗${colors.reset} Login failed!\n`);
      console.error(`${colors.red}Error:${colors.reset} ${errorMessage}\n`);
      
      // Common error messages and solutions
      if (errorMessage.includes('Invalid user credentials')) {
        console.log(`${colors.yellow}Possible solutions:${colors.reset}`);
        console.log('  1. Check if your email and password are correct');
        console.log('  2. Make sure the user exists in Directus');
        console.log('  3. Check if the user account is active (not suspended or archived)\n');
      } else if (errorMessage.includes('status') || errorMessage.includes('suspended')) {
        console.log(`${colors.yellow}Possible solutions:${colors.reset}`);
        console.log('  1. Check user status in Directus Admin UI');
        console.log('  2. User might be suspended - activate it in Directus\n');
      }
      
      process.exit(1);
    }

    const data = await response.json();
    const authData = data.data;

    console.log(`${colors.green}✓${colors.reset} Login successful!\n`);
    console.log(`${colors.green}Authentication Details:${colors.reset}`);
    console.log(`  Access Token: ${authData.access_token.substring(0, 20)}...`);
    console.log(`  Expires: ${authData.expires}ms (${Math.round(authData.expires / 1000 / 60)} minutes)\n`);

    // Try to get user info
    console.log(`${colors.yellow}→${colors.reset} Fetching user information...`);
    const userResponse = await fetch(`${DIRECTUS_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${authData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      console.error(`${colors.yellow}⚠${colors.reset} Could not fetch user info (this is okay, login still works)\n`);
    } else {
      const userData = await userResponse.json();
      const user = userData.data;
      
      console.log(`${colors.green}✓${colors.reset} User information retrieved:\n`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Name: ${user.first_name || 'N/A'} ${user.last_name || ''}`.trim());
      console.log(`  Status: ${user.status}`);
      console.log(`  Role: ${user.role || 'N/A'}`);
      console.log(`  Subscription: ${user.subscription_status || 'N/A'}\n`);
    }

    console.log(`${colors.green}✓${colors.reset} Your credentials work! You should be able to log into the app.\n`);
    console.log(`${colors.blue}Next Steps:${colors.reset}`);
    console.log('  1. Make sure your Next.js app is running (npm run dev)');
    console.log('  2. Go to http://localhost:3000/login');
    console.log('  3. Use the same email and password\n');

  } catch (error) {
    console.error(`${colors.red}✗${colors.reset} Error: ${error.message}\n`);
    
    if (error.message.includes('fetch')) {
      console.log(`${colors.yellow}Possible solutions:${colors.reset}`);
      console.log(`  1. Check if Directus URL is correct: ${DIRECTUS_URL}`);
      console.log('  2. Make sure Directus is running and accessible');
      console.log('  3. Check your network connection\n');
    }
    
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error(`${colors.red}Error: Missing required arguments${colors.reset}\n`);
  console.log('Usage: node scripts/test-login.js <email> <password>');
  console.log('');
  console.log('Example:');
  console.log('  node scripts/test-login.js admin@example.com "MyPassword123!"');
  process.exit(1);
}

const [email, password] = args;

// Run the test
testLogin(email, password)
  .then(() => {
    console.log(`${colors.green}Test complete!${colors.reset}\n`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(`${colors.red}Fatal error:${colors.reset} ${error.message}\n`);
    process.exit(1);
  });

