import { createDirectus, rest } from '@directus/sdk';

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

if (!directusUrl) {
  throw new Error('NEXT_PUBLIC_DIRECTUS_URL environment variable is required');
}

export const directus = createDirectus(directusUrl).with(rest());
