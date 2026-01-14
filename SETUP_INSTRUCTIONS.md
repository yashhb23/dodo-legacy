# DODO LEGACY - Setup & Launch Instructions

## Prerequisites

- Node.js 18+ and Yarn installed
- Python 3.9+ installed
- MongoDB Atlas account (free tier available)

---

## Quick Start Guide

### Step 1: MongoDB Atlas Setup (5 minutes)

Follow the detailed guide in [`backend/MONGODB_SETUP.md`](backend/MONGODB_SETUP.md) or quick steps:

1. **Create account**: Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up
2. **Create cluster**: Select FREE tier (M0 Sandbox)
3. **Create database user**: Set username/password (save these!)
4. **Configure network**: Allow access from anywhere (0.0.0.0/0) for development
5. **Get connection string**: Click "Connect" → "Connect your application" → Copy connection string
6. **Create `.env` file** in `backend/` directory:

```bash
# backend/.env
MONGO_URL=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=dodo_legacy
CORS_ORIGINS=http://localhost:3000
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn server:app --reload --port 8000
```

**Expected output:**
```
INFO:     Successfully connected to MongoDB database: dodo_legacy
INFO:     Backend server ready at /api endpoints
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Test the API:**
```bash
# In a new terminal
curl http://localhost:8000/api/
# Should return: {"message":"Hello World"}
```

### Step 3: Frontend Setup

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies (first time only)
yarn install

# Start development server
yarn start
```

**Expected output:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### Step 4: Open in Browser

Navigate to **http://localhost:3000** and enjoy! 🦤

---

## Verification Checklist

After both servers are running, verify everything works:

- [ ] Frontend loads at http://localhost:3000
- [ ] No console errors in browser DevTools (F12)
- [ ] Hero section displays with dodo image
- [ ] Navigation menu works (Heritage, Districts, Culture, Gallery, Voices)
- [ ] Discovery Widget appears in bottom-right corner
- [ ] Quiz modal opens and works
- [ ] Search modal opens (click search icon)
- [ ] District cards are clickable and open modals
- [ ] Mobile responsive (resize browser window)
- [ ] Backend health check works: http://localhost:8000/api/

---

## Troubleshooting

### Backend Issues

**Error: "Missing required environment variable"**
- Solution: Create `.env` file in `backend/` directory with MongoDB credentials

**Error: "Failed to connect to MongoDB"**
- Check MongoDB Atlas network access allows your IP (0.0.0.0/0 for development)
- Verify connection string is correct in `.env`
- Ensure password doesn't contain special characters (or URL-encode them)

**Error: "Module not found"**
- Activate virtual environment: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
- Reinstall dependencies: `pip install -r requirements.txt`

### Frontend Issues

**Error: "Cannot find module"**
- Run `yarn install` to ensure all dependencies are installed
- Delete `node_modules` and run `yarn install` again if issues persist

**Error: "Port 3000 is already in use"**
- Kill the process using port 3000 or use a different port: `PORT=3001 yarn start`

**Warning: "Compiled with warnings"**
- These are usually safe to ignore during development
- Will be fixed in production build

### MongoDB Atlas Issues

**"Cluster is deploying"**
- Wait 2-3 minutes for cluster creation to complete

**"Authentication failed"**
- Double-check username and password in connection string
- Ensure you're using the database user (not your Atlas account credentials)
- Check for special characters in password (URL-encode if needed)

---

## Production Build

Once everything works in development:

```bash
cd frontend
yarn build
```

This creates an optimized production build in `frontend/build/` directory.

**Test production build locally:**
```bash
npx serve -s build
# Opens on http://localhost:3000
```

---

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)

**Frontend:**
1. Push code to GitHub
2. Import repository in Vercel
3. Configure build settings:
   - Build Command: `cd frontend && yarn build`
   - Output Directory: `frontend/build`
4. Deploy!

**Backend:**
- Deploy separately to Railway, Render, or Fly.io
- Update `CORS_ORIGINS` environment variable with your frontend URL

### Option 2: Netlify

Similar to Vercel, excellent for static React apps.

### Option 3: Docker (All-in-One)

```bash
# Build and run with Docker Compose
docker-compose up -d
```

(Docker configuration files included in deployment configs)

### Option 4: Traditional VPS

- Frontend: Build and serve with Nginx
- Backend: Run with systemd + Nginx reverse proxy
- Detailed configuration in [`DEPLOYMENT_CONFIG.md`](DEPLOYMENT_CONFIG.md)

---

## Performance Optimization Applied

✅ **Code Splitting**: Modal components lazy-loaded with React.lazy()
✅ **Image Optimization**: WebP support, lazy loading, preload hints
✅ **Font Optimization**: Display swap, preload critical fonts
✅ **Component Memoization**: Expensive components wrapped in React.memo()
✅ **Bundle Size**: Identified 27 unused dependencies (see `BUNDLE_OPTIMIZATION.md`)
✅ **Responsive Design**: Mobile-first, optimized for all screen sizes
✅ **Touch Targets**: 44x44px minimum on mobile (WCAG compliant)
✅ **Error Handling**: Global error boundary with user-friendly fallback
✅ **SEO**: Meta tags, Open Graph, Twitter Cards, Schema.org structured data

---

## Project Structure

```
app/
├── backend/
│   ├── server.py              # FastAPI server
│   ├── requirements.txt       # Python dependencies
│   ├── env.example            # Environment variables template
│   └── MONGODB_SETUP.md      # MongoDB setup guide
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── data/              # Static data
│   │   └── hooks/             # Custom React hooks
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── package.json           # Node dependencies
│   ├── tailwind.config.js     # Tailwind configuration
│   └── BUNDLE_OPTIMIZATION.md # Bundle size guide
├── SETUP_INSTRUCTIONS.md      # This file
└── README.md                  # Project overview
```

---

## Support & Resources

- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Deployment Guide**: See DEPLOYMENT_CONFIG.md (created after build)

---

## Development Tips

1. **Hot Reloading**: Both frontend and backend support hot reloading - changes appear automatically
2. **React DevTools**: Install browser extension for better debugging
3. **Network Tab**: Use browser DevTools to inspect API calls
4. **Lighthouse**: Run audits regularly to maintain performance
5. **Mobile Testing**: Use Chrome DevTools device emulation or real devices

---

## Next Steps

After launching:

1. **Run Lighthouse Audit**: Target 90+ performance score
2. **Test Cross-Browser**: Chrome, Firefox, Safari, Edge
3. **Mobile Device Testing**: Real iPhones and Android devices
4. **SEO Verification**: Google Rich Results Test, Twitter Card Validator
5. **Analytics**: PostHog is already integrated and tracking
6. **Bundle Analysis**: Run `yarn analyze` to check bundle size

---

## Need Help?

1. Check `backend/MONGODB_SETUP.md` for MongoDB issues
2. Check `BUNDLE_OPTIMIZATION.md` for performance optimization
3. Review `test_result.md` for known working features
4. Check browser console (F12) for error messages

---

**🦤 Enjoy your DODO LEGACY website!**
