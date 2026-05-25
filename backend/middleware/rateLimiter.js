const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: "Too many attempts. Please try again after 15 minutes." },
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { message: "Too many messages. Please slow down." },
});

module.exports = { authLimiter, chatLimiter };
