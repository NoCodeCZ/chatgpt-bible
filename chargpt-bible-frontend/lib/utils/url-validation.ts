/**
 * URL validation utilities
 * 
 * Functions for validating and sanitizing URLs to prevent open redirects
 * and ensure only safe internal URLs are used.
 */

/**
 * Validate that a URL is a safe internal URL
 * 
 * Prevents open redirects by ensuring:
 * - URL is relative (starts with /)
 * - URL doesn't start with // (protocol-relative)
 * - URL doesn't contain protocol (http://, https://, etc.)
 * - URL doesn't contain external domains
 * 
 * @param url - The URL to validate
 * @returns true if URL is safe, false otherwise
 */
export function isValidInternalUrl(url: string | null | undefined): boolean {
  if (!url) {
    return false;
  }

  // Must be a relative URL (starts with /)
  if (!url.startsWith('/')) {
    return false;
  }

  // Must not be protocol-relative (//example.com)
  if (url.startsWith('//')) {
    return false;
  }

  // Must not contain protocol
  if (url.includes('://')) {
    return false;
  }

  // Must not contain external domains
  if (url.includes('@')) {
    return false;
  }

  // Decode and check for encoded protocols
  try {
    const decoded = decodeURIComponent(url);
    if (decoded.includes('://') || decoded.startsWith('//')) {
      return false;
    }
  } catch {
    // Invalid encoding, reject
    return false;
  }

  return true;
}

/**
 * Get a safe redirect URL
 * 
 * Validates the returnUrl and returns it if safe, otherwise returns fallback
 * 
 * @param returnUrl - The return URL from query params
 * @param fallback - Fallback URL if returnUrl is invalid (default: '/dashboard')
 * @returns Safe redirect URL
 */
export function getSafeRedirectUrl(
  returnUrl: string | null | undefined,
  fallback: string = '/dashboard'
): string {
  if (isValidInternalUrl(returnUrl)) {
    return returnUrl;
  }

  return fallback;
}

