# DODO LEGACY - Deployment Configuration Guide

## Overview

This guide provides deployment configurations for multiple platforms. Choose the option that best fits your needs.

---

## Option 1: Vercel + Railway (Recommended)

### Frontend on Vercel

**Step 1: Prepare Repository**
```bash
git init
git add .
git commit -m "Initial commit - DODO LEGACY"
git remote add origin https://github.com/yourusername/dodo-legacy.git
git push -u origin main
```

**Step 2: Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `yarn build`
   - **Output Directory**: `build`
5. Click "Deploy"

**Environment Variables** (if needed for frontend):
- None required for basic setup
- If you enable MongoDB-backed features (e.g. **Gallery Comments**), add:
  - `REACT_APP_API_URL=https://<your-railway-backend>.up.railway.app`

### Backend on Railway

**Step 1: Prepare Backend**
1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set root directory to `backend`

**Step 2: Configure Environment Variables**
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=dodo_legacy_prod
CORS_ORIGINS=https://your-vercel-domain.vercel.app
```

**Step 3: Configure Start Command**
```
uvicorn server:app --host 0.0.0.0 --port $PORT
```

**Step 4: Update Frontend API URL**
- Update any API calls in frontend to use Railway backend URL
- Railway provides: `https://your-app-name.up.railway.app`

---

## Option 2: Netlify + Render

### Frontend on Netlify

**netlify.toml** (create in project root):
```toml
[build]
  base = "frontend/"
  command = "yarn build"
  publish = "build/"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

**Deploy Steps:**
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repository
4. Netlify will auto-detect settings from `netlify.toml`
5. Deploy!

### Backend on Render

**render.yaml** (create in project root):
```yaml
services:
  - type: web
    name: dodo-legacy-api
    env: python
    region: oregon
    buildCommand: "cd backend && pip install -r requirements.txt"
    startCommand: "cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: MONGO_URL
        sync: false
      - key: DB_NAME
        value: dodo_legacy_prod
      - key: CORS_ORIGINS
        sync: false
```

**Deploy Steps:**
1. Go to [render.com](https://render.com)
2. Click "New +" → "Blueprint"
3. Connect repository and select `render.yaml`
4. Add environment variables in dashboard
5. Deploy!

---

## Option 3: Docker Deployment (Any Platform)

### Dockerfile - Frontend

**frontend/Dockerfile**:
```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build app
RUN yarn build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**frontend/nginx.conf**:
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_vary on;

    # Cache static assets
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### Dockerfile - Backend

**backend/Dockerfile**:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Run app
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose

**docker-compose.yml** (project root):
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - MONGO_URL=${MONGO_URL}
      - DB_NAME=${DB_NAME}
      - CORS_ORIGINS=http://localhost:3000
    restart: unless-stopped

volumes:
  mongo_data:
```

**.env** (for Docker Compose):
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=dodo_legacy_prod
```

**Deploy with Docker:**
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Option 4: Traditional VPS (DigitalOcean, AWS, etc.)

### Prerequisites
- Ubuntu 22.04 LTS
- Root or sudo access
- Domain name (optional but recommended)

### Server Setup Script

**deploy.sh**:
```bash
#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python 3.11
sudo apt install -y python3.11 python3.11-venv python3-pip

# Install Nginx
sudo apt install -y nginx

# Install certbot for SSL (optional)
sudo apt install -y certbot python3-certbot-nginx

# Clone repository
git clone https://github.com/yourusername/dodo-legacy.git /var/www/dodo-legacy
cd /var/www/dodo-legacy

# Setup backend
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create systemd service for backend
sudo tee /etc/systemd/system/dodo-backend.service > /dev/null <<EOF
[Unit]
Description=DODO Legacy Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/dodo-legacy/backend
Environment="PATH=/var/www/dodo-legacy/backend/venv/bin"
ExecStart=/var/www/dodo-legacy/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Start backend service
sudo systemctl daemon-reload
sudo systemctl enable dodo-backend
sudo systemctl start dodo-backend

# Build frontend
cd ../frontend
npm install -g yarn
yarn install
yarn build

# Copy build to nginx
sudo cp -r build/* /var/www/html/

echo "Deployment complete!"
```

### Nginx Configuration

**/etc/nginx/sites-available/dodo-legacy**:
```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/dodo-legacy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Enable HTTPS (optional but recommended):**
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Environment Variables

### Production MongoDB Setup
1. Create separate production cluster in MongoDB Atlas
2. Use different database name: `dodo_legacy_prod`
3. Restrict network access to production server IPs only
4. Use strong passwords with special characters

### Security Best Practices
- Never commit `.env` files
- Use environment variables on hosting platforms
- Enable HTTPS/SSL for production
- Set up CORS restrictions for production domains only
- Use secure MongoDB passwords
- Regular security updates

---

## Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] MongoDB connection working
- [ ] CORS configured correctly
- [ ] HTTPS/SSL enabled (production)
- [ ] Custom domain configured (if applicable)
- [ ] Environment variables set
- [ ] API endpoints responding
- [ ] All modals working
- [ ] Images loading correctly
- [ ] Mobile responsive design working
- [ ] Lighthouse score > 90
- [ ] Analytics tracking (PostHog)
- [ ] Error monitoring configured
- [ ] Backup strategy in place

---

## Monitoring & Maintenance

### Monitoring Tools
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry
- **Analytics**: PostHog (already integrated)
- **Performance**: Google Analytics, Lighthouse CI

### Maintenance Tasks
- Weekly: Check error logs
- Monthly: Update dependencies
- Quarterly: Review performance metrics
- Annually: Renew SSL certificates (if not auto-renewed)

---

## Rollback Strategy

### Quick Rollback (Vercel/Netlify)
1. Go to deployment dashboard
2. Find previous successful deployment
3. Click "Promote to Production"

### Docker Rollback
```bash
# Tag images before deploying
docker tag dodo-frontend:latest dodo-frontend:v1.0

# Rollback
docker-compose down
docker-compose up -d dodo-frontend:v0.9
```

### VPS Rollback
```bash
# Keep previous version
cp -r /var/www/dodo-legacy /var/www/dodo-legacy-backup

# Rollback
rm -rf /var/www/dodo-legacy
mv /var/www/dodo-legacy-backup /var/www/dodo-legacy
sudo systemctl restart dodo-backend
sudo systemctl reload nginx
```

---

## Cost Estimates

### Free Tier Options
- **Frontend**: Vercel (Free), Netlify (Free)
- **Backend**: Railway ($5/mo), Render (Free tier available)
- **MongoDB**: Atlas (Free M0 cluster)
- **Total**: $0-5/month

### Production Scale
- **Frontend**: Vercel Pro ($20/mo), Netlify Pro ($19/mo)
- **Backend**: Railway Pro ($20/mo), Render Standard ($25/mo)
- **MongoDB**: Atlas M10 ($57/mo)
- **Total**: ~$96-102/month

### VPS Option
- **DigitalOcean Droplet**: $6-12/month
- **MongoDB Atlas**: Free tier
- **Domain**: $12/year
- **Total**: ~$6-12/month + domain

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app/
- **Netlify Docs**: https://docs.netlify.com/
- **Render Docs**: https://render.com/docs
- **Docker Docs**: https://docs.docker.com/
- **Nginx Docs**: https://nginx.org/en/docs/

---

**🦤 Ready to launch DODO LEGACY to the world!**
