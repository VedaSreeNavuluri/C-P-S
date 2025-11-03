# Community Problem Solver - Setup Guide

This guide will help you set up both the front-end and back-end of the Community Problem Solver application.

## Prerequisites

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)

## Backend Setup

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   - Create a `.env` file in the `server` directory
   - Copy the following content:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/community-solver
     JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
     ```
   - **For MongoDB Atlas:** Replace `MONGODB_URI` with your Atlas connection string
   - **Change JWT_SECRET** to a secure random string in production

4. **Start MongoDB (if using local MongoDB):**
   - Make sure MongoDB service is running on your system
   - On Windows: MongoDB usually runs as a service automatically
   - On Mac/Linux: `sudo systemctl start mongod` or `brew services start mongodb-community`

5. **Start the backend server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

   The server will run on `http://localhost:5000`

## Frontend Setup

1. **Navigate to the project root (if not already there):**
   ```bash
   cd ..
   ```

2. **Install dependencies (if not already installed):**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
  - Body: `{ name, email, password }`
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`

### Reports
- `GET /api/report` - Get all reports
- `POST /api/report` - Create a new report (with file upload)
  - Body: FormData with `name`, `category`, `description`, `file` (optional)
- `GET /api/report/:id` - Get a single report
- `PATCH /api/report/:id/status` - Update report status

### Contact
- `POST /api/contact` - Submit a contact form
  - Body: `{ name, email, message }`
- `GET /api/contact` - Get all contact messages (admin)

## Features Implemented

✅ User Authentication (Signup/Login)
✅ Report Submission with Image Upload
✅ Contact Form
✅ Past Works Display (Resolved Reports)
✅ File Upload Handling
✅ JWT Authentication
✅ MongoDB Database Integration

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongosh` (should connect successfully)
- Check if the connection string in `.env` is correct
- For MongoDB Atlas, make sure your IP is whitelisted

### Port Already in Use
- Change the `PORT` in `.env` file
- Or stop the process using port 5000

### CORS Errors
- Make sure the backend is running before starting the frontend
- Check that the API URLs in frontend components match the backend port

### File Upload Issues
- Ensure the `uploads` directory exists in the `server` folder
- Check file size limits (currently 5MB max)

## Development Tips

- Use `npm run dev` in the server directory for auto-reload during development
- Check browser console and server logs for debugging
- MongoDB Compass can be used to view and manage your database visually

