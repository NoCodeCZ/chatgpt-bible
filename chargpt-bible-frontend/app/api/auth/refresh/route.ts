import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { directusRefresh } from '@/lib/auth';

/**
 * POST /api/auth/refresh
 *
 * Refresh access token using refresh token
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'No refresh token' },
        { status: 401 }
      );
    }

    // Refresh tokens with Directus
    const authResponse = await directusRefresh(refreshToken);

    // Update cookies
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

    return NextResponse.json({ message: 'Token refreshed' });
  } catch (error) {
    console.error('Token refresh error:', error);

    // Clear invalid tokens
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    return NextResponse.json(
      { message: 'Token refresh failed' },
      { status: 401 }
    );
  }
}
