# 🎬 Book My Ticket — ChaiCode Hackathon

## Live Demo
[https://booking-system-nbm8.onrender.com/]()

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: JWT (Access + Refresh Token)
- **Validation**: Zod
- **Frontend**: HTML, Tailwind CSS

## Setup

### 1. Clone & Install
git clone https://github.com/priyanshupandey12/booking-system.git
cd booking-system
npm install

### 2. Environment Variables
DATABASE_URL=your_postgres_url
JWT_ACCESS_SECRET=your_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
PORT=

### 3. Run
npm run dev

## API Endpoints

### Auth (Public)
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token

### Auth (Protected)
POST /api/auth/logout

### Seats (Public)
GET /api/seats

### Seats (Protected)
PUT /api/:id/:name
GET /api/my-bookings

## Flow
Register → Login → Get Access Token → Book Seat