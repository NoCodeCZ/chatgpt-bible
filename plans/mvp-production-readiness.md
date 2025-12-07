# Implementation Plan: MVP Production Readiness

## Overview

Make the application production-ready for MVP launch, focusing on prompt and user usage functionality (excluding Stripe integration). Address critical issues in authentication flow, error handling, UX, and production configuration.

**Goals:**
- Allow public browsing of free prompts (no auth required)
- Improve error handling and user feedback
- Fix styling inconsistencies
- Add environment validation
- Enhance security and performance

---

## Research Summary

Key findings from research:
- Prompt detail page requires authentication even for free prompts (blocks public browsing)
- Error pages use light theme instead of dark theme
- Skeleton components use gray colors instead of dark theme
- No environment variable validation (fails at runtime)
- Access control based on prompt index (order-dependent, fragile)
- No rate limiting on API routes
- Missing security headers

---

## Tasks

### Task 1: Allow Public Browsing of Free Prompts

**File**: `chatgpt-bible-frontend/app/prompts/[id]/page.tsx`  
**Lines**: 46-53

**BEFORE**:
```typescript
  // Check authentication and access control
  const user = await getServerUser();
  const hasAccess = await canAccessPrompt(user, prompt.id);

  // Unauthenticated users: redirect to login with return URL
  if (!user) {
    redirect(`/login?returnUrl=${encodeURIComponent(`/prompts/${id}`)}`);
  }
```

**AFTER**:
```typescript
  // Check authentication and access control
  const user = await getServerUser();
  const hasAccess = await canAccessPrompt(user, prompt.id);

  // Allow public viewing - show locked state for premium prompts
  // Only redirect to login if user tries to access locked content
  // (This allows public browsing of free prompts)
```

**Notes**: Remove the redirect for unauthenticated users. The `hasAccess` check will handle showing locked content via the `PromptDetail` component. Note: `isPaidUser(user)` safely handles null user (returns false), so no additional null check needed.

---

### Task 2: Fix Error Page Styling (Dark Theme)

**File**: `chatgpt-bible-frontend/app/prompts/[id]/error.tsx`  
**Lines**: 25-40

**BEFORE**:
```typescript
  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Something went wrong
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Failed to load prompt. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
```

**AFTER**:
```typescript
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-6 text-6xl">⚠️</div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Something went wrong
        </h1>
        <p className="text-lg text-zinc-400 mb-8">
          Failed to load prompt. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-purple-500/25"
        >
          Try Again
        </button>
      </div>
    </div>
  );
```

**Notes**: Match dark theme used throughout the app. Use purple accent color to match brand.

---

### Task 3: Fix Prompts List Error Page Styling

**File**: `chatgpt-bible-frontend/app/prompts/error.tsx`  
**Lines**: 17-35

**BEFORE**:
```typescript
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Failed to load prompts
        </h2>
        <p className="text-gray-600 mb-6">
          We encountered an error while loading the prompts. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
```

**AFTER**:
```typescript
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-6 text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Failed to load prompts
        </h2>
        <p className="text-zinc-400 mb-6">
          We encountered an error while loading the prompts. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-purple-500/25"
        >
          Try again
        </button>
      </div>
    </div>
  );
```

**Notes**: Match dark theme and purple accent.

---

### Task 4: Fix Skeleton Component Styling (Dark Theme)

**File**: `chatgpt-bible-frontend/components/prompts/PromptListSkeleton.tsx`  
**Lines**: 1-21

**BEFORE**:
```typescript
export default function PromptListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse"
        >
          <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-1 w-full"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 w-5/6"></div>
          <div className="flex gap-2 mb-3">
            <div className="h-6 bg-blue-200 rounded w-16"></div>
            <div className="h-6 bg-purple-200 rounded w-16"></div>
          </div>
          <div className="h-6 bg-green-200 rounded w-20"></div>
        </div>
      ))}
    </div>
  );
}
```

**AFTER**:
```typescript
export default function PromptListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl shadow-sm animate-pulse"
        >
          <div className="h-6 bg-zinc-800 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-zinc-800 rounded mb-1 w-full"></div>
          <div className="h-4 bg-zinc-800 rounded mb-4 w-5/6"></div>
          <div className="flex gap-2 mb-3">
            <div className="h-6 bg-zinc-800 rounded w-16"></div>
            <div className="h-6 bg-zinc-800 rounded w-16"></div>
          </div>
          <div className="h-6 bg-zinc-800 rounded w-20"></div>
        </div>
      ))}
    </div>
  );
}
```

