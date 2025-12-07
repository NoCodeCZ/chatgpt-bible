import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * On-Demand Cache Revalidation API Route
 * 
 * Allows manual cache clearing via webhook or admin action
 * 
 * Usage:
 * POST /api/revalidate
 * Body: { path: '/prompts/123', secret: 'your-secret' }
 * 
 * Or tag-based:
 * Body: { tag: 'prompts', secret: 'your-secret' }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, tag, secret } = body;

    // Verify secret
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Revalidate by path
    if (path) {
      await revalidatePath(path, 'page');
      return NextResponse.json({
        revalidated: true,
        path,
        now: Date.now(),
      });
    }

    // Revalidate by tag
    if (tag) {
      await revalidateTag(tag, {});
      return NextResponse.json({
        revalidated: true,
        tag,
        now: Date.now(),
      });
    }

    return NextResponse.json(
      { error: 'Missing path or tag' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error revalidating cache:', error);
    return NextResponse.json(
      { error: 'Error revalidating' },
      { status: 500 }
    );
  }
}

