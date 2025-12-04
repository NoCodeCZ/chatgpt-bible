import { createDirectus, rest, staticToken } from '@directus/sdk';

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const directusToken = process.env.DIRECTUS_TOKEN;

if (!directusUrl) {
  throw new Error('NEXT_PUBLIC_DIRECTUS_URL environment variable is required');
}

// Create Directus client with optional static token authentication
export const directus = directusToken
  ? createDirectus(directusUrl).with(staticToken(directusToken)).with(rest())
  : createDirectus(directusUrl).with(rest());