**Notes**: Use dark theme colors (zinc-900, zinc-800) to match the app's dark design.

---

### Task 5: Fix Prompt Detail Skeleton Styling

**File**: `chatgpt-bible-frontend/components/prompts/PromptDetailSkeleton.tsx`  
**Lines**: 13-48

**BEFORE**:
```typescript
export default function PromptDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="h-12 bg-gray-300 rounded w-3/4"></div>

      {/* Description skeleton */}
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-full"></div>
        <div className="h-6 bg-gray-200 rounded w-5/6"></div>
      </div>

      {/* Metadata skeleton */}
      <div className="flex gap-4">
        <div className="h-8 bg-blue-200 rounded-full w-24"></div>
        <div className="h-8 bg-purple-200 rounded-full w-24"></div>
        <div className="h-8 bg-green-200 rounded-full w-20"></div>
      </div>

      {/* Prompt text skeleton */}
      <div className="mt-8">
        <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-11/12"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-10/12"></div>
          </div>
        </div>
      </div>

      {/* Button skeleton */}
      <div className="h-14 bg-blue-300 rounded-lg w-full md:w-48"></div>
    </div>
  );
}
```

**AFTER**:
```typescript
export default function PromptDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="h-12 bg-zinc-800 rounded w-3/4"></div>

      {/* Description skeleton */}
      <div className="space-y-2">
        <div className="h-6 bg-zinc-800 rounded w-full"></div>
        <div className="h-6 bg-zinc-800 rounded w-5/6"></div>
      </div>

      {/* Metadata skeleton */}
      <div className="flex gap-4">
        <div className="h-8 bg-zinc-800 rounded-full w-24"></div>
        <div className="h-8 bg-zinc-800 rounded-full w-24"></div>
        <div className="h-8 bg-zinc-800 rounded-full w-20"></div>
      </div>

      {/* Prompt text skeleton */}
      <div className="mt-8">
        <div className="h-6 bg-zinc-800 rounded w-32 mb-4"></div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="space-y-3">
            <div className="h-4 bg-zinc-800 rounded w-full"></div>
            <div className="h-4 bg-zinc-800 rounded w-11/12"></div>
            <div className="h-4 bg-zinc-800 rounded w-full"></div>
            <div className="h-4 bg-zinc-800 rounded w-10/12"></div>
          </div>
        </div>
      </div>

      {/* Button skeleton */}
      <div className="h-14 bg-zinc-800 rounded-xl w-full md:w-48"></div>
    </div>
  );
}
```

**Notes**: Match dark theme with zinc colors and rounded-xl borders.

---

### Task 6: Add Environment Variable Validation

**File**: `chatgpt-bible-frontend/lib/directus.ts`  
**Lines**: 1-38

**BEFORE**:
```typescript
import { createDirectus, rest, staticToken } from '@directus/sdk';

// Public URL for client-side requests (browser)
const publicDirectusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

// Internal URL for server-side requests (Coolify internal network)
// Falls back to public URL if not set
const internalDirectusUrl = process.env.DIRECTUS_INTERNAL_URL || publicDirectusUrl;

const directusToken = process.env.DIRECTUS_TOKEN;

if (!publicDirectusUrl) {
  throw new Error('NEXT_PUBLIC_DIRECTUS_URL environment variable is required');
}
```

**AFTER**:
```typescript
import { createDirectus, rest, staticToken } from '@directus/sdk';

/**
 * Validate required environment variables at module load time
 * This ensures we fail fast with clear error messages
 */
function validateEnvironment() {
  const requiredVars = {
    NEXT_PUBLIC_DIRECTUS_URL: process.env.NEXT_PUBLIC_DIRECTUS_URL,
  };

  const missing = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file or deployment configuration.'
    );
  }

  // Validate URL format
  const publicUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL!;
  try {
    new URL(publicUrl);
  } catch {
    throw new Error(
      `Invalid NEXT_PUBLIC_DIRECTUS_URL format: ${publicUrl}\n` +
      'Expected a valid URL (e.g., https://your-instance.directus.app)'
    );
  }
}

// Validate on module load
validateEnvironment();

// Public URL for client-side requests (browser)
const publicDirectusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL!;

// Internal URL for server-side requests (Coolify internal network)
// Falls back to public URL if not set
const internalDirectusUrl = process.env.DIRECTUS_INTERNAL_URL || publicDirectusUrl;

const directusToken = process.env.DIRECTUS_TOKEN;
```

