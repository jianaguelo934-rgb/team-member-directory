# Team Member Directory

A full-stack web application for managing team members, built with Node.js, Express.js (MVC), JSON Server, JWT authentication, and Vanilla JS.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Web Framework | Express.js |
| Data Layer | JSON Server |
| Authentication | bcryptjs + JWT |
| Frontend | Vanilla JS |

## Project Structure

```
Team Member Directory/
├── backend/
│   ├── controllers/
│   │   ├── authController.js    # Login & signup logic
│   │   └── memberController.js  # CRUD logic
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification
│   ├── models/
│   │   ├── userModel.js         # User data access (JSON Server)
│   │   └── memberModel.js       # Member data access (JSON Server)
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth/*
│   │   └── memberRoutes.js      # /api/members/* (protected)
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── css/style.css
│   ├── js/
│   │   ├── api.js       # HTTP client
│   │   ├── auth.js      # Auth UI logic
│   │   ├── members.js   # Members UI + CRUD
│   │   └── app.js       # App bootstrap
│   └── index.html
├── db.json              # JSON Server database
└── README.md
```

## Setup & Run

### Prerequisites
- Node.js v16+
- npm

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

Edit `backend/.env` if needed:
```
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JSON_SERVER_URL=http://localhost:3001
```

### 3. Start JSON Server (Terminal 1)
```bash
cd backend
npx json-server --watch ../db.json --port 3001
```

### 4. Start Express Server (Terminal 2)
```bash
cd backend
npm start


# or for development with auto-reload:
npm run dev
```

### 5. Open the app

Visit: [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/signup | Register new user | No |
| POST | /api/auth/login | Login | No |
| GET | /api/auth/logout | Get current user | Yes |

### Members
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/members | Get all members | Yes |
| GET | /api/members/:id | Get one member | Yes |
| POST | /api/members | Create member | Yes |
| PUT | /api/members/:id | Update member | Yes |
| DELETE | /api/members/:id | Delete member | Yes |

## Features

- **Authentication** — Signup/Login with bcrypt password hashing and JWT tokens
- **Protected Routes** — All member endpoints require a valid JWT
- **Full CRUD** — Create, Read, Update, Delete team members
- **Skeleton Loading** — Animated placeholders while data loads
- **Modals** — Add/Edit member form, detail view, delete confirmation
- **Search & Filter** — Filter by name, role, department, and status
- **Grid/List View** — Toggle between card grid and list layout
- **Stats Dashboard** — Total, active, inactive counts and department count
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Toast Notifications** — Success/error feedback for all actions
