import { createDirectus, rest, staticToken } from '@directus/sdk';

// Public URL for client-side requests (browser)
const publicDirectusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

// Internal URL for server-side requests (Coolify internal network)
// Falls back to public URL if not set
const internalDirectusUrl = process.env.DIRECTUS_INTERNAL_URL || publicDirectusUrl;

const directusToken = process.env.DIRECTUS_TOKEN;

if (!publicDirectusUrl) {
  throw new Error('NEXT_PUBLIC_DIRECTUS_URL environment variable is required');
}

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
