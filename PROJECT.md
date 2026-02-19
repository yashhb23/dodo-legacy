# Dodo Legacy — Project Documentation

## Overview

Dodo Legacy is a heritage website celebrating the history, culture, and iconic dodo bird of Mauritius. It features an interactive gallery with comments and likes, district exploration, cultural deep-dives, and a quiz.

**Live URL:** https://dodolegacy.com

---

## Architecture

```
Browser (dodolegacy.com)
   │
   ├── Frontend (Vercel)
   │     React + Tailwind + shadcn/ui
   │     Source: frontend/
   │
   └── API calls ──► Backend (Railway)
                       FastAPI + Motor (async MongoDB)
                       Source: backend/
                         │
                         └──► Database (MongoDB Atlas)
                                Cluster: dodo_legacy
```

---

## Services & Hosting

| Service         | Provider       | URL / Dashboard                                      |
| --------------- | -------------- | ---------------------------------------------------- |
| Frontend        | Vercel         | https://vercel.com/dashboard                         |
| Backend API     | Railway        | https://railway.app (dodo-legacy-production)         |
| Database        | MongoDB Atlas  | https://cloud.mongodb.com                            |
| Domain          | dodolegacy.com | DNS pointed to Vercel (A + CNAME records)            |
| Analytics       | Vercel Analytics | Built into Vercel dashboard                        |
| Heatmaps        | Microsoft Clarity | https://clarity.microsoft.com (ID: v8xaxelkq4)   |
| Product Analytics | PostHog      | Injected via index.html                              |
| Git Repository  | GitHub         | https://github.com/yashhb23/dodo-legacy              |

---

## Environment Variables

### Frontend (Vercel → Settings → Environment Variables)

| Variable              | Purpose                                  |
| --------------------- | ---------------------------------------- |
| `REACT_APP_API_URL`   | Backend URL (Railway)                    |
| `REACT_APP_CLARITY_ID`| Microsoft Clarity project ID (optional)  |

### Backend (Railway → Variables tab)

| Variable       | Purpose                                         |
| -------------- | ----------------------------------------------- |
| `MONGO_URL`    | MongoDB Atlas connection string                 |
| `DB_NAME`      | Database name (e.g. `dodo_legacy`)              |
| `CORS_ORIGINS` | Comma-separated allowed origins for CORS        |
| `ADMIN_SECRET` | Secret key to access admin endpoints            |

---

## Key Files

### Frontend (`frontend/`)

| File                              | Purpose                                       |
| --------------------------------- | --------------------------------------------- |
| `src/App.js`                      | Router — `/` landing, `/admin/comments` admin |
| `src/pages/LandingPage.jsx`       | Main page with all sections                   |
| `src/pages/AdminComments.jsx`     | Admin dashboard for comment moderation        |
| `src/components/Navigation.jsx`   | Top nav bar with dodo icon                    |
| `src/components/Footer.jsx`       | Footer with social links                      |
| `src/components/GallerySection.jsx`| Gallery grid                                 |
| `src/components/GalleryViewer.jsx`| Image modal with likes/share/comments         |
| `src/components/GalleryComments.jsx`| Comment form and list                       |
| `src/components/ShareButtons.jsx` | Twitter/Facebook/Copy share buttons            |
| `src/lib/api.js`                  | API fetch helper (`apiJson`, `getApiBaseUrl`)  |
| `src/lib/analytics.js`           | Microsoft Clarity initialization               |
| `src/data/gallery.js`            | Gallery image metadata                         |
| `src/data/districts.js`          | District data                                  |
| `public/index.html`              | HTML template, OG tags, Clarity + PostHog scripts |
| `public/dodo-icon.png`           | Dodo logo (used in nav, footer, favicon)       |

### Backend (`backend/`)

| File                    | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| `server.py`             | FastAPI app — all API routes and middleware      |
| `prohibited_words.py`   | Profanity/slur filter word list                 |
| `requirements.txt`      | Python dependencies                             |
| `env.example`           | Template for local `.env` file                  |

---

## API Endpoints

### Public

| Method | Path                                | Description              |
| ------ | ----------------------------------- | ------------------------ |
| GET    | `/api/`                             | Health check             |
| GET    | `/api/gallery/{id}/comments`        | Get approved comments    |
| POST   | `/api/gallery/{id}/comments`        | Submit a new comment     |
| GET    | `/api/gallery/{id}/likes`           | Get like count           |
| POST   | `/api/gallery/{id}/like`            | Add a like               |

### Admin (requires `?secret=ADMIN_SECRET`)

| Method | Path                                     | Description           |
| ------ | ---------------------------------------- | --------------------- |
| GET    | `/api/admin/comments`                    | All comments          |
| PUT    | `/api/admin/comments/{id}/approve`       | Approve a comment     |
| DELETE | `/api/admin/comments/{id}`               | Delete a comment      |
| GET    | `/api/admin/likes`                       | All likes             |

**Admin panel UI:** https://dodolegacy.com/admin/comments?secret=YOUR_ADMIN_SECRET

---

## MongoDB Collections

| Collection         | Fields                                              |
| ------------------ | --------------------------------------------------- |
| `gallery_comments` | id, image_id, name, message, is_approved, created_at |
| `gallery_likes`    | id, image_id, created_at                            |
| `status_checks`    | id, client_name, timestamp                          |

---

## Security

- **Rate limiting** (slowapi): 10 comments/min, 30 likes/min per IP
- **Input validation**: name max 40 chars, message max 500 chars
- **Name validation**: regex requiring real-name pattern (letters, spaces, hyphens, apostrophes)
- **Profanity filter**: 130+ blocked terms in `prohibited_words.py`
- **CORS**: locked to `dodolegacy.com` and `www.dodolegacy.com`
- **Admin auth**: secret key query parameter on all admin endpoints
- **ErrorBoundary**: React error boundary prevents full-page crashes

---

## Deployment

- **Frontend**: auto-deploys to Vercel on every push to `main`
- **Backend**: auto-deploys to Railway on every push to `main`
- Both trigger from the same GitHub repository

---

## Contact

- Site email: dodolegacy1@gmail.com
