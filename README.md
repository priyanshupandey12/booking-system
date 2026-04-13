# 🎬 Book My Ticket

> A simplified cinema seat booking platform built for the **ChaiCode Hackathon** — extending a starter codebase with a full authentication layer and protected booking flow.

<br/>

## 🌐 Live Demo

**[https://booking-system-nbm8.onrender.com](https://booking-system-nbm8.onrender.com)**

<br/>

## ✨ Features

- 🔐 **User Registration & Login** with hashed passwords
- 🎟️ **JWT Authentication** — Access Token (15m) + Refresh Token (7d)
- 🪑 **Protected Seat Booking** — only logged-in users can book
- 🔄 **Token Refresh Flow** — seamless session management
- 🛡️ **Zod Validation** — request body validation on all auth routes
- 🚫 **Duplicate Booking Prevention** — PostgreSQL row-level locking (`FOR UPDATE`)
- 👤 **Booking tied to User** — name sourced from JWT, not user input
- 📋 **My Bookings** — view your own booked seats

<br/>

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Auth | JWT (jsonwebtoken) |
| Password | bcrypt |
| Validation | Zod |
| Frontend | HTML + Tailwind CSS |
| Deployment | Render |

<br/>

## 📁 Project Structure

```
book-my-ticket/
├── src/
│   ├── db/
│   │   ├── db.js              # Drizzle connection
│   │   └── schema.js          # Table definitions
│   ├── middleware/
│   │   ├── auth.middleware.js            # JWT authenticate middleware
│   │   └── validation.middleware.js        # Zod validation middleware
│   ├── validators/
│   │   └── auth.validator.js  # Register & login schemas
│   ├── services/
│   │   ├── auth.service.js    # Auth business logic + DB queries
│   │   └── seats.service.js   # Seats business logic + DB queries
│   ├── controllers/
│   │   ├── auth.controller.js # Auth request/response handlers
│   │   └── seats.controller.js
│   ├── routes/
│   │   ├── auth.routes.js     # /api/auth/*
│   │   └── seats.routes.js    # /api/*
│   └── utils/
│       ├── ApiError.js        # Custom error class
│       ├── ApiResponse.js     # Standard response format
│       └── jwtUtils.js             # Token generation & verification
├── index.html                 # Frontend
├── index.mjs                  # Entry point
├── .env                       # Environment variables
└── package.json
```

<br/>

## ⚙️ Local Setup

### 1. Clone & Install

```bash
git clone https://github.com/priyanshupandey12/booking-system.git
cd booking-system
npm install
```

### 2. Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL=postgres://user:password@localhost:5432/bookingSystem

JWT_ACCESS_SECRET=your_access_secret_key
JWT_ACCESS_EXPIRES_IN=15m

JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=7d

PORT=8080
```

### 3. Setup Database

Run these SQL statements in your PostgreSQL database:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    isbooked INT DEFAULT 0,
    user_id INTEGER REFERENCES users(id)
);

INSERT INTO seats (isbooked)
SELECT 0 FROM generate_series(1, 20);
```

### 4. Run

```bash
npm run dev     # development
npm start       # production
```

Open **http://localhost:8080** in your browser.

<br/>

## 🔌 API Reference

### Public Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Serve frontend |
| `GET` | `/api/seats` | Get all seats |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login & receive tokens |
| `POST` | `/api/auth/refresh-token` | Get new access token |

### Protected Endpoints
> Require `Authorization: Bearer <accessToken>` header

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/logout` | Logout & clear token |
| `PUT` | `/api/:id/:name` | Book a seat (legacy) |
| `GET` | `/api/my-bookings` | View your bookings |

<br/>

### Example Requests

**Register**
```json
POST /api/auth/register
{
  "name": "Priyanshu Pandey",
  "email": "priyanshu@gmail.com",
  "password": "chai1234"
}
```

**Login**
```json
POST /api/auth/login
{
  "email": "priyanshu@gmail.com",
  "password": "chai1234"
}
```

**Book a Seat**
```
PUT /api/3/Priyanshu
Authorization: Bearer <accessToken>
```

<br/>

## 🔐 Auth Flow

```
POST /register  →  Account created
      ↓
POST /login     →  Access Token (15m) + Refresh Token (7d, in cookie)
      ↓
PUT  /api/:id   →  Authorization: Bearer <accessToken>
      ↓
POST /refresh-token  →  New Access Token (when expired)
      ↓
POST /logout    →  Refresh token cleared from DB
```

<br/>

## 🛡️ Security Highlights

- Passwords hashed with **bcrypt** (10 salt rounds)
- Refresh tokens **hashed with SHA-256** before storing in DB
- Booking name sourced from **verified JWT** — no identity spoofing
- PostgreSQL **`FOR UPDATE`** row lock prevents race conditions & double bookings
- Access tokens are **short-lived (15 min)** — minimizes exposure

<br/>

## 📝 License

MIT