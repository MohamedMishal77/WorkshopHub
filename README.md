# WorkshopHub

WorkshopHub is a full-stack web application for discovering, registering, and hosting online workshops. It features a modern React frontend and a secure Node.js/Express backend with PostgreSQL.

## Features

- **User Authentication:** Register and login securely with JWT and httpOnly cookies.
- **Browse Workshops:** Discover upcoming workshops by category, date, and host.
- **Register for Events:** Seamless registration flow with confirmation and error handling.
- **Host Events:** Authenticated users can create and manage their own workshops.
- **Dashboard:** Personalized dashboard for users to view their registrations and hosted events.
- **Responsive UI:** Modern, mobile-friendly design with React and CSS modules.

## Tech Stack

- **Frontend:** React, Vite, React Router, CSS Modules
- **Backend:** Node.js, Express, PostgreSQL, JWT, bcrypt
- **Database:** Supabase-hosted PostgreSQL
- **Deployment:** Netlify (frontend), Render (backend)

## Project Structure

```
backend/
  .env
  db.js
  index.js
  package.json
  middleware/
    authMiddleware.js
  routes/
    authRoutes.js
    eventRoutes.js
    registrationRoutes.js

workshop/
  .env
  index.html
  package.json
  vite.config.js
  src/
    App.jsx
    main.jsx
    api/
      apiFetch.js
    component/
    Dashboard/
    Data/
    Pages/
    Styles/
    utils/
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database (Supabase or local)
- [Optional] Netlify/Render accounts for deployment

### Backend Setup

1. **Install dependencies:**
   ```sh
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   Edit `backend/.env` with your database URL and JWT secrets.

3. **Run the backend:**
   ```sh
   npm start
   ```
   The backend runs on `http://localhost:5000` by default.

### Frontend Setup

1. **Install dependencies:**
   ```sh
   cd workshop
   npm install
   ```

2. **Configure environment variables:**
   Edit `workshop/.env` if you need to override the API base URL.

3. **Run the frontend:**
   ```sh
   npm run dev
   ```
   The frontend runs on `http://localhost:5173` by default.

### Environment Variables

#### Backend (`backend/.env`)

- `DATABASE_URL` – PostgreSQL connection string
- `ACCESS_TOKEN_SECRET` – JWT secret for access tokens
- `REFRESH_TOKEN_SECRET` – JWT secret for refresh tokens
- `NODE_ENV` – `production` or `development`
- `CORS_ORIGIN` – Comma-separated allowed origins (e.g., `http://localhost:5173,https://theworkshophub.netlify.app`)
- `FRONTEND_URL` – URL of the deployed frontend

#### Frontend (`workshop/.env`)

- `VITE_API_BASE` – Base URL for the backend API (default: `http://localhost:5000`)

## Deployment

- **Frontend:** Deploy the `workshop` directory to Netlify or Vercel.
- **Backend:** Deploy the `backend` directory to Render, Railway, or similar Node.js hosting.

## License

This project is for educational purposes.

---

**Made with ❤️ for the learning community.**
