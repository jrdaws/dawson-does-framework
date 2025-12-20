# 🚀 Deploy to Vercel NOW - Step-by-Step Guide

## ✅ Pre-Deployment Checklist Complete

- ✅ Build succeeds locally
- ✅ All 192 tests passing
- ✅ Production rate limiting implemented
- ✅ Error handling production-ready
- ✅ Cost controls in place
- ✅ Documentation complete

**You're ready to deploy!**

---

## 📋 What You Need

Before starting, gather these:

1. **Anthropic API Key** (Required)
   - Get from: https://console.anthropic.com
   - Format: `sk-ant-api03-...`

2. **Upstash Redis Credentials** (Optional but Recommended)
   - Get from: https://console.upstash.com
   - You'll need:
     - `UPSTASH_REDIS_REST_URL`
     - `UPSTASH_REDIS_REST_TOKEN`

3. **GitHub Account**
   - Your repository should be pushed to GitHub

4. **Vercel Account**
   - Sign up at: https://vercel.com (free)

---

## 🎯 Deployment Method: Choose One

### Option A: Vercel Dashboard (Easiest) ⭐ RECOMMENDED

**Time:** 10 minutes

**Steps:**

#### 1. Push to GitHub (If Not Already Done)

```bash
cd /Users/joseph.dawson/Documents/dawson-does-framework
git add .
git commit -m "feat: production-ready configurator with AI preview"
git push origin main
```

#### 2. Go to Vercel Dashboard

Open: https://vercel.com/new

#### 3. Import Repository

1. Click **"Add New Project"**
2. Click **"Import Git Repository"**
3. Select your GitHub account
4. Find and select: `dawson-does-framework`
5. Click **"Import"**

#### 4. Configure Project

**Framework Preset:** Next.js (should auto-detect)

**Root Directory:** Click **"Edit"** and set to: `website`

**Build Settings:** (Leave as default)
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

#### 5. Add Environment Variables

Click **"Environment Variables"** section

Add these variables:

**Required:**
```
Name:  ANTHROPIC_API_KEY
Value: sk-ant-api03-... (your actual key)
Environment: ✓ Production  ✓ Preview  ✓ Development
```

**Optional (Recommended for Production):**
```
Name:  UPSTASH_REDIS_REST_URL
Value: https://your-redis.upstash.io
Environment: ✓ Production  ✓ Preview  ✓ Development
```

```
Name:  UPSTASH_REDIS_REST_TOKEN
Value: AXXXaGciOiJIUzI1... (your token)
Environment: ✓ Production  ✓ Preview  ✓ Development
```

#### 6. Deploy

Click **"Deploy"**

Wait 2-3 minutes for build to complete.

#### 7. Get Your URL

Once deployed, you'll see:
```
🎉 Your project is live at:
https://your-project-name.vercel.app
```

**Save this URL!**

---

### Option B: Vercel CLI (Advanced)

**Time:** 15 minutes

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login

```bash
vercel login
```

Follow the prompts to authenticate.

#### 3. Deploy

```bash
cd /Users/joseph.dawson/Documents/dawson-does-framework/website
vercel
```

Answer the prompts:
- **Set up and deploy?** Yes
- **Which scope?** [Select your account]
- **Link to existing project?** No
- **What's your project's name?** dawson-framework-configurator
- **In which directory is your code located?** ./
- **Want to override settings?** No

#### 4. Add Environment Variables

```bash
# Required
vercel env add ANTHROPIC_API_KEY production
# Paste your key when prompted: sk-ant-api03-...

# Optional (for Redis)
vercel env add UPSTASH_REDIS_REST_URL production
# Paste: https://your-redis.upstash.io

vercel env add UPSTASH_REDIS_REST_TOKEN production
# Paste: AXXXaGciOiJIUzI1...
```

#### 5. Deploy to Production

```bash
vercel --prod
```

#### 6. Get Your URL

The CLI will output:
```
✅ Production: https://your-project.vercel.app
```

---

## 🧪 Testing in Production

