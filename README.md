# Real-Time Chat App

A real-time messaging app built with the MERN stack and Socket.io for instant, bidirectional communication. Features a colorful split-screen auth UI and a dark, cyan-accented chat interface.

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, DaisyUI, Zustand, Axios, React Router, Socket.io-client

**Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io, JWT authentication, bcryptjs

## Features

- User registration and login with JWT-based authentication (httpOnly cookies)
- Real-time messaging with Socket.io
- Online/offline user status indicators
- Unread message badges per conversation
- Search for users to start new conversations
- Responsive layout (mobile sidebar/chat toggle)
- Protected routes (redirect to login if not authenticated)

## Project Structure

```
ChatApp/
├── backend/
│   ├── Controller/       # Route handlers (auth, users, messages)
│   ├── DB/                # MongoDB connection
│   ├── Middleware/        # Auth middleware (isLogin)
│   ├── Models/            # Mongoose schemas (User, Message, Conversation)
│   ├── Router/            # Express routers
│   ├── Socket/             # Socket.io server setup
│   ├── Utils/              # JWT helper
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── context/        # Auth and Socket context providers
│   │   ├── home/            # Home page + Sidebar + MessageContainer
│   │   ├── Login/
│   │   ├── register/
│   │   ├── utils/           # Route protection (VerifyUser)
│   │   ├── Zustand/         # Conversation state store
│   │   ├── App.jsx
│   │   └── main.jsx
└── README.md
```

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/lubaiqa/ChatApp.git
cd ChatApp
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with:

```
MONGODB_CONNECT=your_mongodb_connection_string
JWT_SECRET=your_random_secret_string
PORT=3000
```

Run the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies `/api` requests to the backend on `http://localhost:3000`.

### 4. Run both together (optional)

From the project root, install `concurrently` and add a `dev` script that runs both:

```bash
npm install --save-dev concurrently
npm run dev
```

## Environment Variables

| Variable          | Description                        |
| ----------------- | ---------------------------------- |
| `MONGODB_CONNECT` | MongoDB Atlas connection string    |
| `JWT_SECRET`      | Secret key used to sign JWT tokens |
| `PORT`            | Port the backend server runs on    |

## License

ISC
