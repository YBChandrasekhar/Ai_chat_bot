# AI Chatbot

Full-stack AI-powered chatbot using Next.js, Node.js, Express.js, MongoDB, and Tailwind CSS.

## Project Structure

```
/Ai_chat_bot
 ├── frontend/        → Next.js + Tailwind CSS
 └── backend/         → Node.js + Express.js + MongoDB
```

## Planned API Routes

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| POST   | /api/auth/register    | Register new user        |
| POST   | /api/auth/login       | Login and get JWT token  |
| POST   | /api/chat/message     | Send message to AI       |
| GET    | /api/chat/history     | Get user chat history    |

## MongoDB Schema Plan

**User**: name, email, password (hashed), createdAt  
**Message**: userId, role (user/ai), content, timestamp  
**Session**: userId, messages[], createdAt

## Setup

### Backend
```bash
cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, TypeScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT
- **AI**: OpenAI GPT API
- **Real-time**: Socket.io (Day 8)
