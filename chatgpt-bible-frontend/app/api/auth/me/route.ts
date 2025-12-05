import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateToken, directusRefresh } from '@/lib/auth';

/**
 * GET /api/auth/me
 *
 * Get current authenticated user
 * Attempts token refresh if access token is expired
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const refreshToken = cookieStore.get('refresh_token')?.value;

    // No tokens = not authenticated
    if (!accessToken && !refreshToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Try to validate access token
    if (accessToken) {
      const user = await validateToken(accessToken);
      if (user) {
        return NextResponse.json({ user });
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
        if (user) {
          return NextResponse.json({ user });
        }
      } catch {
        // Refresh failed - clear cookies
        cookieStore.delete('access_token');
        cookieStore.delete('refresh_token');
      }
    }

    return NextResponse.json(
      { message: 'Not authenticated' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Authentication error' },
      { status: 500 }
    );
  }
}
