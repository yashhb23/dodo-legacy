# 🛠️ Maintenance & Error Prevention Guide

## 🚨 Common Errors & How to Prevent Them

### 1. Python Indentation Errors (IndentationError)

**What Happened:**
```python
# ❌ WRONG - Line 19 not indented
try:
mongo_url = os.environ['MONGO_URL']
    db_name = os.environ['DB_NAME']
```

**Correct Way:**
```python
# ✅ CORRECT - All lines inside try block are indented
try:
    mongo_url = os.environ['MONGO_URL']
    db_name = os.environ['DB_NAME']
```

**Prevention:**
- ✅ `.editorconfig` file added - ensures consistent indentation
- ✅ Python files use 4 spaces
- ✅ JavaScript/React files use 2 spaces
- ✅ Always run linter before committing

**Check Before Pushing:**
```bash
# In project root:
python -m py_compile backend/server.py
```

---

### 2. Gallery Images Not Showing

**Issue:** Images stored in `frontend/public/gallery/` but not loading in production

**Root Causes:**
1. Incorrect path (`/gallery/` works locally, may fail in some deployments)
2. No error handling when images fail to load

**Solution Applied:**
- ✅ Added `onError` handler to display fallback when image fails
- ✅ Console error logging for debugging
- ✅ Images are now in correct public folder

**Correct Image Paths:**
```jsx
// ✅ CORRECT - Public folder paths (Vercel/CRA standard)
image: '/gallery/le-morne-brabant.jpg'

// ❌ WRONG - Never use relative paths without process.env.PUBLIC_URL
image: './gallery/le-morne-brabant.jpg'
```

---

## 🔍 Pre-Deployment Checklist

### Before Every `git push`:

1. **Run Linter:**
   ```bash
   # Frontend
   cd frontend && npm run lint
   
   # Backend (Python syntax check)
   python -m py_compile backend/server.py
   ```

2. **Check Indentation:**
   - Open `backend/server.py` in your editor
   - Verify all code inside `try`, `except`, `def`, `class`, `if`, `for` blocks is indented
   - Use your editor's "Show whitespace" feature

3. **Test Locally:**
   ```bash
   # Backend (from backend/)
   python server.py
   
   # Frontend (from frontend/)
   npm start
   ```

4. **Check Git Status:**
   ```bash
   git status
   git diff  # Review all changes before committing
   ```

---

## 🛡️ Automatic Safeguards Added

### 1. `.editorconfig`
Ensures consistent indentation across all editors (VS Code, Cursor, etc.)

### 2. Error Handling in Code
- **Backend:** Clear error messages for missing environment variables
- **Frontend:** Image fallback for missing gallery images

### 3. Logging
- Backend logs MongoDB connection status
- Frontend console logs image loading failures

---

## 🔧 Quick Fixes for Common Issues

### Railway Deployment Crashed
1. **Check logs:** Railway Dashboard → Logs tab
2. **Look for:** `IndentationError`, `SyntaxError`, `ModuleNotFoundError`
3. **Fix:** Correct the error in your code
4. **Redeploy:** `git add . && git commit -m "fix: error message" && git push`

### Images Not Showing on Vercel
1. **Verify images exist:** Check `frontend/public/gallery/` has all images
2. **Check console:** Open browser DevTools → Console tab
3. **Look for:** "Failed to load image" errors
4. **Fix:** Ensure image paths start with `/gallery/` (no dot)

### MongoDB Connection Failed
1. **Check Railway Variables:** Ensure `MONGO_URL` and `DB_NAME` are set
2. **Verify MongoDB Atlas:** Network Access → Allow 0.0.0.0/0
3. **Test connection string:** It should start with `mongodb+srv://`

---

## 📝 Code Style Standards

### Python (Backend)
```python
# Always use 4 spaces for indentation
def my_function():
    if condition:
        do_something()
    else:
        do_something_else()

# Use try-except with proper indentation
try:
    risky_operation()
except Exception as e:
    handle_error(e)
```

### JavaScript/React (Frontend)
```jsx
// Always use 2 spaces for indentation
function MyComponent() {
  const [state, setState] = useState(null);
  
  return (
    <div>
      <p>Content</p>
    </div>
  );
}
```

---

## 🚀 Safe Deployment Workflow

```bash
# 1. Make changes locally
# ... edit your files ...

# 2. Test locally
cd frontend && npm start  # Test frontend
cd backend && python server.py  # Test backend

# 3. Check for errors
python -m py_compile backend/server.py  # Check Python syntax
cd frontend && npm run lint  # Check React/JS syntax

# 4. Review changes
git status
git diff

# 5. Commit with clear message
git add .
git commit -m "fix: describe what you fixed"

# 6. Push to deploy
git push origin main

# 7. Monitor deployment
# - Check Vercel dashboard (https://vercel.com/dashboard)
# - Check Railway logs (https://railway.app → your project → Logs)
# - Visit your live site: https://dodo-legacy.vercel.app
```

---

## 📊 Monitoring Your Deployment

### Vercel (Frontend)
- **URL:** https://vercel.com/dashboard
- **Check:** Deployment status, build logs, runtime logs
- **Expected:** "Building..." → "Ready" (green checkmark)

### Railway (Backend)
- **URL:** https://railway.app
- **Check:** Deploy Logs tab for "Successfully connected to MongoDB"
- **Expected:** Status shows "Active" (green dot)

### Live Site
- **URL:** https://dodo-legacy.vercel.app
- **Test:**
  1. All sections load (Heritage, Culture, Voices, Gallery)
  2. Gallery images display correctly
  3. Filter tabs work
  4. Timeline modal opens with single X button
  5. Navigation scrolls to correct sections

---

## 🆘 Emergency Rollback

If deployment breaks:

```bash
# 1. Check last working commit
git log --oneline -n 10

# 2. Rollback to previous commit
git revert HEAD  # Creates new commit that undoes last commit

# 3. Push to redeploy
git push origin main
```

---

## 📞 When to Ask for Help

1. **Deployment fails after following all checks** - Share error logs
2. **New Python/React syntax errors** - Share the code causing the issue
3. **MongoDB connection issues persist** - Verify connection string format
4. **Images still not loading** - Check browser console for specific errors

---

## ✅ Success Indicators

Your deployment is successful when:
- ✅ Railway shows "Active" status (green)
- ✅ Vercel shows "Ready" status (green)
- ✅ Site loads at https://dodo-legacy.vercel.app
- ✅ All gallery images visible
- ✅ No console errors in browser DevTools
- ✅ Backend logs show "Successfully connected to MongoDB"

---

**Last Updated:** January 16, 2026  
**Your Site:** https://dodo-legacy.vercel.app  
**Backend:** https://dodo-legacy-production.up.railway.app