**Notes**: Add validation function that runs at module load time. Provides clear error messages for missing or invalid configuration.

---

### Task 7: Create Environment Validation Utility

**File**: `chatgpt-bible-frontend/lib/utils/env-validation.ts` (NEW FILE)

**BEFORE**: (File doesn't exist)

**AFTER**:
```typescript
/**
 * Environment variable validation utilities
 * 
 * Validates required environment variables and provides helpful error messages
 * for development and production environments.
 */

interface EnvVar {
  name: string;
  value: string | undefined;
  required: boolean;
  validator?: (value: string) => boolean;
  errorMessage?: string;
}

/**
 * Validate environment variables
 * 
 * @param vars - Array of environment variable definitions
 * @throws Error if validation fails
 */
export function validateEnvVars(vars: EnvVar[]): void {
  const missing = vars
    .filter((v) => v.required && !v.value)
    .map((v) => v.name);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file or deployment configuration.'
    );
  }

  // Validate format if validator provided
  const invalid = vars
    .filter((v) => v.value && v.validator && !v.validator(v.value))
    .map((v) => v.name);

  if (invalid.length > 0) {
    const messages = invalid.map((name) => {
      const varDef = vars.find((v) => v.name === name);
      return varDef?.errorMessage || `Invalid format for ${name}`;
    });

    throw new Error(messages.join('\n'));
  }
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get environment variable with validation
 * 
 * @param name - Environment variable name
 * @param required - Whether variable is required
 * @param defaultValue - Default value if not required and not set
 * @returns Environment variable value
 * @throws Error if required and missing
 */
export function getEnvVar(
  name: string,
  required: boolean = true,
  defaultValue?: string
): string {
  const value = process.env[name];

  if (required && !value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
      'Please check your .env.local file or deployment configuration.'
    );
  }

  return value || defaultValue || '';
}
```

**Notes**: Reusable utility for validating environment variables across the app.

---

### Task 8: Enhance Security Headers Configuration

**File**: `chatgpt-bible-frontend/next.config.ts`  
**Lines**: 6-26

**BEFORE**:
```typescript
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
```

**AFTER**:
```typescript
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Changed from DENY to allow same-origin embedding
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin', // Changed from strict-origin-when-cross-origin
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
```

**Notes**: Enhance existing security headers by adding additional protections. Changed X-Frame-Options to SAMEORIGIN (allows same-origin embedding which may be needed for iframes) and updated Referrer-Policy for better compatibility.

---

### Task 9: Improve Access Control Error Messages

**File**: `chatgpt-bible-frontend/lib/utils/access-control.ts`  
**Lines**: 23-47

**BEFORE**:
```typescript
export async function getPromptIndex(promptId: string | number): Promise<number> {
  try {
    // Get all published prompts ordered by ID (descending, newest first)
    // This matches the ordering used in the prompt list
    const prompts = await directus.request(
      readItems('prompts', {
        filter: { status: { _eq: 'published' } },
        fields: ['id'],
        sort: ['-id'], // Descending order (newest first)
        limit: -1, // Get all prompts
      })
    );

    // Find the index of the current prompt
    const index = prompts.findIndex(
      (p: any) => String(p.id) === String(promptId)
    );

    return index;
  } catch (error) {
    console.error('Error getting prompt index:', error);
    // On error, assume prompt is not in free tier (conservative approach)
    return -1;
  }
}
```

**AFTER**:
```typescript
export async function getPromptIndex(promptId: string | number): Promise<number> {
  try {
    // Get all published prompts ordered by ID (descending, newest first)
    // This matches the ordering used in the prompt list
    const prompts = await directus.request(
      readItems('prompts', {
        filter: { status: { _eq: 'published' } },
        fields: ['id'],
        sort: ['-id'], // Descending order (newest first)
        limit: -1, // Get all prompts
      })
    );

    // Find the index of the current prompt
    const index = prompts.findIndex(
      (p: any) => String(p.id) === String(promptId)
    );

    if (index === -1) {
      console.warn(`Prompt ${promptId} not found in published prompts list`);
    }

    return index;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error getting prompt index:', {
      promptId,
      error: errorMessage,
    });
    // On error, assume prompt is not in free tier (conservative approach)
    return -1;
  }
}
```

**Notes**: Add better logging with context (promptId) for debugging access control issues.

---

### Task 10: Add Loading State to Prompt Detail Loading Component

**File**: `chatgpt-bible-frontend/app/prompts/[id]/loading.tsx`  
**Lines**: 1-15

**BEFORE**:
```typescript
import PromptDetailSkeleton from '@/components/prompts/PromptDetailSkeleton';

/**
 * Loading UI for Prompt Detail Page
 *
 * Automatically displayed by Next.js while page.tsx Server Component is fetching.
 * Shows skeleton placeholder matching the prompt detail layout.
 */
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PromptDetailSkeleton />
    </div>
  );
}
```

**AFTER**:
```typescript
import PromptDetailSkeleton from '@/components/prompts/PromptDetailSkeleton';

/**
 * Loading UI for Prompt Detail Page
 *
 * Automatically displayed by Next.js while page.tsx Server Component is fetching.
 * Shows skeleton placeholder matching the prompt detail layout.
 */
export default function Loading() {
  return (
    <div className="relative min-h-screen bg-black">
      {/* Ambient Background (matches page.tsx) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-purple-900/20 blur-[120px] opacity-40" />
        <div className="absolute -bottom-[10%] right-[10%] h-[600px] w-[600px] rounded-full bg-blue-900/10 blur-[120px] opacity-30" />
      </div>

      <main className="mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8">
        <PromptDetailSkeleton />
      </main>
    </div>
  );
}
```

**Notes**: Match the layout and background of the actual page for consistent loading experience.

---

## Complete Chain Checklist

- [x] TypeScript Interface - No changes needed
- [x] Service Function - Access control functions exist, improved error handling
- [x] Component/Page - Multiple components updated (error pages, skeletons, prompt detail)
- [x] Directus Collection - No schema changes needed
- [x] Validation - Environment validation added
- [x] Security - Headers configuration added

---

## Directus Setup Checklist

No Directus schema changes required for this MVP readiness plan.

---

## Validation Steps

1. **Environment Validation**
   ```bash
   # Test missing env var
   unset NEXT_PUBLIC_DIRECTUS_URL
   npm run build
   # Should fail with clear error message
   ```

2. **Public Browsing Test**
   ```bash
   # Start dev server
   npm run dev
   # Visit /prompts/[id] without logging in
   # Should show prompt (locked if premium, unlocked if free)
   ```

3. **Error Page Test**
   ```bash
   # Visit non-existent prompt
   # Should show dark-themed error page
   ```

4. **Skeleton Test**
   ```bash
   # Visit /prompts with slow network (throttle in DevTools)
   # Should show dark-themed skeletons
   ```

5. **Security Headers Test**
   ```bash
   # Build and start production server
   npm run build
   npm start
   # Check response headers (use browser DevTools Network tab)
   # Should include X-Frame-Options, X-Content-Type-Options, etc.
   ```

6. **Linting**
   ```bash
   npm run lint
   ```

7. **Type Check**
   ```bash
   npx tsc --noEmit
   ```

8. **Build Test**
   ```bash
   npm run build
   ```

---

## Additional Recommendations (Post-MVP)

These can be addressed after MVP launch:

1. **Rate Limiting** - Add rate limiting to API routes (use middleware or external service)
2. **Error Tracking** - Integrate Sentry or similar for production error monitoring
3. **Analytics** - Add prompt view/copy tracking
4. **Performance Monitoring** - Add Web Vitals tracking
5. **Access Control Improvement** - Use prompt metadata field instead of index-based access
6. **CSRF Protection** - Add CSRF tokens to forms
7. **Password Requirements** - Enforce minimum password strength
8. **Input Sanitization** - Sanitize user inputs before storing

---

## Notes

- All changes maintain backward compatibility
- No breaking changes to existing functionality
- Focus on MVP-critical issues only
- Styling changes ensure consistent dark theme throughout
- Environment validation prevents runtime configuration errors
- Security headers protect against common web vulnerabilities

