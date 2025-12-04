# Deployment Guide: Story 1.7

## Vercel Deployment Instructions

This guide walks through deploying the CharGPT Bible frontend to Vercel.

### Prerequisites

- ✅ Next.js application builds successfully (`npm run build`)
- ✅ Git repository initialized and committed
- ✅ Vercel account (free tier is sufficient for MVP)
- ✅ Directus instance URL: `https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io`

### Step 1: Prepare Repository

```bash
# Ensure all changes are committed
cd chargpt-bible-frontend
git add .
git commit -m "feat: prepare for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. **Sign up/Login to Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub (recommended) or email

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import from GitHub (or Git provider)
   - Select the repository: `chargpt-bible-frontend`
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `chargpt-bible-frontend` (if repo is in subdirectory)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

### Step 3: Configure Environment Variables

**Critical:** Add these environment variables in Vercel dashboard:

1. Navigate to: **Project Settings → Environment Variables**

2. Add the following variables:

   ```
   NEXT_PUBLIC_DIRECTUS_URL=https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io
   ```

   **For all environments:** Production, Preview, Development

3. Click "Save"

### Step 4: Deploy

1. Click **"Deploy"** button
2. Vercel will:
   - Install dependencies
   - Run build command
   - Deploy to production
3. Wait for deployment to complete (~2-3 minutes)

### Step 5: Verify Deployment

After deployment completes:

1. **Check Deployment URL**
   - Vercel provides: `https://your-project.vercel.app`
   - Or custom domain if configured

2. **Test Pages:**
   - ✅ Landing page: `https://your-project.vercel.app/`
   - ✅ Prompt list: `https://your-project.vercel.app/prompts`
   - ✅ Prompt detail: `https://your-project.vercel.app/prompts/[id]` (use a valid prompt ID)
   - ✅ Test Directus: `https://your-project.vercel.app/test-directus`

3. **Verify Environment Variables:**
   - Check browser console for errors
   - Test Directus connection works

### Step 6: Configure Automatic Deployments

**Automatic deployments are enabled by default:**
- ✅ Push to `main` branch → Production deployment
- ✅ Pull requests → Preview deployment
- ✅ All branches → Preview deployment (optional)

**To verify:**
- Go to **Project Settings → Git**
- Confirm repository is connected
- Check "Production Branch" is set to `main`

### Step 7: Custom Domain (Optional for MVP)

1. Go to **Project Settings → Domains**
2. Click "Add Domain"
3. Enter your domain (e.g., `chargptbible.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (~24 hours)

**Note:** Vercel subdomain (`your-project.vercel.app`) is acceptable for MVP.

### Troubleshooting

#### Build Fails

**Error: "NEXT_PUBLIC_DIRECTUS_URL is not defined"**
- Solution: Add environment variable in Vercel dashboard (Step 3)

**Error: "Module not found"**
- Solution: Ensure `package.json` has all dependencies
- Run `npm install` locally to verify

**Error: "TypeScript errors"**
- Solution: Fix TypeScript errors before deploying
- Run `npx tsc --noEmit` locally

#### Deployment Succeeds but Pages Don't Work

**404 Errors:**
- Check route structure matches Next.js App Router conventions
- Verify `app/` directory structure

**Directus Connection Errors:**
- Verify `NEXT_PUBLIC_DIRECTUS_URL` is set correctly
- Check Directus instance is accessible
- Verify Directus Public role permissions

**Navigation Collection Errors (Non-Critical):**
- Current build shows navigation collection errors during static generation
- These are non-blocking - pages still render correctly
- To fix: Either create navigation collection in Directus or remove navigation code

### Environment Variables Reference

| Variable | Value | Required | Notes |
|----------|-------|----------|-------|
| `NEXT_PUBLIC_DIRECTUS_URL` | `https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io` | ✅ Yes | Directus API endpoint |

### Post-Deployment Checklist

- [ ] Landing page loads successfully
- [ ] Prompt list page displays prompts
- [ ] Prompt detail page shows full prompt text
- [ ] Copy to clipboard button works
- [ ] All pages are mobile-responsive
- [ ] HTTPS is enabled (automatic via Vercel)
- [ ] Environment variables are set correctly
- [ ] Automatic deployments are working

### Next Steps

After successful deployment:

1. **Story 1.8:** Seed Directus with initial prompt data
2. **Epic 2:** Content Management & Discovery features
3. **Epic 3:** Authentication & Access Control

### Support

- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/app/building-your-application/deploying
- Directus API: https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io

---

**Story 1.7 Status:** Ready for deployment
**Last Updated:** 2025-11-23

