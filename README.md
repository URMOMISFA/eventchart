# Prediction Betting App

A Kalshi-like prediction market app where users bet with virtual coins on user-created events.

## Features

- User registration and authentication
- Create and view prediction events
- Bet on events with coins
- Real-time chatrooms for events
- Direct messages between users
- Profile editing

## Tech Stack

- Backend: Node.js, Express, Socket.io, MongoDB, Mongoose
- Frontend: React, Tailwind CSS, React Router
- Authentication: JWT

## Setup

1. Install dependencies: `npm install`
2. Install client dependencies: `cd client && npm install`
3. Start MongoDB
4. Run development: `npm run dev:full`
5. Build for production: `npm run build`

## Deployment

### Backend
Deploy the backend to a Node.js hosting service like Heroku, Vercel, or Railway.

1. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`
2. Deploy the root directory (excluding client folder if separate).

### Frontend
Deploy to GitHub Pages:

1. Create a GitHub repository.
2. Update `client/package.json`:
   - Change `"homepage"` to `"https://yourusername.github.io/your-repo-name"`
   - Update `client/.env` `REACT_APP_BACKEND_URL` to your deployed backend URL.
3. Push code to GitHub.
4. Run `npm run deploy` from the client folder to deploy to GitHub Pages.

For full functionality, ensure the backend is deployed and accessible.