import { createDirectus, rest, staticToken } from '@directus/sdk';

/**
 * Validate required environment variables at module load time
 * This ensures we fail fast with clear error messages
 */
function validateEnvironment() {
  const requiredVars = {
    NEXT_PUBLIC_DIRECTUS_URL: process.env.NEXT_PUBLIC_DIRECTUS_URL,
  };

  const missing = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file or deployment configuration.'
    );
  }

  // Validate URL format
  const publicUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL!;
  try {
    new URL(publicUrl);
  } catch {
    throw new Error(
      `Invalid NEXT_PUBLIC_DIRECTUS_URL format: ${publicUrl}\n` +
      'Expected a valid URL (e.g., https://your-instance.directus.app)'
    );
  }
}

// Validate on module load
validateEnvironment();

// Public URL for client-side requests (browser)
const publicDirectusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL!;

// Internal URL for server-side requests (Coolify internal network)
// Falls back to public URL if not set
const internalDirectusUrl = process.env.DIRECTUS_INTERNAL_URL || publicDirectusUrl;

const directusToken = process.env.DIRECTUS_TOKEN;

/**
 * Determine which URL to use based on execution context.
 * - Server-side (Node.js): Use internal URL for faster requests within Coolify network
 * - Client-side (Browser): Use public URL
 */
function getDirectusUrl(): string {
  const isServer = typeof window === 'undefined';
  return isServer ? internalDirectusUrl! : publicDirectusUrl!;
}

// Create Directus client with optional static token authentication
function createClient() {
  const url = getDirectusUrl();
  return directusToken
    ? createDirectus(url).with(staticToken(directusToken)).with(rest())
    : createDirectus(url).with(rest());
}

export const directus = createClient();

// Export for cases where you need the public URL explicitly (e.g., for image URLs in responses)
export const directusPublicUrl: string = publicDirectusUrl!;
