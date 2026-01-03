import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateToken } from '@/lib/auth';
import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import type { PremiumStatus, PremiumLicense } from '@/types/User';

/**
 * GET /api/user/license
 *
 * Get current user's premium license status
 * Returns license info if user has premium access
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    // Not authenticated
    if (!accessToken) {
      return NextResponse.json(
        { is_premium: false, expires_at: null, license: null },
        { status: 200 }  // Return 200, not 401 - this is for public info
      );
    }

    // Validate token and get user
    const user = await validateToken(accessToken);
    if (!user) {
      return NextResponse.json(
        { is_premium: false, expires_at: null, license: null },
        { status: 200 }
      );
    }

    // Check if user has premium status
    const isPremium = user.subscription_status === 'paid';

    // If not premium, return basic response
    if (!isPremium) {
      return NextResponse.json<Partial<PremiumStatus>>({
        is_premium: false,
        expires_at: null,
        license: null,
      });
    }

    // Fetch license details from premium_licenses collection
    try {
      const licenses = await directus.request(
        readItems('premium_licenses', {
          filter: { user_id: { _eq: user.id } },
          limit: 1,
          sort: ['-created_at'],
        })
      ) as unknown as PremiumLicense[];

      const license = licenses?.[0] || null;

      return NextResponse.json<PremiumStatus>({
        is_premium: true,
        expires_at: user.subscription_expires_at,
        license,
      });
    } catch (licenseError) {
      // If premium_licenses collection doesn't exist or query fails,
      // still return premium status based on subscription_status
      console.warn('Could not fetch license details:', licenseError);
      return NextResponse.json<PremiumStatus>({
        is_premium: true,
        expires_at: user.subscription_expires_at,
        license: null,
      });
    }
  } catch (error) {
    console.error('License status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch license status' },
      { status: 500 }
    );
  }
}
