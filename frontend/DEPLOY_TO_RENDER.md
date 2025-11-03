# Deploy Backend to Render and Frontend to Vercel

This guide walks through deploying the Express backend (in `server/`) to Render and the React frontend to Vercel. It also includes a sample `render.yaml` and a GitHub Actions workflow that builds the frontend and triggers a Vercel deploy.

## Summary
- Backend: Render (recommended) — keeps server separate and persistent file storage can be addressed.
- Frontend: Vercel (already configured via `vercel.json`) — static hosting of `build/`.

## Environment variables

Backend (`server` service on Render) needs:
- `MONGODB_URI` — MongoDB connection string (Atlas recommended)
- `JWT_SECRET` — secret used to sign JWT tokens

Frontend (Vercel project) needs:
- `REACT_APP_API_URL` — full URL of your backend, e.g. `https://my-backend.onrender.com`

Note: `vercel.json` references a Vercel secret named `react_app_api_url` (see below). You may either set the project environment variable `REACT_APP_API_URL` in the Vercel UI, or create a secret named `react_app_api_url` and reference it.

## Deploy backend to Render (manual)

1. Push your repository to GitHub (if not already).
2. Create an account on https://render.com and connect your GitHub account.
3. Click "New +" → "Web Service" → select your repository.
4. In the service settings, set:
   - Root Directory: `server`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables in Render:
   - `MONGODB_URI` = your MongoDB connection string
   - `JWT_SECRET` = a secure random value
6. Deploy and copy the service URL (for example: `https://my-backend.onrender.com`).

## Configure Vercel

1. In your Vercel project, go to Settings → Environment Variables.
2. Add `REACT_APP_API_URL` with value equal to your Render backend URL (for Production and Preview as needed).
3. Redeploy your Vercel project.

## GitHub Actions workflow (CI)

I added a workflow `.github/workflows/deploy.yml` that:
- Runs on push to `main`.
- Builds the frontend (runs `npm ci` and `npm run build`).
- Installs `vercel` CLI and runs `vercel --prod` (requires `VERCEL_TOKEN` secret).

You must add the following GitHub Secrets to your repository for the workflow to deploy successfully:

- `VERCEL_TOKEN` — a personal token from Vercel (set in your Vercel account)

Optional (to trigger a Render redeploy via API):
- `RENDER_API_KEY` — Render API key
- `RENDER_SERVICE_ID` — the Render service ID (format `srv-xxxxx`)

See the workflow file for placeholders and usage notes.

## Notes on file uploads

The backend saves uploaded files to `server/uploads/` using the local filesystem. In production this will not persist reliably if you deploy as serverless functions — use S3/Cloudinary for uploads if you need durable cloud storage.

## Troubleshooting

- If frontend cannot reach backend, ensure `REACT_APP_API_URL` is correct in Vercel settings.
- Check Render logs for backend errors (database connection, missing env vars).

---
If you'd like, I can also:
- Create a GitHub Action that triggers Render via API (needs `RENDER_API_KEY` and `RENDER_SERVICE_ID`).
- Convert the backend to Vercel serverless functions (this requires refactoring uploads to cloud storage).
