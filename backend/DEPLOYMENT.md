# Deployment Guide for Vercel

## Important Notes for Vercel Deployment

1. **File Uploads**: Vercel serverless functions don't support persistent file storage. For production, consider using:
   - Cloudinary
   - AWS S3
   - Cloudflare R2
   - Or any cloud storage service

2. **Environment Variables**: Make sure to set these in Vercel dashboard:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Your JWT secret key

3. **API Routes**: The API is accessible at:
   - `https://your-domain.vercel.app/api/auth/login`
   - `https://your-domain.vercel.app/api/report`
   - etc.

## Steps to Deploy

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Navigate to server folder**:
   ```bash
   cd server
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `MONGODB_URI` with your MongoDB Atlas connection string
   - Add `JWT_SECRET` with a secure random string

5. **Update Frontend API URLs**:
   - Change all `http://localhost:5000/api/...` to `https://your-api-url.vercel.app/api/...`
   - Or use environment variables in your React app

## Frontend Environment Variable Example

Create a `.env` file in your React app root:
```
REACT_APP_API_URL=https://your-api-url.vercel.app
```

Then update axios calls to use:
```javascript
axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, ...)
```

## Temporary File Upload Fix

For now, file uploads will save to `/tmp` in Vercel (temporary storage). For production, integrate cloud storage.

