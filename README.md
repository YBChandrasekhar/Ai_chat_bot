# 🤖 AI Chatbot

A full-stack AI-powered chatbot application built with Next.js, Node.js, Express.js, MongoDB, and Tailwind CSS. Features real-time messaging via Socket.io and AI responses powered by Groq API (Llama 3.3).

## 🌐 Live Demo
- **Frontend**: https://ai-chat-bot-git-master-ybchandrasekhars-projects.vercel.app
- **Backend**: https://ai-chat-bot-2thl.onrender.com

---

## ✨ Features

- 🔐 **User Authentication** — JWT-based register & login
- 💬 **Real-time Chat** — Socket.io powered live messaging
- 🤖 **AI Responses** — Groq API (llama-3.3-70b-versatile)
- 📜 **Chat History** — MongoDB persistent storage
- ⚙️ **Personalization** — Dark/Light theme, chatbot name, chat style
- 👍 **Response Rating** — Like/Dislike AI responses
- 🛡️ **Admin Panel** — User management & analytics dashboard
- 🔒 **Security** — Helmet, rate limiting, input validation
- ⚡ **Performance** — Response caching, gzip compression

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js 5 |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (jsonwebtoken, bcryptjs) |
| AI | Groq API (llama-3.3-70b-versatile) |
| Real-time | Socket.io |
| Security | Helmet, express-rate-limit, express-validator |
| Deployment | Vercel (frontend), Render (backend) |

---

## 📁 Project Structure

```
Ai_chat_bot/
├── frontend/                  → Next.js App
│   ├── app/
│   │   ├── chat/page.tsx      → Main chat page
│   │   ├── login/page.tsx     → Login page
│   │   ├── register/page.tsx  → Register page
│   │   ├── settings/page.tsx  → User settings
│   │   └── admin/page.tsx     → Admin dashboard
│   ├── components/
│   │   ├── MessageBubble.tsx  → Chat message component
│   │   └── ChatInput.tsx      → Message input component
│   ├── context/
│   │   └── AuthContext.tsx    → Global auth state
│   └── services/
│       └── api.ts             → Axios API calls
│
└── backend/                   → Node.js + Express API
    ├── controllers/           → Business logic
    ├── models/                → MongoDB schemas
    ├── routes/                → API endpoints
    ├── middleware/            → Auth, validation, rate limit
    ├── services/              → AI & cache services
    ├── socket.js              → Socket.io handler
    └── server.js              → Entry point
```

---

## 🚀 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login & get JWT token |
| POST | /api/chat/message | Send message to AI |
| GET | /api/chat/history | Get chat history |
| GET | /api/preferences | Get user preferences |
| PUT | /api/preferences | Update preferences |
| PUT | /api/preferences/rate/:id | Rate AI response |
| GET | /api/admin/analytics | Admin analytics |
| GET | /api/admin/users | All users list |
| PUT | /api/admin/users/:id/toggle | Toggle user status |
| PUT | /api/admin/users/:id/make-admin | Promote to admin |

---

## 🗄️ MongoDB Schemas

**User**: name, email, password (hashed), role, isActive, lastLogin, preferences  
**Message**: userId, sessionId, role (user/ai), content, rating  
**Session**: userId, title, messages[]

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Backend
```bash
cd backend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
```

### Frontend
```bash
cd frontend
# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
echo "NEXT_PUBLIC_SOCKET_URL=http://localhost:5000" >> .env.local
npm install
npm run dev
```

### Environment Variables

**Backend `.env`:**
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/chatbot
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:3000
```

**Frontend `.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## 🔐 Security Features

- JWT authentication with 7-day expiry
- Bcrypt password hashing (salt rounds: 10)
- Helmet HTTP security headers
- Rate limiting (auth: 10/15min, chat: 20/min)
- Input validation with express-validator
- Request body size limit (10kb)
- Admin role-based access control

---

## 📊 Admin Panel

Access the admin panel by setting `role: "admin"` in MongoDB for your user.

Features:
- 📈 Total users, messages, sessions analytics
- 📊 Messages per day bar chart
- 👍👎 AI response rating stats
- 👥 User management (activate/deactivate/promote)

---

## 🗓️ Development Journey

| Day | Feature |
|-----|---------|
| Day 1 | Project setup & architecture |
| Day 2 | Database design & JWT auth |
| Day 3 | Groq AI integration |
| Day 4 | Frontend chat UI |
| Day 5 | Login & Register pages |
| Day 6 | Error handling & validation |
| Day 7 | UI/UX refinements |
| Day 8 | Socket.io real-time chat |
| Day 9 | User personalization & ratings |
| Day 10 | Security & performance |
| Day 11 | Admin panel & analytics |
| Day 12 | Final testing & fixes |
| Day 13 | Deployment |
| Day 14 | Documentation |

---

## 👨‍💻 Author

**Chandrasekhar Yaragalla**  
GitHub: [@YBChandrasekhar](https://github.com/YBChandrasekhar)
