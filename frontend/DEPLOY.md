Deployment guide for VAC-620 (Community Problem Solver)

This project contains a React frontend (repo root) and an Express backend (server/).

Recommended approach (fastest, minimal changes):
- Frontend: Deploy to Vercel (optimized for CRA static builds)
- Backend: Deploy to Render as a Node Web Service

Render (backend)
1. Sign in to Render and connect your GitHub repository.
2. Create a new Web Service:
   - Name: community-solver-backend
   - Environment: Node
   - Branch: main
   - Root directory / Path: server
   - Build Command: npm install
   - Start Command: npm start
3. Add environment variables (use secrets):
   - MONGODB_URI = <your-mongodb-uri>
   - JWT_SECRET = <your-jwt-secret>
   - FRONTEND_URL = https://<your-vercel-domain> (optional)
4. Deploy and wait for the URL (e.g., https://community-solver-backend.onrender.com)

Vercel (frontend)
1. Sign in to Vercel and import the same GitHub repository.
2. Vercel should detect Create React App. Use defaults or set:
   - Build Command: npm run build
   - Output Directory: build
3. In Project Settings → Environment Variables add:
   - REACT_APP_API_URL = https://<your-render-backend-url>
4. Deploy. Vercel returns a domain like https://<project>.vercel.app.

Notes and security
- Do NOT commit `server/.env` or any `.env` files. Rotate your MongoDB Atlas password now if this was pushed publicly.
- `server/server.js` serves the frontend from `../build` if present. If you want to deploy backend to Render and have it serve a built frontend from the same service, adjust Render build command to first build the frontend (e.g., from repo root `npm --prefix .. run build`) — however separate hosting is simpler.

Local test commands (PowerShell)
```powershell
# from repo root
npm install
npm run build

# start server
cd server
npm install
node server.js
```

If you want me to add a simple deploy script or switch to a single-Render deployment (backend serves build), ask and I'll implement it.
