import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { directusLogout } from '@/lib/auth';

/**
 * POST /api/auth/logout
 *
 * Logout user, invalidate tokens, and clear cookies
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    // Invalidate refresh token in Directus
    if (refreshToken) {
      try {
        await directusLogout(refreshToken);
      } catch {
        // Ignore errors - token might already be invalid
      }
    }

    // Clear cookies
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);

    // Still clear cookies even on error
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    return NextResponse.json({ message: 'Logout successful' });
  }
}
