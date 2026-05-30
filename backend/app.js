const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Security headers
app.use(helmet());

// Compress responses
app.use(compression());

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://ai-chat-bot-beta-six.vercel.app",
  "https://ai-chat-bot-six-gamma.vercel.app",
  "https://ai-chat-bot-git-master-ybchandrasekhars-projects.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));

// Body parser
app.use(express.json({ limit: "10kb" }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/preferences", require("./routes/preferences"));
app.use("/api/admin", require("./routes/admin"));

app.get("/", (req, res) => res.json({ message: "Chatbot API running" }));

// Global error handler
app.use(errorHandler);

module.exports = app;
