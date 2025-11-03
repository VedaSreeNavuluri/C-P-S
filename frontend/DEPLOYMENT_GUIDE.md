# Deployment Guide

## Problem
Vercel is a **frontend hosting service**. Your Express backend needs to be deployed separately.

## Solution: Deploy Backend Separately

### Option 1: Deploy to Render (Recommended - Free)

1. **Create a Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Prepare Your Backend**
   - Make sure your `server` folder has all files
   - Ensure `package.json` has a `start` script

3. **Deploy on Render**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository
   - Settings:
     - **Root Directory**: `server`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Add Environment Variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Your secret key
     - `PORT`: (Leave empty, Render sets this automatically)
   - Click "Create Web Service"

4. **Get Your Backend URL**
   - After deployment, you'll get a URL like: `https://your-app.onrender.com`
   - Copy this URL

5. **Update Vercel Environment Variables**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add: `REACT_APP_API_URL` = `https://your-app.onrender.com`
   - Redeploy your Vercel app

### Option 2: Deploy to Railway (Alternative - Free Trial)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables (same as Render)
6. Railway will auto-detect and deploy
7. Get your URL and update Vercel environment variable

### Option 3: Deploy to Heroku (Alternative)

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-secret
   ```
5. Deploy: `git push heroku main`
6. Get URL and update Vercel

## Important Notes

### File Uploads Issue
The file upload feature stores files locally on the server. For production:

**Option A: Use Cloud Storage (Recommended)**
- Upload to AWS S3, Cloudinary, or similar
- Update `server/middleware/upload.js` to use cloud storage

**Option B: Use External Storage Service**
- Consider using a service like Cloudinary for image uploads

### CORS Configuration
Make sure your backend allows requests from your Vercel domain:

```javascript
// In server.js, update CORS:
app.use(cors({
  origin: [
    'https://your-vercel-app.vercel.app',
    'http://localhost:3000' // For local development
  ]
}));
```

## Testing After Deployment

1. Backend should be accessible at: `https://your-backend-url.onrender.com/api/health`
2. Frontend should call: `${API_URL}/api/auth/login` which will use the environment variable
3. Check browser console for any CORS or connection errors

## Quick Checklist

- [ ] Backend deployed (Render/Railway/Heroku)
- [ ] Environment variables set in backend service
- [ ] `REACT_APP_API_URL` set in Vercel environment variables
- [ ] CORS configured to allow Vercel domain
- [ ] MongoDB Atlas network access allows backend server IP
- [ ] Both frontend and backend redeployed

## Troubleshooting

- **500 Error**: Check backend logs in Render/Railway dashboard
- **CORS Error**: Update CORS settings in backend
- **Connection Failed**: Verify `REACT_APP_API_URL` is set correctly in Vercel
- **MongoDB Error**: Check MongoDB Atlas network access and connection string

