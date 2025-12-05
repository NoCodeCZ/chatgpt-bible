import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { directusRegister, directusLogin, validateToken } from '@/lib/auth';

/**
 * POST /api/auth/register
 *
 * Register new user and automatically log them in
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Create user in Directus
    await directusRegister({
      email,
      password,
      first_name,
      last_name,
    });

    // Auto-login after registration
    const authResponse = await directusLogin({ email, password });

    // Get user data
    const user = await validateToken(authResponse.access_token);

    if (!user) {
      return NextResponse.json(
        { message: 'Registration successful but login failed' },
        { status: 500 }
      );
    }

    // Set httpOnly cookies
    const cookieStore = await cookies();

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

    return NextResponse.json({
      user,
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Registration failed' },
      { status: 400 }
    );
  }
}