Once deployed, follow these tests:

### Test 1: Basic Access ✅

**URL:** `https://your-project.vercel.app/configure`

**Expected:** Configurator loads with all 8 steps

**Check:**
- Page loads (no errors)
- Template cards are visible
- Step indicator shows steps 1-8
- Mode toggle works

---

### Test 2: Complete Flow ✅

**Steps:**
1. Select **SaaS Starter** template
2. Skip Step 2 (Inspiration) or add a description
3. Enter project name: **"production-test"**
4. Select integrations: **Supabase (auth+db)** and **Stripe (payments)**
5. Skip Step 5 (Environment Keys)
6. **At Step 6: Click "Generate Preview"** 🎯
7. Wait 10-30 seconds
8. Verify preview renders with terminal aesthetic
9. Try viewport controls (Desktop/Tablet/Mobile)
10. Click "Regenerate" to test it works
11. Skip Step 7 (Context)
12. At Step 8: Copy CLI command

**Expected:**
- ✅ Preview generates successfully
- ✅ Terminal aesthetic (green/cyan colors)
- ✅ Viewport controls work
- ✅ Regenerate creates new variation
- ✅ CLI command copies to clipboard

---

### Test 3: Rate Limiting ✅

**Test Demo Mode:**
1. Open configurator in **incognito/private window**
2. Complete Steps 1-5
3. At Step 6, generate preview (1st time)
4. Click "Regenerate" 4 more times (total: 5 previews)
5. Try to generate 6th preview

**Expected:**
- First 5 generations: ✅ Success
- 6th generation: ❌ "Demo limit reached"
- Should show: "Add your Anthropic API key for unlimited access"

---

### Test 4: User API Key ✅

**Test Power User Mode:**
1. In same session from Test 3
2. Click **"Add API key for unlimited generations"**
3. Enter your Anthropic API key: `sk-ant-api03-...`
4. Click "Generate Preview"
5. Generate 5 more previews (total: 10+)

**Expected:**
- ✅ No rate limit errors
- ✅ Counter disappears
- ✅ Unlimited generations work

---

### Test 5: Error Handling ✅

**Test Invalid API Key:**
1. Clear your API key (or open new incognito)
2. Add fake key: `sk-ant-invalid123`
3. Try to generate preview

**Expected:**
- ❌ Error: "Invalid API key"
- Message includes link to console.anthropic.com
- Clear recovery instructions

**Test Rate Limit Error:**
1. Use demo mode, hit 5-generation limit
2. Try 6th generation

**Expected:**
- ❌ Error: "Demo limit reached"
- Shows "Add API Key" button
- Clear upgrade path

---

### Test 6: All Templates ✅

Generate a preview for each template:
1. **SaaS Starter** - Should show hero, features, pricing
2. **E-commerce** - Should show products, cart, checkout
3. **Blog** - Should show posts, sidebar, newsletter
4. **Dashboard** - Should show metrics, charts, tables
5. **API Backend** - Should show endpoints, docs, examples
6. **Directory** - Should show listings, search, filters

**Expected:**
- ✅ All 6 templates generate successfully
- ✅ Terminal aesthetic consistent across all
- ✅ Integration points visible

---

## 📊 Monitor After Deployment

### Check Vercel Logs

**Method 1: Dashboard**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Click **"Deployments"**
4. Click on latest deployment
5. Click **"Logs"** tab

**Method 2: CLI**
```bash
vercel logs --follow
```

**Look For:**
- `[Preview Generated]` - Success logs
- `[API Error]` - Error logs
- Token usage counts
- Response times

---

### Check Anthropic Dashboard

**URL:** https://console.anthropic.com/settings/usage

**Monitor:**
- API requests count
- Token usage (input/output)
- Daily cost
- Error rate

**Set Alert:**
- Daily spend > $50 (or your threshold)

---

### Check Upstash Dashboard (If Using Redis)

**URL:** https://console.upstash.com

