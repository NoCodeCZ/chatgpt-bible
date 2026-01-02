# Root Cause Analysis: Prompts Page Not Displaying Cards

**Issue URL:** https://zks8c4ww08sssg00ooow0g48.app.thit.io/prompts
**Date:** 2026-01-02
**Status:** Root Cause Identified

## Issue Summary

The `/prompts` page displays an empty state instead of showing the category-based layout with prompt cards. Users see "No categories found" message instead of the expected browsing interface.

## Symptoms

1. **Main Symptom:** The prompts page at `/prompts` shows no categories or subcategories
2. **Expected Behavior:** Page should display 14 categories with 101 subcategories containing 898+ published prompts
3. **Observed Behavior:** Empty state with "No categories found" message
4. **Build Errors:** `npm run build` shows `401 Unauthorized` errors when fetching from Directus

## Reproduction Steps

1. Visit https://zks8c4ww08sssg00ooow0g48.app.thit.io/prompts
2. Observe empty page state instead of category listings
3. Check browser console for potential API errors
4. Run `npm run build` to see server-side build errors

## Investigation

### Code Path Analysis

**Page Flow:**
1. `app/prompts/page.tsx` (line 28-85) - Main prompts page component
2. Condition checks: `if (searchQuery)` - Uses search mode, else browse mode
3. Browse mode calls `getCategoriesWithSubcategories()` from `lib/services/categories.ts`
4. `getCategoriesWithSubcategories()` (line 60-153) - Fetches categories and subcategories with prompt counts
5. `CategoryList` component renders the categories or shows empty state

**Data Verification:**
- Directus contains **14 categories**, **101 subcategories**, **898 published prompts** (verified via MCP)
- Public access to Directus works without authentication (verified via curl)
- Example: `curl "https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io/items/prompts?limit=1"` returns data

**Authentication Test:**
```bash
# With expired token (FAILS):
curl -H "Authorization: Bearer I4xPz0RYhd3OHMZAEjKZ00HUvCfIV1-n" \
  "https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io/items/prompts?limit=1"
# Response: {"errors":[{"message":"Invalid user credentials.","extensions":{"code":"INVALID_CREDENTIALS"}}]}

# Without token (WORKS):
curl "https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io/items/prompts?limit=1"
# Response: {"data":[...]} (returns prompt data)
```

### Root Cause

**PRIMARY CAUSE:** The `DIRECTUS_TOKEN` environment variable contains an **expired or invalid Directus access token**.

**Why this causes the issue:**

1. **lib/directus.ts** (line 58-63) creates the Directus client:
   ```typescript
   export const directus = directusToken
     ? createDirectus(url).with(staticToken(directusToken)).with(rest())
     : createDirectus(url).with(rest());
   ```

2. When `DIRECTUS_TOKEN` is set (even if expired), the client uses `staticToken()` authentication

3. The expired token causes **401 Unauthorized** errors on ALL Directus API requests

4. The service functions catch these errors and return empty arrays:
   - `getCategoriesWithSubcategories()` returns `[]` on error (line 144)
   - `CategoryList` receives empty array and shows empty state (line 10-28)

**Why the token is expired:**
- Directus static tokens may have expiration dates
- The token in `.env.local` was valid at some point but has since expired
- No automatic token refresh mechanism is in place

## Code References

| File | Lines | Description |
|------|-------|-------------|
| `.env.local` | 8 | `DIRECTUS_TOKEN=I4xPz0RYhd3OHMZAEjKZ00HUvCfIV1-n` (expired) |
| `lib/directus.ts` | 58-63 | Client initialization with token |
| `lib/services/categories.ts` | 60-153 | `getCategoriesWithSubcategories()` function |
| `lib/services/categories.ts` | 142-144 | Error handling returning empty array |
| `components/prompts/CategoryList.tsx` | 10-28 | Empty state rendering |

## Proposed Fix

### Option 1: Remove or Refresh the Token (Recommended)

**Immediate Fix:**
1. Remove the expired `DIRECTUS_TOKEN` from `.env.local` since public access works
2. Or generate a new static token in Directus that doesn't expire

**Steps:**
```bash
# Option A: Remove token (if public access is sufficient)
# Edit .env.local and comment out or remove DIRECTUS_TOKEN line

# Option B: Generate new token
# 1. Go to Directus Admin > Settings > Tokens
# 2. Create new static token with no expiration
# 3. Update .env.local with new token
```

### Option 2: Add Token Validation

Add a health check to validate the token on application startup:

```typescript
// lib/directus.ts
async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${url}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Use this on startup and fall back to no auth if token is invalid
```

### Option 3: Use Environment-Specific Tokens

Use different tokens for different environments and make them configurable:

```bash
# .env.production (no token for public read-only access)
DIRECTUS_TOKEN=

# .env.staging (use token for staging)
DIRECTUS_TOKEN=valid-staging-token
```

## Potential Side Effects

1. **Removing the token:**
   - ✅ Public read access to published content works fine
   - ❌ Can't access private/restricted content if needed later
   - ✅ Simpler configuration, no token expiration issues

2. **Refreshing the token:**
   - ✅ Maintains current architecture
   - ⚠️ Token may expire again in the future
   - ⚠️ Need manual process to refresh

3. **Adding validation:**
   - ✅ More robust error handling
   - ⚠️ Additional startup latency
   - ⚠️ More complex code

## Related Issues

- No related issues found in git history
- This is a deployment/configuration issue, not a code bug

## Verification Steps

After applying fix:

1. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   ```

2. **Rebuild the application:**
   ```bash
   npm run build
   ```

3. **Verify no 401 errors in build output**

4. **Test locally:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/prompts
   ```

5. **Deploy and verify production URL**

## Summary

| Aspect | Detail |
|--------|--------|
| **Root Cause** | Expired `DIRECTUS_TOKEN` causing 401 errors |
| **Impact** | All API calls fail, services return empty arrays |
| **Fix Complexity** | Low (remove or refresh token) |
| **Estimated Time** | 5 minutes |
| **Priority** | High (production site affected) |
