/**
 * Server-side authentication utilities
 * 
 * Functions for checking user authentication and subscription status
 * in Server Components and API routes.
 */

import { cookies } from 'next/headers';
import { validateToken, directusRefresh } from '@/lib/auth';
import type { User } from '@/types/User';

/**
 * Get current authenticated user from cookies (server-side)
 * 
 * @returns User object if authenticated, null otherwise
 */
export async function getServerUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const refreshToken = cookieStore.get('refresh_token')?.value;

    // No tokens = not authenticated
    if (!accessToken && !refreshToken) {
      return null;
    }

    // Try to validate access token
    if (accessToken) {
      const user = await validateToken(accessToken);
      if (user) {
        return user;
      }
    }

    // Access token invalid/expired - try refresh
    if (refreshToken) {
      try {
        const authResponse = await directusRefresh(refreshToken);

        // Update cookies with new tokens
        cookieStore.set('access_token', authResponse.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: authResponse.expires / 1000,
          path: '/',
        });

        cookieStore.set('refresh_token', authResponse.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });

        // Get user with new token
        const user = await validateToken(authResponse.access_token);
        return user;
      } catch {
        // Refresh failed - clear cookies
        cookieStore.delete('access_token');
        cookieStore.delete('refresh_token');
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error('Server auth check error:', error);
    return null;
  }
}

/**
 * Check if user has paid subscription
 * 
 * @param user - User object (can be null)
 * @returns true if user has paid subscription
 */
export function isPaidUser(user: User | null): boolean {
  if (!user) return false;
  return user.subscription_status === 'paid';
}
