import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateToken } from '@/lib/auth';
import { directus } from '@/lib/directus';
import { updateUser } from '@directus/sdk';

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * POST /api/user/change-password
 *
 * Change user's password
 *
 * Flow:
 * 1. Validate current password by attempting Directus login
 * 2. Update password using Directus API with admin token
 * 3. Re-issue access/refresh tokens after password change
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const refreshToken = cookieStore.get('refresh_token')?.value;

    // Must be authenticated
    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { message: 'ไม่ได้รับอนุญาต กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    // Validate token and get user
    const user = await validateToken(accessToken);
    if (!user) {
      return NextResponse.json(
        { message: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json() as ChangePasswordRequest;
    const { currentPassword, newPassword } = body;

    // Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'กรุณากรอกข้อมูลให้ครบ' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร' },
        { status: 400 }
      );
    }

    // Step 1: Verify current password by attempting login
    try {
      const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          password: currentPassword,
        }),
      });

      if (!loginResponse.ok) {
        return NextResponse.json(
          { message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' },
          { status: 400 }
        );
      }
    } catch (loginError) {
      console.error('Password verification error:', loginError);
      return NextResponse.json(
        { message: 'ไม่สามารถยืนยันรหัสผ่านได้' },
        { status: 500 }
      );
    }

    // Step 2: Update password using Directus API
    // directus client is already configured with admin token (staticToken)
    try {
      await directus.request(
        updateUser(user.id, {
          password: newPassword,
        })
      );
    } catch (updateError) {
      console.error('Password update error:', updateError);
      return NextResponse.json(
        { message: 'ไม่สามารถอัปเดตรหัสผ่านได้' },
        { status: 500 }
      );
    }

    // Step 3: Log in again with new password to get fresh tokens
    try {
      const newLoginResponse = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          password: newPassword,
        }),
      });

      if (!newLoginResponse.ok) {
        // Password was changed but token refresh failed
        console.warn('Password changed but token refresh failed');
        return NextResponse.json(
          { message: 'เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบใหม่' },
          { status: 200 }
        );
      }

      const { data: { access_token, refresh_token, expires } } = await newLoginResponse.json();

      // Set new cookies
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
      };

      const response = NextResponse.json(
        { message: 'เปลี่ยนรหัสผ่านสำเร็จ' },
        { status: 200 }
      );

      // Set new cookies
      response.cookies.set('access_token', access_token, {
        ...cookieOptions,
        expires: new Date(expires * 1000),
      });
      response.cookies.set('refresh_token', refresh_token, cookieOptions);

      return response;
    } catch (reloginError) {
      console.error('Token refresh error:', reloginError);
      return NextResponse.json(
        { message: 'เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบใหม่' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง' },
      { status: 500 }
    );
  }
}
