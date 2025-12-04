# Quick Start: Deploy to Vercel

## Story 1.7: Deploy Frontend to Vercel

### ✅ Pre-Deployment Checklist

- [x] Build succeeds locally (`npm run build`)
- [x] All code committed to git
- [x] Directus URL identified: `https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io`

### 🚀 Deployment Steps

#### 1. Push to GitHub (if not already done)

```bash
cd chargpt-bible-frontend
git add .
git commit -m "feat: prepare for Vercel deployment - Story 1.7"
git push origin main
```

#### 2. Deploy to Vercel

**Option A: Via Vercel Dashboard (Recommended for first deployment)**

1. Go to https://vercel.com and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `chargpt-bible-frontend` (if needed)
   - **Build Command:** `npm run build` (default)
5. **Add Environment Variable:**
   - Name: `NEXT_PUBLIC_DIRECTUS_URL`
   - Value: `https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io`
   - Apply to: Production, Preview, Development
6. Click **"Deploy"**
7. Wait ~2-3 minutes for deployment

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd chargpt-bible-frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? chargpt-bible-frontend
# - Directory? ./
# - Override settings? No

# Add environment variable
vercel env add NEXT_PUBLIC_DIRECTUS_URL
# Enter: https://directus-ywk84gg0gsg0swcck0kscwcc.app.thit.io
# Apply to: Production, Preview, Development

# Redeploy with env var
vercel --prod
```

#### 3. Verify Deployment

After deployment completes, test these URLs:

- ✅ Landing: `https://your-project.vercel.app/`
- ✅ Prompts: `https://your-project.vercel.app/prompts`
- ✅ Test: `https://your-project.vercel.app/test-directus`

### 📋 Acceptance Criteria Status

| AC | Requirement | Status |
|----|-------------|--------|
| AC1 | Repository connected to Vercel | ⏳ Manual step |
| AC2 | Automatic deployment on push to main | ✅ Enabled by default |
| AC3 | Production env vars configured | ⏳ Manual step |
| AC4 | Custom domain or Vercel subdomain | ✅ Vercel subdomain provided |
| AC5 | HTTPS enabled | ✅ Automatic via Vercel |
| AC6 | Site accessible at public URL | ⏳ After deployment |
| AC7 | All pages functional in production | ⏳ After deployment |
| AC8 | Preview deployments for PRs | ✅ Enabled by default |

### 🔧 Post-Deployment Verification

Run these checks after deployment:

```bash
# 1. Check landing page loads
curl -I https://your-project.vercel.app/

# 2. Check prompts page
curl -I https://your-project.vercel.app/prompts

# 3. Verify environment variable is set
# (Check in Vercel dashboard: Settings → Environment Variables)
```

### 🐛 Known Issues

**Navigation Collection Errors (Non-Critical)**
- Build shows errors about `navigation` collection not existing
- **Impact:** None - navigation gracefully falls back to empty array
- **Status:** Acceptable for MVP (navigation is optional feature)
- **Fix:** Create navigation collection in Directus or remove navigation code

### 📝 Next Steps

After successful deployment:

1. ✅ **Story 1.7 Complete** - Deployment verified
2. ➡️ **Story 1.8** - Seed Directus with initial prompt data
3. ➡️ **Epic 2** - Content Management & Discovery

### 📚 Resources

- Full deployment guide: `DEPLOYMENT.md`
- Vercel docs: https://vercel.com/docs
- Next.js deployment: https://nextjs.org/docs/app/building-your-application/deploying

---

**Ready to deploy!** Follow the steps above to complete Story 1.7.

