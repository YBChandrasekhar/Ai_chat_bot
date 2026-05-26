const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Security headers
app.use(helmet());

// Compress responses
app.use(compression());

// CORS
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"], credentials: true }));

// Body parser
app.use(express.json({ limit: "10kb" }));

// Sanitize MongoDB queries (prevent NoSQL injection)
app.use(mongoSanitize());

// Sanitize input (prevent XSS)
app.use(xssClean());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/preferences", require("./routes/preferences"));

app.get("/", (req, res) => res.json({ message: "Chatbot API running" }));

// Global error handler
app.use(errorHandler);

module.exports = app;