**Monitor:**
- Commands per day (stay under 10k for free tier)
- Latency (<50ms is good)
- Error rate

---

## 🎯 Success Criteria

After testing, verify all these are ✅:

- [ ] Website loads at production URL
- [ ] All 8 steps are functional
- [ ] AI preview generates in Step 6
- [ ] Preview shows terminal aesthetic
- [ ] Viewport controls work
- [ ] Rate limiting enforces 5 generation limit
- [ ] User API key bypasses rate limit
- [ ] Error messages are clear and actionable
- [ ] All 6 templates generate successfully
- [ ] No console errors (press F12 to check)
- [ ] Mobile responsive (try on phone or resize browser)
- [ ] CLI command copies correctly

---

## 🐛 Troubleshooting

### Issue: Build fails on Vercel

**Error:** "Module not found" or "Build failed"

**Fix:**
1. Check root directory is set to `website`
2. Verify package.json exists in website folder
3. Check build logs for specific error
4. Try rebuilding: Click "Redeploy" button

---

### Issue: Preview generation fails (500 error)

**Error:** "Failed to generate preview"

**Fix:**
1. Go to Vercel project settings
2. Check Environment Variables
3. Verify `ANTHROPIC_API_KEY` is set correctly
4. Check it's enabled for Production
5. Redeploy after adding variables

**How to Check:**
```bash
vercel env ls
```

Should show:
```
ANTHROPIC_API_KEY (Production, Preview, Development)
```

---

### Issue: Rate limiting not working

**Symptom:** Users can generate more than 5 previews

**Diagnosis:**
- Check if Redis env vars are set
- Without Redis: Falls back to client-side tracking
- This is acceptable but less accurate

**Fix (Optional):**
1. Set up Upstash Redis
2. Add environment variables
3. Redeploy

---

### Issue: Previews look broken

**Symptom:** HTML doesn't render or styles missing

**Fix:**
1. Check browser console (F12) for errors
2. Verify iframe is not blocked by browser
3. Check if Content Security Policy is blocking
4. Try different browser

---

### Issue: High API costs

**Symptom:** Anthropic bill higher than expected

**Investigation:**
1. Check Anthropic dashboard usage
2. Count generations per day
3. Verify rate limiting is working

**Solutions:**
- Lower demo limit from 5 to 3
- Add more prominent "Add API Key" messaging
- Monitor daily and set alerts

---

## 💰 Cost Tracking

### First Week Targets

- API cost < $50
- Error rate < 5%
- Rate limiting working
- No deployment issues

### Monitor Daily

**Anthropic:**
- Check usage each morning
- Set billing alert at $50/day
- Review token usage patterns

**Vercel:**
- Check bandwidth usage
- Monitor function invocations
- Review error logs

**Upstash (if using):**
- Check commands per day
- Should stay well under 10k

---

## 🎉 You're Live!

Once all tests pass, you have:

✅ **Production-ready configurator**
✅ **AI preview generation**
✅ **Rate limiting protection**
✅ **Cost controls**
✅ **Monitoring setup**

---

## 📣 Share Your Success

**Your configurator is live at:**
```
https://your-project.vercel.app/configure
```

**Next Steps:**
1. Share with users
2. Gather feedback
3. Monitor costs
4. Iterate on prompts

---

## 🆘 Need Help?

**Documentation:**
- `VERCEL_DEPLOYMENT.md` - Complete deployment guide
- `AI_PREVIEW_SYSTEM.md` - Technical architecture
- `DEPLOYMENT_READY.md` - Production status

**Support:**
- Vercel: https://vercel.com/docs
- Anthropic: https://docs.anthropic.com
- GitHub Issues: [your repo]/issues

---

## 📊 Quick Reference

```bash
# View logs
vercel logs

# Check environment variables
vercel env ls

# Redeploy
vercel --prod

# Remove deployment
vercel remove [deployment-url]
```

---

**Ready to deploy? Follow Option A (Dashboard) above! 🚀**

**Estimated time: 10 minutes**

**Your configurator is waiting to go live!**
