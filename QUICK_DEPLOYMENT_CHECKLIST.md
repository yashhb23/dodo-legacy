# ⚡ Quick Deployment Checklist - DODO LEGACY

**Time Required:** 15 minutes total
**Cost:** $5/month (Railway) + Free (everything else)

---

## 🗂️ Pre-Deployment (One-time setup)

### ☐ Step 0: Push Code to GitHub (2 min)
```bash
git init
git add .
git commit -m "Ready for deployment"
# Create repo on github.com/new
git remote add origin https://github.com/YOUR_USERNAME/dodo-legacy.git
git push -u origin main
```

---

## 💾 Part 1: MongoDB Atlas (5 min)

### ☐ 1.1 Create Account
- Go to: https://www.mongodb.com/cloud/atlas
- Sign up with Google (easiest)

### ☐ 1.2 Create FREE Cluster
- Choose: **M0 FREE** tier
- Provider: AWS
- Region: Closest to your users
- Name: `dodo-legacy`

### ☐ 1.3 Create Database User
- Username: `dodo_admin`
- Click: "Autogenerate Secure Password"
- **💾 SAVE PASSWORD!**

### ☐ 1.4 Setup Network Access
- Click: "Allow Access from Anywhere"
- Adds: `0.0.0.0/0`

### ☐ 1.5 Get Connection String
- Click: "Connect" → "Connect your application"
- Copy connection string
- Replace `<password>` with your saved password
- **💾 SAVE CONNECTION STRING!**

**✅ MongoDB Done!** You have: `mongodb+srv://dodo_admin:PASSWORD@cluster0...`

---

## 🌐 Part 2: Vercel (Frontend) (3 min)

### ☐ 2.1 Create Account
- Go to: https://vercel.com
- Sign in with GitHub

### ☐ 2.2 Import Project
- Click: "Add New Project"
- Select: Your `dodo-legacy` repo
- **Root Directory:** Click Edit → Set to `frontend` ⚠️
- Build Command: `yarn build`
- Output Directory: `build`

### ☐ 2.3 Deploy
- Click: "Deploy"
- Wait 2-3 minutes

### ☐ 2.4 Save URL
- Copy your Vercel URL: `https://dodo-legacy-xxxx.vercel.app`
- **💾 SAVE THIS URL!**

**✅ Vercel Done!** Your frontend is live!

---

## 🚂 Part 3: Railway (Backend) (5 min)

### ☐ 3.1 Create Account
- Go to: https://railway.app
- Sign in with GitHub

### ☐ 3.2 Create Project
- Click: "New Project" → "Deploy from GitHub repo"
- Select: Your `dodo-legacy` repo

### ☐ 3.3 Configure Settings
- Click your service → "Settings"
- **Root Directory:** Set to `backend` ⚠️
- **Start Command:**
  ```bash
  uvicorn server:app --host 0.0.0.0 --port $PORT
  ```

### ☐ 3.4 Add Environment Variables
Go to "Variables" tab, add these three:

1. **MONGO_URL**
   - Value: Your MongoDB connection string from Part 1

2. **DB_NAME**
   - Value: `dodo_legacy_prod`

3. **CORS_ORIGINS**
   - Value: Your Vercel URL from Part 2 (with https://)
   - Example: `https://dodo-legacy-xxxx.vercel.app`

### ☐ 3.5 Deploy
- Should auto-deploy
- Check logs for: "Successfully connected to MongoDB"

### ☐ 3.6 Generate Domain
- Settings → Networking → "Generate Domain"
- **💾 SAVE BACKEND URL!**

**✅ Railway Done!** Your backend is live!

---

## ✅ Final Verification (2 min)

### ☐ Test Frontend
- Open your Vercel URL in browser
- Check all pages load
- Open modals (District, Quiz, etc.)
- Check mobile view (use browser DevTools)

### ☐ Test Backend
```bash
# Test API health
curl https://your-railway-url.up.railway.app/api/
# Should return: {"message":"Hello World"}
```

### ☐ Check Integration
- Open browser console (F12)
- Look for any CORS errors
- Test quiz submission (if it uses backend)

---

## 🎉 You're Live!

### Your URLs:
- **Website:** `https://your-site.vercel.app`
- **Backend API:** `https://your-project.up.railway.app`
- **Database:** MongoDB Atlas (cloud-managed)

### Automatic Updates:
```bash
# Make changes
git add .
git commit -m "Update something"
git push

# Wait 2-3 minutes
# ✅ Both frontend & backend auto-deploy!
```

---

## 📊 Quick Reference

| What | Where to Check | URL |
|------|---------------|-----|
| Frontend logs | Vercel dashboard | https://vercel.com/dashboard |
| Backend logs | Railway dashboard | https://railway.app/dashboard |
| Database | MongoDB Atlas | https://cloud.mongodb.com |
| Analytics | PostHog (integrated) | Check console |

---

## 🚨 Quick Troubleshooting

### Frontend not loading?
1. Check Vercel logs for build errors
2. Verify `frontend` root directory is set
3. Check `yarn build` works locally

### Backend errors?
1. Check Railway logs
2. Verify all 3 environment variables are set
3. Test MongoDB connection string

### CORS errors?
1. Verify `CORS_ORIGINS` matches Vercel URL exactly
2. Include `https://` prefix
3. No trailing slash

---

## 💰 Costs

- **MongoDB Atlas:** $0 (FREE tier)
- **Vercel:** $0 (FREE tier)
- **Railway:** $5/month (after trial credits)

**Total:** $5/month

---

## 📱 Share Your Site!

Once verified, share your Vercel URL:
- Twitter/X
- LinkedIn
- Facebook
- Reddit (r/webdev, r/reactjs)
- Hacker News
- Product Hunt

**🦤 DODO LEGACY is now live!**
