#!/usr/bin/env node

/**
 * Create Admin User in Directus
 * 
 * This script creates a new admin user with full access to Directus.
 * Admin users can access the Directus admin panel and have full permissions.
 * 
 * Usage:
 *   node scripts/create-admin-user.js <email> <password> [first_name] [last_name]
 * 
 * Example:
 *   node scripts/create-admin-user.js admin@example.com "SecurePassword123!" "John" "Doe"
 */

// Load environment variables
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not installed, use process.env directly
}

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || process.env.DIRECTUS_ADMIN_TOKEN;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

/**
 * Get Admin role ID from Directus
 */
async function getAdminRoleId() {
  const response = await fetch(`${DIRECTUS_URL}/roles`, {
    headers: {
      'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to fetch roles: ${error.errors?.[0]?.message || response.statusText}`);
  }

  const data = await response.json();
  const roles = data.data || [];
  
  // Find Admin role (could be "Administrator" or "Admin")
  const adminRole = roles.find(
    (role) => role.name === 'Administrator' || role.name === 'Admin'
  );

  if (!adminRole) {
    throw new Error('Admin role not found in Directus');
  }

  return adminRole.id;
}

/**
 * Create admin user in Directus
 */
async function createAdminUser(email, password, firstName, lastName) {
  console.log(`${colors.blue}=== Creating Admin User in Directus ===${colors.reset}\n`);

  // Validate required fields
  if (!email || !password) {
    console.error(`${colors.red}Error: Email and password are required${colors.reset}\n`);
    console.log('Usage: node scripts/create-admin-user.js <email> <password> [first_name] [last_name]');
    process.exit(1);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error(`${colors.red}Error: Invalid email format${colors.reset}\n`);
    process.exit(1);
  }

  // Validate password length
  if (password.length < 8) {
    console.error(`${colors.red}Error: Password must be at least 8 characters${colors.reset}\n`);
    process.exit(1);
  }

  // Check environment variables
  if (!DIRECTUS_URL) {
    console.error(`${colors.red}Error: NEXT_PUBLIC_DIRECTUS_URL environment variable is required${colors.reset}\n`);
    process.exit(1);
  }

  if (!DIRECTUS_TOKEN) {
    console.error(`${colors.red}Error: DIRECTUS_TOKEN or DIRECTUS_ADMIN_TOKEN environment variable is required${colors.reset}\n`);
    console.log('Please add the token to your .env.local file:\n');
    console.log('  DIRECTUS_TOKEN=your-admin-token-here\n');
    process.exit(1);
  }

  try {
    console.log(`${colors.yellow}→${colors.reset} Fetching Admin role ID...`);
    const adminRoleId = await getAdminRoleId();
    console.log(`${colors.green}✓${colors.reset} Admin role ID: ${adminRoleId}\n`);

    console.log(`${colors.yellow}→${colors.reset} Creating admin user...`);
    console.log(`   Email: ${email}`);
    console.log(`   Name: ${firstName || 'N/A'} ${lastName || ''}`.trim());
    console.log('');

    // Create user with Admin role
    const response = await fetch(`${DIRECTUS_URL}/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        first_name: firstName || null,
        last_name: lastName || null,
        role: adminRoleId,
        status: 'active',
        subscription_status: 'free',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.errors?.[0]?.message || response.statusText;
      
      if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
        console.error(`${colors.red}✗${colors.reset} User with email "${email}" already exists\n`);
        console.log('If you want to update an existing user to admin, do it manually in Directus Admin UI.');
        process.exit(1);
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    const user = result.data;

    console.log(`${colors.green}✓${colors.reset} Admin user created successfully!\n`);
    console.log(`${colors.green}User Details:${colors.reset}`);
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Name: ${user.first_name || 'N/A'} ${user.last_name || ''}`.trim());
    console.log(`  Role: Admin`);
    console.log(`  Status: ${user.status}`);
    console.log('');
    console.log(`${colors.green}Next Steps:${colors.reset}`);
    console.log(`  1. Login to Directus Admin UI: ${DIRECTUS_URL}`);
    console.log(`  2. Use email: ${email}`);
    console.log(`  3. Use the password you provided`);
    console.log('');

  } catch (error) {
    console.error(`${colors.red}✗${colors.reset} Error creating admin user: ${error.message}\n`);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error(`${colors.red}Error: Missing required arguments${colors.reset}\n`);
  console.log('Usage: node scripts/create-admin-user.js <email> <password> [first_name] [last_name]');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/create-admin-user.js admin@example.com "SecurePassword123!"');
  console.log('  node scripts/create-admin-user.js admin@example.com "SecurePassword123!" "John" "Doe"');
  process.exit(1);
}

const [email, password, firstName, lastName] = args;

// Run the script
createAdminUser(email, password, firstName, lastName)
  .then(() => {
    console.log(`${colors.green}Done!${colors.reset}\n`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(`${colors.red}Fatal error:${colors.reset} ${error.message}\n`);
    process.exit(1);
  });

