# 🚀 KETER - Quick Deploy Reference

## ⚡ Quick Start (TL;DR)

### 1. Supabase Setup (5 min)
```bash
1. supabase.com → New Project → keter-production
2. Region: South America (São Paulo)
3. SQL Editor → Run: database/schema.sql
4. SQL Editor → Run: database/rls-policies-production.sql
5. Settings → API → Copy URL & anon key
```

### 2. Vercel Deploy (3 min)
```bash
1. vercel.com → New Project → Import Tcamargolima/KETER
2. Add Environment Variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_OPENAI_API_KEY
   - VITE_APP_NAME=KETER
   - VITE_APP_VERSION=1.0.0
   - VITE_APP_ENV=production
3. Deploy → Wait → Done! 🎉
```

### 3. Post-Deploy (2 min)
```bash
1. Test app at provided URL
2. Update VITE_APP_URL with actual URL
3. Redeploy
```

---

## 📋 Environment Variables Checklist

### Required (Must Have)
- [ ] `VITE_SUPABASE_URL` - From Supabase Settings → API
- [ ] `VITE_SUPABASE_ANON_KEY` - From Supabase Settings → API
- [ ] `VITE_OPENAI_API_KEY` - From platform.openai.com
- [ ] `VITE_APP_NAME` - Set to `KETER`
- [ ] `VITE_APP_VERSION` - Set to `1.0.0`
- [ ] `VITE_APP_ENV` - Set to `production`

### Optional (Nice to Have)
- [ ] `VITE_APP_URL` - Set after first deploy
- [ ] `VITE_SENTRY_DSN` - For error tracking
- [ ] `VITE_GA_TRACKING_ID` - For analytics

---

## ✅ Pre-Deploy Checklist

### Code Ready?
- [ ] `npm install` works
- [ ] `npm run build` succeeds
- [ ] `npm run preview` shows working app
- [ ] No critical errors in console
- [ ] All features tested locally

### Database Ready?
- [ ] Supabase project created
- [ ] Schema executed successfully
- [ ] RLS policies applied
- [ ] Can connect from local (test with .env)

### Credentials Ready?
- [ ] Supabase URL copied
- [ ] Supabase anon key copied
- [ ] OpenAI API key available
- [ ] All keys tested locally

---

## 🔧 Common Issues & Fixes

### Build fails on Vercel
```bash
✗ Check: All dependencies in package.json?
✗ Check: Node version in engines?
✗ Check: Build works locally?
→ Fix: Review Vercel build logs
```

### App loads but doesn't work
```bash
✗ Check: All env vars start with VITE_?
✗ Check: Env vars set in Vercel?
✗ Check: Marked for Production?
→ Fix: Update env vars, redeploy
```

### Database errors
```bash
✗ Check: Schema executed?
✗ Check: RLS enabled?
✗ Check: Correct Supabase URL?
→ Fix: Re-run schema.sql
```

### PWA doesn't install
```bash
✗ Check: Using HTTPS?
✗ Check: manifest.webmanifest exists?
✗ Check: Service Worker registered?
→ Fix: Check DevTools → Application
```

---

## 📊 Success Criteria

### Must Have ✅
- [x] App loads without errors
- [x] Login/Signup works
- [x] Can create and view data
- [x] PWA installs on mobile
- [x] Works offline (after first visit)

### Should Have 📈
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 90
- [ ] Lighthouse Best Practices > 90
- [ ] Lighthouse PWA > 90
- [ ] Lighthouse SEO > 90

### Nice to Have 🎯
- [ ] Custom domain configured
- [ ] Analytics tracking active
- [ ] Error tracking (Sentry) setup
- [ ] Monitoring dashboards active

---

## 🔗 Quick Links

### During Deploy
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://app.supabase.com)
- [OpenAI API Keys](https://platform.openai.com/api-keys)

### After Deploy
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [Supabase Logs](https://app.supabase.com) → Logs
- [Lighthouse CI](https://pagespeed.web.dev/)

### Documentation
- [Full Deploy Guide](./DEPLOY-GUIDE.md)
- [Environment Variables](./.env.production.example)
- [Database Schema](./database/schema.sql)
- [RLS Policies](./database/rls-policies-production.sql)

---

## 🆘 Need Help?

1. **Check logs first:**
   - Vercel: Deployments → Failed Build → Logs
   - Supabase: Dashboard → Logs
   - Browser: DevTools → Console

2. **Read full guide:**
   - See [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md) for detailed steps

3. **Common solutions:**
   - Clear cache: `rm -rf node_modules dist && npm install`
   - Reset env vars: Delete and re-add in Vercel
   - Rollback: Vercel → Deployments → Promote old version

---

**Last Updated:** 2026-02-10  
**Version:** 1.0.0  
**Status:** Production Ready ✅
