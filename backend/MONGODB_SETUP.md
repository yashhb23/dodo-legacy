# MongoDB Atlas Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" and sign up with your email or Google account
3. Complete the registration form

### Step 2: Create a Free Cluster
1. After logging in, click "Build a Database"
2. Select **FREE** tier (M0 Sandbox - perfect for development)
3. Choose your preferred cloud provider and region (select one closest to you)
4. Cluster Name: `dodo-legacy` (or any name you prefer)
5. Click "Create Cluster" - this takes 1-3 minutes

### Step 3: Create Database User
1. Go to "Database Access" in the left sidebar (under Security)
2. Click "Add New Database User"
3. Authentication Method: **Password**
4. Username: Choose a username (e.g., `dodo_admin`)
5. Password: Click "Autogenerate Secure Password" and **SAVE IT**
6. Database User Privileges: Select "Read and write to any database"
7. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar (under Security)
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (adds 0.0.0.0/0)
   - ⚠️ For production, restrict to specific IPs
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" button on your cluster
3. Select "Connect your application"
4. Driver: **Python**, Version: **3.12 or later**
5. Copy the connection string - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` with your database username
7. Replace `<password>` with your saved password

### Step 6: Configure Backend
1. Copy `env.example` to `.env` in the backend directory:
   ```bash
   cp env.example .env
   ```
2. Edit `.env` and paste your connection string:
   ```
   MONGO_URL=mongodb+srv://dodo_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=dodo_legacy
   CORS_ORIGINS=http://localhost:3000
   ```
3. Save the file

### Step 7: Test Connection
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload
```

You should see:
```
INFO:     Successfully connected to MongoDB database: dodo_legacy
INFO:     Backend server ready at /api endpoints
```

## Troubleshooting

### Connection Error: "Authentication failed"
- Double-check username and password in connection string
- Make sure you replaced `<password>` with actual password (no < > brackets)

### Connection Error: "Connection timeout"
- Check Network Access settings in MongoDB Atlas
- Make sure 0.0.0.0/0 is added (or your specific IP)
- Check your firewall/VPN settings

### Database Not Found
- MongoDB creates databases automatically when first document is inserted
- The database will be created when you POST to `/api/status` for the first time

## Testing the API

Once backend is running, test endpoints:

```bash
# Health check
curl http://localhost:8000/api/

# Create status check
curl -X POST http://localhost:8000/api/status \
  -H "Content-Type: application/json" \
  -d '{"client_name": "test_client"}'

# Get all status checks
curl http://localhost:8000/api/status
```

## Production Configuration

For production deployment:
1. Create a separate production cluster in MongoDB Atlas
2. Use different database name (e.g., `dodo_legacy_prod`)
3. Restrict Network Access to your production server IPs only
4. Use environment variables on your hosting platform
5. Never commit `.env` file to git (already in .gitignore)
