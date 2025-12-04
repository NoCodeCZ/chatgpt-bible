import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { directusLogin, validateToken } from '@/lib/auth';

/**
 * POST /api/auth/login
 *
 * Authenticate user with Directus and set httpOnly cookies
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate with Directus
    const authResponse = await directusLogin({ email, password });

    // Get user data
    const user = await validateToken(authResponse.access_token);

    if (!user) {
      return NextResponse.json(
        { message: 'Failed to get user data' },
        { status: 500 }
      );
    }

    // Set httpOnly cookies
    const cookieStore = await cookies();

    // Access token - short lived (15 minutes default from Directus)
    cookieStore.set('access_token', authResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: authResponse.expires / 1000, // Convert ms to seconds
      path: '/',
    });

    // Refresh token - longer lived (7 days)
    cookieStore.set('refresh_token', authResponse.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      user,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Login failed' },
      { status: 401 }
    );
  }
}
